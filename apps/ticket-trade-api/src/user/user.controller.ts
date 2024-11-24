import { Controller, Request, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { IAuthRequest, Role } from '@ticket-trade/domain';

@ApiTags('User')
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
  @Roles(Role.USER, Role.ADMIN)
  @Get('profile')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, description: 'Get profile', type: User })
  async getProfile(@Request() req : IAuthRequest): Promise<User> {
    return await this.userService.findByEmailOrUsername(req.user.email);
  } 

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':username')
  @ApiOperation({ summary: 'Retrieve single user by username' })
  @ApiResponse({ status: 200, description: 'Single user by username', type: User })
  async findOne(@Param('username') username: string): Promise<User> {
    return await this.userService.findOne(username);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 201, description: 'User updated successfully', type: User })
  @ApiBody({ type: UpdateUserDto })
  async update(@Request() req : IAuthRequest, @Body() updateUserDto: UpdateUserDto): Promise<object> {
    const updatedUser = await this.userService.update(req.user.sub, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Delete()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 201, description: 'User deleted successfully' })
  async remove(@Request() req : IAuthRequest): Promise<object> {
    await this.userService.remove(req.user.sub);
    return {
      message: 'User deleted successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('follow/:username')
  @ApiOperation({ summary: 'Follow user by username' })
  @ApiResponse({ status: 201, description: 'User has been successfully followed' })
  async followUser(@Request() req: IAuthRequest, @Param('username') username: string): Promise<object> {
    const currentUsername = req.user.username; 
    
    // Check if user to follow is not the same as the current user
    if (currentUsername === username) {
        throw new BadRequestException('You can not follow yourself');
    }

    // Check if user to follow exists
    const userToFollow = await this.userService.findByEmailOrUsername(username);

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
    const userToUnFollow = await this.userService.findByEmailOrUsername(username);

    // Follow user
    await this.userService.unfollowUser(req.user.sub, userToUnFollow.id);
    return {
      message: 'User has been successfully unfollowed',
    };
  }
}