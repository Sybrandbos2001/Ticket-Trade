import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class AuthService {
    constructor(
      @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
      private userService: UserService, 
      private jwtService : JwtService,
      private readonly neo4jService: Neo4jService) {}

    async signIn(loginDto : LoginDto): Promise<string> {
        const user = await this.userService.findUserByField('email', loginDto.email);

        if (!user) {
          throw new NotFoundException(`User with email ${loginDto.email} not found`);
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Password is incorrect');
        }

        const payload = { 
          sub: user._id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        };
        
        const token = await this.jwtService.signAsync(payload);

        return token;
    }

    async register(registerDto: RegisterDto) {
        try {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    
          const newUser = new this.userModel({
            ...registerDto,
            password: hashedPassword,
          });
    
          await newUser.save();
    
          const session = this.neo4jService.getSession();
          await session.run(
            `CREATE (u:User {id: $id, username: $username, email: $email})`,
            {
              id: newUser._id.toString(),
              username: newUser.username,
              email: newUser.email,
            },
          );

          const { password, ...userWithoutPassword } = newUser.toObject();
          return userWithoutPassword;
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key error (E11000)
            throw new ConflictException(
              `User with the same ${Object.keys(error.keyValue)[0]} already exists`
            );
          }
        }
    }

    async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.userService.findUserByField('email', email);
        if (!user) {
          throw new NotFoundException(`User with email ${email} not found`);
        }
    
        const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    
        if (!isMatch) {
          throw new UnauthorizedException('Current password is incorrect');
        }
    
        const saltRounds = 10;
        user.password = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);
        await user.save();
      }
}
