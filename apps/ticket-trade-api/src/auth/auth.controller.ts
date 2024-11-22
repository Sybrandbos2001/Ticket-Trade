import { Body, Controller, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<object> {
    const jwtToken = await this.authService.signIn(loginDto);
    return {
      message: 'User successfully logged in',
      jwt_token: jwtToken,
    };
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: User })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<object> {
    const newUser = await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
      user: newUser,
    };
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 201, description: 'Password changed successfully' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto): Promise<object> {
    await this.authService.changePassword(id, changePasswordDto);
    return {
      message: 'Password changed successfully',
    };
  }
}
