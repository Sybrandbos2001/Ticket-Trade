import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class UserService {
  constructor(
  @InjectModel(User.name) private userModel: Model<UserDocument>,
  private readonly neo4jService: Neo4jService) {}

  async findAll() {
    try {
      return await this.userModel.find().select('name lastname username following -_id');
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id).select('-password -__v');
      return user;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async getFullUser(identifier: string){
    try {
      const user = await this.userModel.findOne({ $or: [{ email: identifier }, { username: identifier }] });
      return user;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`User with email or ID ${identifier} not found`);
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const { password, ...userWithoutPassword } = updatedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        throw new ConflictException(
          `User with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async followUser(currentUserId: string, userId: string) {
    await this.userModel.updateOne(
        { _id: currentUserId },
        { $addToSet: { following: userId } }
    );

    const session = this.neo4jService.getSession();
    await session.run(
      `MATCH (follower:User {id: $currentUserId}), (followee:User {id: $userId})
      MERGE (follower)-[:FOLLOWS]->(followee)`,
      { currentUserId, userId },
    );
  }

  async unfollowUser(currentUserId: string, userId: string) {
    await this.userModel.updateOne(
      { _id: currentUserId },
      { $pull: { following: userId } }
    );

    const session = this.neo4jService.getSession();
    await session.run(
      `MATCH (follower:User {id: $currentUserId})-[r:FOLLOWS]->(followee:User {id: $userId})
      DELETE r`,
      { currentUserId, userId },
    );
  }

  async getProfile(identifier: string) {
    try {
      const user = await this.userModel.findOne({ $or: [{ email: identifier }, { username: identifier }] });
      return user;
    } catch (error) {
      console.error('Error in findByEmailOrUsername:', error.message);
    }
  }

  async getFollowRecommendations(userId: string) {
    const session = this.neo4jService.getSession();
    const result = await session.run(
      `MATCH (user:User {id: $userId})-[:FOLLOWS]->(friend:User)-[:FOLLOWS]->(potential:User)
      WHERE NOT (user)-[:FOLLOWS]->(potential) AND user <> potential
      RETURN potential.id AS recommendedUserId, potential.username AS recommendedUsername, COUNT(friend) AS mutualFriendCount
      ORDER BY mutualFriendCount DESC
      LIMIT 5`,
      { userId }
    );
  
    return result.records.map(record => ({
      recommendedUserId: record.get('recommendedUserId'),
      recommendedUsername: record.get('recommendedUsername'),
      mutualFriendCount: record.get('mutualFriendCount'),
    }));
  }
  
}
