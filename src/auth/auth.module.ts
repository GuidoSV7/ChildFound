import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

import googleOauthConfig from 'src/google-auth/google-oauth.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    ConfigModule.forFeature(googleOauthConfig),
    
    TypeOrmModule.forFeature([ User ])
  ],
  exports: [ TypeOrmModule, AuthService ]
})
export class AuthModule {}
