import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { SetPasswordDto } from './dto/set-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createUser(@Body() createUserDto: CreateUserDto ) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }

  @Post('verify-password/:userId')
  async verifyPassword(
    @Param('userId') userId: string,
    @Body('password') password: string    
  ) {
    const isValid = await this.authService.verifyPassword(userId, password);
    return { success: isValid };
  }

  @Post('set-password/:userId')
  async setPassword(
    @Param('userId') userId: string,
    @Body() setPasswordDto: SetPasswordDto
  ) {
    return this.authService.setPassword(userId, setPasswordDto);
  }

  @Get('check-password/:userId')
  async checkHasPassword(@Param('userId') userId: string) {
    return this.authService.checkHasPassword(userId);
  }
}
