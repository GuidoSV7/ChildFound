import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ModuleTopicsService } from './module-topics.service';
import { CreateModuleTopicDto } from './dto/create-module-topic.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Module Topics')
@Controller('module-topics')
export class ModuleTopicsController {
  constructor(private readonly moduleTopicsService: ModuleTopicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a module-topic relationship' })
  @ApiResponse({ status: 201, description: 'Module-Topic relationship created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Module or Topic not found' })
  @ApiResponse({ status: 409, description: 'Relationship already exists' })
  create(@Body() createModuleTopicDto: CreateModuleTopicDto) {
    return this.moduleTopicsService.create(createModuleTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all module-topic relationships' })
  findAll() {
    return this.moduleTopicsService.findAll();
  }

  @Get('by-module/:moduleId')
  @ApiOperation({ summary: 'Get all topics for a module' })
  findByModule(@Param('moduleId') moduleId: string) {
    return this.moduleTopicsService.findByModule(moduleId);
  }

  @Get('by-topic/:topicId')
  @ApiOperation({ summary: 'Get all modules for a topic' })
  findByTopic(@Param('topicId') topicId: string) {
    return this.moduleTopicsService.findByTopic(topicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module-topic relationship by id' })
  @ApiResponse({ status: 200, description: 'ModuleTopic found' })
  @ApiResponse({ status: 404, description: 'ModuleTopic not found' })
  findOne(@Param('id') id: string) {
    return this.moduleTopicsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module-topic relationship' })
  @ApiResponse({ status: 200, description: 'ModuleTopic deleted successfully' })
  @ApiResponse({ status: 404, description: 'ModuleTopic not found' })
  remove(@Param('id') id: string) {
    return this.moduleTopicsService.remove(id);
  }

  @Delete('module/:moduleId/topic/:topicId')
  @ApiOperation({ summary: 'Delete a module-topic relationship by module and topic ids' })
  removeByModuleAndTopic(
    @Param('moduleId') moduleId: string,
    @Param('topicId') topicId: string
  ) {
    return this.moduleTopicsService.removeByModuleAndTopic(moduleId, topicId);
  }
}

