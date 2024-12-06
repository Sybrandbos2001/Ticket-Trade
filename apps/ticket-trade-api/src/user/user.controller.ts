import { Controller, Request, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { IAuthRequest, Role } from '@ticket-trade/domain';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Roles( Role.ADMIN)
  @Get('id/:id')
  @ApiOperation({ summary: 'Retrieve single user by ID' })
  @ApiResponse({ status: 200, description: 'Single user by ID', type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 201, description: 'User updated successfully', type: User })
  async update(@Request() req : IAuthRequest, @Body() updateUserDto: UpdateUserDto): Promise<object> {
    const updatedUser = await this.userService.update(req.user.sub, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 201, description: 'User deleted successfully' })
  @Delete()
  async remove(@Request() req : IAuthRequest): Promise<object> {
    await this.userService.remove(req.user.sub);
    return {
      message: 'User deleted successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('profile')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, description: 'Get profile', type: User })
  async getProfile(@Request() req : IAuthRequest): Promise<User> {
    return await this.userService.getProfile(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Follow user by username' })
  @ApiResponse({ status: 201, description: 'User has been successfully followed' })
  @Post('follow/:username')
  async followUser(@Request() req: IAuthRequest, @Param('username') username: string): Promise<object> {
    const currentUsername = req.user.username; 
    
    // Check if user to follow is not the same as the current user
    if (currentUsername === username) {
        throw new BadRequestException('You can not follow yourself');
    }

    // Check if user to follow exists
    const userToFollow = await this.userService.getProfile(username);

    // Follow user
    await this.userService.followUser(req.user.sub, userToFollow.id);
    return {
      message: 'User has been successfully followed',
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('unfollow/:username')
  @ApiOperation({ summary: 'Unfollow user by username' })
  @ApiResponse({ status: 201, description: 'User has been successfully unfollowed' })
  async unfollowUser(@Request() req: IAuthRequest, @Param('username') username: string): Promise<object> {
    
    // Getting userID of user to unfollow
    const userToUnFollow = await this.userService.getProfile(username);

    // Follow user
    await this.userService.unfollowUser(req.user.sub, userToUnFollow.id);
    return {
      message: 'User has been successfully unfollowed',
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('recommendation')
  @ApiOperation({ summary: 'Get recommendations for users to follow' })
  @ApiResponse({ status: 200, description: 'User follow recommendations' })
  async getFollowRecommendations(@Request() req: IAuthRequest): Promise<object> {
    return await this.userService.getFollowRecommendations(req.user.sub);
  }
}