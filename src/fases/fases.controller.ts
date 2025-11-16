import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FasesService } from './fases.service';
import { CreateFaseDto } from './dto/create-fase.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Fase } from './entities/fase.entity';

@ApiTags('Fases')
@Controller('fases')
export class FasesController {
  constructor(private readonly fasesService: FasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fase' })
  @ApiResponse({ status: 201, description: 'Fase created', type: Fase })
  create(@Body() createDto: CreateFaseDto) {
    return this.fasesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all fases' })
  findAll() {
    return this.fasesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fase by id' })
  findOne(@Param('id') id: string) {
    return this.fasesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fase' })
  update(@Param('id') id: string, @Body() updateDto: UpdateFaseDto) {
    return this.fasesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fase' })
  remove(@Param('id') id: string) {
    return this.fasesService.remove(id);
  }
}


