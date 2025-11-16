import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { Content } from './entities/content.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService],
  imports: [TypeOrmModule.forFeature([Content, Topic])],
  exports: [ContentsService, TypeOrmModule]
})
export class ContentsModule {}


