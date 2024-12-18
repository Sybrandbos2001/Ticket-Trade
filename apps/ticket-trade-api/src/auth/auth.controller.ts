import { Body, Controller, Request, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from './roles.decorator';
import { IAuthRequest, Role } from '@ticket-trade/domain';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
  @Roles(Role.USER, Role.ADMIN)
  @Patch('password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword( @Request() req: IAuthRequest, @Body() changePasswordDto: ChangePasswordDto): Promise<object> {
    const email = req.user.email; 
    await this.authService.changePassword(email, changePasswordDto);
    return {
      message: 'Password changed successfully',
    };
  }
}
