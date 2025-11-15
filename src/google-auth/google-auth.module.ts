import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { User } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import googleOauthConfig from './google-oauth.config';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy],
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    AuthModule,
    
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'google' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [TypeOrmModule, PassportModule, JwtModule, GoogleAuthService]
})
export class GoogleAuthModule {}
