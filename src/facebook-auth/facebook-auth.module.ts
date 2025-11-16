import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { FacebookAuthService } from './facebook-auth.service';
import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { User } from '../auth/entities/user.entity';
import facebookOauthConfig from './facebook-oauth.config';

@Module({
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService, FacebookStrategy],
  imports: [
    ConfigModule.forFeature(facebookOauthConfig),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'facebook' })
  ],
  exports: [TypeOrmModule, PassportModule, FacebookAuthService]
})
export class FacebookAuthModule {}


