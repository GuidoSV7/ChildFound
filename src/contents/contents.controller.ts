import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Content } from './entities/content.entity';

@ApiTags('Contents')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create content for a topic' })
  @ApiResponse({ status: 201, description: 'Content created', type: Content })
  create(@Body() createDto: CreateContentDto) {
    return this.contentsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all contents' })
  findAll() {
    return this.contentsService.findAll();
  }

  @Get('by-topic/:topicId')
  @ApiOperation({ summary: 'List contents by topic id' })
  findByTopic(@Param('topicId') topicId: string) {
    return this.contentsService.findByTopic(topicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by id' })
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content' })
  update(@Param('id') id: string, @Body() updateDto: UpdateContentDto) {
    return this.contentsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content' })
  remove(@Param('id') id: string) {
    return this.contentsService.remove(id);
  }
}


