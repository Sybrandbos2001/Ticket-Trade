import { ConflictException, Injectable, NotFoundException,UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      await newUser.save();

      const { password, ...userWithoutPassword } = newUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.log(error);

      if (error.code === 11000) {
        // Duplicate key error (E11000)
        throw new ConflictException(
          `User with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.userModel.find().select('-password');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id).select('-password');
    } catch (error) {
      console.log(error);
      throw error;
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
      throw error;
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const saltRounds = 10;
    user.password = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);
    await user.save();
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
