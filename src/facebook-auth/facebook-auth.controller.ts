import { Controller, Get, Post, Req, Res, UseGuards, Body, ValidationPipe, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookAuthDto, MobileFacebookAuthDto } from './dto/facebook-auth.dto';

@Controller('auth/facebook')
export class FacebookAuthController {
  constructor(
    private readonly facebookAuthService: FacebookAuthService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  async facebookAuth(@Body(ValidationPipe) dto: FacebookAuthDto) {
    try {
      const result = await this.facebookAuthService.authenticateWithFacebook(dto);
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
      console.error('Facebook auth error:', error);
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('mobile')
  async facebookAuthMobile(@Body(ValidationPipe) body: MobileFacebookAuthDto) {
    try {
      const result = await this.facebookAuthService.authenticateWithFacebookAccessToken(body.accessToken);
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
      console.error('Facebook mobile auth error:', error);
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthInit(@Req() req: Request) {}

  @Get('callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const fbUser = req.user;
      const result = await this.facebookAuthService.findOrCreateUserFromStrategy(fbUser);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      res.redirect(`${frontendUrl}/auth/facebook/callback?userId=${(result as { id: string }).id}`);
    } catch (error) {
      console.error('Facebook auth callback error:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      res.redirect(`${frontendUrl}/auth/facebook/callback?error=authentication_failed`);
    }
  }
}


