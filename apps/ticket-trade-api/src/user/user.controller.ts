import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<object> {
    const newUser = await this.userService.create(createUserDto);
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve single user by ID' })
  @ApiResponse({ status: 200, description: 'Single user by ID', type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 201, description: 'User updated successfully', type: User })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<object> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @Patch(':id/password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 201, description: 'Password changed successfully' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto): Promise<object> {
    await this.userService.changePassword(id, changePasswordDto);
    return {
      message: 'Password changed successfully',
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 201, description: 'User deleted successfully' })
  async remove(@Param('id') id: string): Promise<object> {
    await this.userService.remove(id);
    return {
      message: 'User deleted successfully',
    };
  }

  @Post(':id/follow')
  @HttpCode(200)
  @ApiOperation({ summary: 'Follow user by ID' })
  @ApiResponse({ status: 201, description: 'User has been successfully followed' })
  async followUser(@Param('id') userId: string, @Req() req) {
    const currentUserId = req.user.id; 
    
    // Check if user to follow is not the same as the current user
    if (currentUserId === userId) {
        throw new BadRequestException('You can not follow yourself');
    }

    // Check if user to follow exists
    await this.userService.findOne(userId);

    // Follow user
    await this.userService.followUser(currentUserId, userId);
    return {
      message: 'User has been successfully followed',
    };
  }
}
