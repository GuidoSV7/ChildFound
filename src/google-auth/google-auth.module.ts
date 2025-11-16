import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { User } from '../auth/entities/user.entity';
import googleOauthConfig from './google-oauth.config';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy],
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'google' })
  ],
  exports: [TypeOrmModule, PassportModule, GoogleAuthService]
})
export class GoogleAuthModule {}
