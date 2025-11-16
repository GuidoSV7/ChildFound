import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './../auth/auth.module';
import { User } from '../auth/entities/user.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { Topic } from '../topics/entities/topic.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { ModuleTopic } from '../module-topics/entities/module-topic.entity';
import { Business } from '../businesses/entities/business.entity';
import { Fase } from '../fases/entities/fase.entity';
import { Certification } from '../certifications/entities/certification.entity';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([User, Rubro, Topic, ModuleEntity, ModuleTopic, Business, Fase, Certification]),
    AuthModule
  ]
})
export class SeedModule {}
