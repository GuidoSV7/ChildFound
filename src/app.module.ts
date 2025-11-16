import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';


import { GoogleAuthModule } from './google-auth/google-auth.module';

import { UsersModule } from './users/users.module';
import { ModulesModule } from './modules/modules.module';
import { TopicsModule } from './topics/topics.module';
import { UserTopicsModule } from './user-topics/user-topics.module';
import { ModuleTopicsModule } from './module-topics/module-topics.module';
import { ContentsModule } from './contents/contents.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),  

    
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
              ? { rejectUnauthorized: false }
              : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      autoLoadEntities: true,
      synchronize: true,
    }),


  //p

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,

    GoogleAuthModule,

    UsersModule,

    ModulesModule,

    TopicsModule,

    UserTopicsModule,

    ModuleTopicsModule,

    ContentsModule

  ],
})
export class AppModule {
  constructor() {
    
    
  }
}
