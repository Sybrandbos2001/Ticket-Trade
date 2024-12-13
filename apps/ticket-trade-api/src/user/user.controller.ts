import { Controller, Request, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
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
  @Roles(Role.USER, Role.ADMIN)
  @Get('account')
  @ApiOperation({ summary: 'Get account' })
  @ApiResponse({ status: 200, description: 'Get account', type: User })
  async getUser(@Request() req : IAuthRequest): Promise<User> {
    const userId = req.user.sub; 
    return await this.userService.getAccount(userId);
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

  @Get('profile/:username')
  @ApiOperation({ summary: 'Retrieve profile by username' })
  @ApiResponse({ status: 200, description: 'Profile by username', type: User })
  async findOne(@Param('username') username: string): Promise<User> {
    return await this.userService.getProfile('username', username);
  }

  @Get('profile/search/:query')
  @ApiOperation({ summary: 'Retrieve profiles by query' })
  @ApiResponse({ status: 200, description: 'Profiles by query', type: [User] })
  async findBySearch(@Param('query') query: string): Promise<User[]> {
    return await this.userService.getProfileBySearch(query);
  }
}