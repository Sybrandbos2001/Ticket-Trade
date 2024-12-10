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
  ) {}

  async findAll() {
    try {
      return await this.userModel.find().select('name lastname username following -_id');
    } catch (error) {
      console.error(error);
    }
  }

  async findUserByField(field: 'id' | 'email' | 'username', value: string) {
    try {
      let query;
  
      switch (field) {
        case 'id':
          query = { _id: value };
          break;
        case 'email':
          query = { email: value };
          break;
        case 'username':
          query = { username: value };
          break;
        default:
          throw new Error(`Invalid field: ${field}`);
      }
  
      const user = await this.userModel.findOne(query);
  
      if (!user) {
        throw new NotFoundException(`User with ${field} ${value} not found`);
      }
  
      return user;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`User with ${field} ${value} not found`);
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

  async getProfile(field: 'id' | 'username', value: string) {
    try {
      const query = field === 'id' ? { _id: value } : { username: value };
      const user = await this.userModel.findOne(query).select('name lastname username following -_id');
  
      if (!user) {
        throw new NotFoundException(`User with ${field} ${value} not found`);
      }
  
      return user;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`User with ${field} ${value} not found`);
    }
  }
  
}
