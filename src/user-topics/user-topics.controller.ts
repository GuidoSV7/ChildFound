import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { UserTopicsService } from './user-topics.service';
import { CreateUserTopicDto } from './dto/create-user-topic.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('User Topics')
@Controller('user-topics')
export class UserTopicsController {
  constructor(private readonly userTopicsService: UserTopicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user-topic relationship' })
  @ApiResponse({ status: 201, description: 'User-Topic relationship created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User or Topic not found' })
  @ApiResponse({ status: 409, description: 'Relationship already exists' })
  create(@Body() createUserTopicDto: CreateUserTopicDto) {
    return this.userTopicsService.create(createUserTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user-topic relationships' })
  findAll() {
    return this.userTopicsService.findAll();
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get all topics for a user' })
  findByUser(@Param('userId') userId: string) {
    return this.userTopicsService.findByUser(userId);
  }

  @Get('by-topic/:topicId')
  @ApiOperation({ summary: 'Get all users for a topic' })
  findByTopic(@Param('topicId') topicId: string) {
    return this.userTopicsService.findByTopic(topicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user-topic relationship by id' })
  @ApiResponse({ status: 200, description: 'UserTopic found' })
  @ApiResponse({ status: 404, description: 'UserTopic not found' })
  findOne(@Param('id') id: string) {
    return this.userTopicsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user-topic relationship' })
  @ApiResponse({ status: 200, description: 'UserTopic deleted successfully' })
  @ApiResponse({ status: 404, description: 'UserTopic not found' })
  remove(@Param('id') id: string) {
    return this.userTopicsService.remove(id);
  }

  @Delete('user/:userId/topic/:topicId')
  @ApiOperation({ summary: 'Delete a user-topic relationship by user and topic ids' })
  removeByUserAndTopic(
    @Param('userId') userId: string,
    @Param('topicId') topicId: string
  ) {
    return this.userTopicsService.removeByUserAndTopic(userId, topicId);
  }
}

