import { Controller, Get, Request, Post, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { IAuthRequest, Role } from '@ticket-trade/domain';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Retrieve all friends' })
  @ApiResponse({ status: 200, description: 'List of all friends', type: [User] })
  async findAllFriends(@Request() req: IAuthRequest) {
    const currentUserId = req.user.sub;
    return await this.friendsService.findAll(currentUserId);
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
    const userToFollow = await this.userService.findUserByField('username', username);

    // Follow user
    await this.friendsService.followUser(req.user.sub, userToFollow.id);
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
    const userToUnFollow = await this.userService.findUserByField('username', username);

    // Follow user
    await this.friendsService.unfollowUser(req.user.sub, userToUnFollow.id);
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
    return await this.friendsService.getFollowRecommendations(req.user.sub);
  }
}
