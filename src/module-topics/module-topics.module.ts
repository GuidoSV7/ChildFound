import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleTopicsService } from './module-topics.service';
import { ModuleTopicsController } from './module-topics.controller';
import { ModuleTopic } from './entities/module-topic.entity';
import { Module as ModuleEntity } from 'src/modules/entities/module.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  controllers: [ModuleTopicsController],
  providers: [ModuleTopicsService],
  imports: [
    TypeOrmModule.forFeature([ModuleTopic, ModuleEntity, Topic])
  ],
  exports: [ModuleTopicsService, TypeOrmModule]
})
export class ModuleTopicsModule {}

