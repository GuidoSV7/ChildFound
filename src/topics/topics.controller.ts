import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Topic } from './entities/topic.entity';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Topic created successfully', type: Topic })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'List of topics', type: [Topic] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.topicsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a topic by id' })
  @ApiResponse({ status: 200, description: 'Topic found', type: Topic })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a topic' })
  @ApiResponse({ status: 200, description: 'Topic updated successfully', type: Topic })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a topic' })
  @ApiResponse({ status: 200, description: 'Topic deleted successfully' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}

