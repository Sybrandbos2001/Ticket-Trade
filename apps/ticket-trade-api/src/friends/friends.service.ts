import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly userService: UserService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ){}

  async findAll(userId: string): Promise<any[]> {
    try {
      const user = await this.userModel.findById(userId).select('following');
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      const friendsList = user.following;
  
      const friendProfiles = await Promise.all(
        friendsList.map(async (id) => {
          return this.userService.getProfile('id', id);
        }),
      );
  
      return friendProfiles;
    } catch (error) {
      console.error(error.message);
      throw new Error(`Error fetching friends list: ${error.message}`);
    }
  }

  async followUser(currentUserId: string, userIdToFollow: string) {
    await this.userModel.updateOne(
        { _id: currentUserId },
        { $addToSet: { following: userIdToFollow } }
    );

    const session = this.neo4jService.getSession();
    await session.run(
      `MATCH (follower:User {id: $currentUserId}), (followee:User {id: $userIdToFollow})
      MERGE (follower)-[:FOLLOWS]->(followee)`,
      { currentUserId, userIdToFollow },
    );
  }

  async unfollowUser(currentUserId: string, userIdToFollow: string) {
    await this.userModel.updateOne(
      { _id: currentUserId },
      { $pull: { following: userIdToFollow } }
    );

    const session = this.neo4jService.getSession();
    await session.run(
      `MATCH (follower:User {id: $currentUserId})-[r:FOLLOWS]->(followee:User {id: $userIdToFollow})
      DELETE r`,
      { currentUserId, userIdToFollow },
    );
  }

  async getFollowRecommendations(userId: string) {
    const session = this.neo4jService.getSession();
    const result = await session.run(
      `
      MATCH (user:User {id: $userId})-[:FOLLOWS]->(friend:User)-[:FOLLOWS]->(potential:User)
      WHERE NOT (user)-[:FOLLOWS]->(potential) AND user <> potential
      RETURN 
        potential.id AS recommendedUserId, 
        potential.username AS recommendedUsername, 
        COUNT(friend) AS mutualFriendCount, 
        COLLECT(friend.username) AS mutualFriends
      ORDER BY mutualFriendCount DESC
      LIMIT 5
      `,
      { userId }
    );
  
    return result.records.map(record => ({
      recommendedUserId: record.get('recommendedUserId'),
      recommendedUsername: record.get('recommendedUsername'),
      mutualFriendCount: record.get('mutualFriendCount').toNumber(),
      mutualFriends: record.get('mutualFriends'), 
    }));
  }
}
