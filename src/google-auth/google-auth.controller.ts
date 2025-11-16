import { Controller, Get, Post, Req, Res, UseGuards, Body, ValidationPipe, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthDto, MobileGoogleAuthDto } from './dto/google-auth.dto';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  async googleAuth(@Body(ValidationPipe) googleAuthDto: GoogleAuthDto) {
    try {
      const result = await this.googleAuthService.authenticateWithGoogle(googleAuthDto);
      
      return {
        success: true,
        data: result,
        message: result.isNewUser 
          ? 'Usuario creado exitosamente' 
          : 'Usuario encontrado exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('Google auth error:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('mobile')
  async googleAuthMobile(@Body(ValidationPipe) body: MobileGoogleAuthDto) {
    try {
      const result = await this.googleAuthService.authenticateWithGoogleIdToken(body.idToken);

      return {
        success: true,
        data: result,
        message: result.isNewUser
          ? 'Usuario creado exitosamente'
          : 'Usuario encontrado exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Google mobile auth error:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuthInit(@Req() req) {
    // This endpoint initiates the Google OAuth flow
    // The user will be redirected to Google for authentication
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    try {
      // The user data is available in req.user after Google authentication
      const googleUser = req.user;
      
      // Validate and create/find user
      const result = await this.googleAuthService.findOrCreateUser(googleUser);
      
      // Get frontend URL from environment variables
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      
      // Redirect to frontend with user id
      res.redirect(`${frontendUrl}/auth/google/callback?userId=${result.id}`);
    } catch (error) {
      console.error('Google auth callback error:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      res.redirect(`${frontendUrl}/auth/google/callback?error=authentication_failed`);
    }
  }

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    // This endpoint can be used to get user profile after Google auth
    return this.googleAuthService.getUserProfile(userId);
  }
}
