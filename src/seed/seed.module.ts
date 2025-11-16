import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './../auth/auth.module';
import { User } from '../auth/entities/user.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { Topic } from '../topics/entities/topic.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { ModuleTopic } from '../module-topics/entities/module-topic.entity';
import { UserTopic } from '../user-topics/entities/user-topic.entity';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([User, Rubro, Topic, ModuleEntity, ModuleTopic, UserTopic]),
    AuthModule
  ]
})
export class SeedModule {}
