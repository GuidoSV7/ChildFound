import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTopicsService } from './user-topics.service';
import { UserTopicsController } from './user-topics.controller';
import { UserTopic } from './entities/user-topic.entity';
import { User } from 'src/auth/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  controllers: [UserTopicsController],
  providers: [UserTopicsService],
  imports: [
    TypeOrmModule.forFeature([UserTopic, User, Topic])
  ],
  exports: [UserTopicsService, TypeOrmModule]
})
export class UserTopicsModule {}

