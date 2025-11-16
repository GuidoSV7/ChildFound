import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RubrosService } from './rubros.service';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { UpdateRubroDto } from './dto/update-rubro.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Rubro } from './entities/rubro.entity';

@ApiTags('Rubros')
@Controller('rubros')
export class RubrosController {
  constructor(private readonly rubrosService: RubrosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rubro' })
  @ApiResponse({ status: 201, description: 'Rubro created', type: Rubro })
  create(@Body() createDto: CreateRubroDto) {
    return this.rubrosService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all rubros' })
  findAll() {
    return this.rubrosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rubro by id' })
  findOne(@Param('id') id: string) {
    return this.rubrosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rubro' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRubroDto) {
    return this.rubrosService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rubro' })
  remove(@Param('id') id: string) {
    return this.rubrosService.remove(id);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'List users by rubro id' })
  getUsersByRubro(@Param('id') id: string) {
    return this.rubrosService.getUsersByRubro(id);
  }
}


