import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { Topic } from './entities/topic.entity';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService],
  imports: [TypeOrmModule.forFeature([Topic])],
  exports: [TopicsService, TypeOrmModule]
})
export class TopicsModule {}

