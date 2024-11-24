import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    try {
      return await this.userModel.find().select('name lastname username following -_id');
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(username: string) {
    try {
      const user = await this.userModel.findOne({  username: username }).select('name lastname username following -_id');;
      return user;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`User with username ${username} not found`);
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
  }

  async unfollowUser(currentUserId: string, userId: string) {
    await this.userModel.updateOne(
      { _id: currentUserId },
      { $pull: { following: userId } }
    );
  }

  async findByEmailOrUsername(identifier: string) {
    try {
      const user = await this.userModel.findOne({ $or: [{ email: identifier }, { username: identifier }] });
      return user;
    } catch (error) {
      console.error('Error in findByEmailOrUsername:', error.message);
    }
  }
}
