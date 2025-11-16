import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Business } from './entities/business.entity';

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business created', type: Business })
  create(@Body() createDto: CreateBusinessDto) {
    return this.businessesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all businesses' })
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by id' })
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'List businesses by user id' })
  findByUser(@Param('userId') userId: string) {
    return this.businessesService.findByUser(userId);
  }

  @Get('by-rubro/:rubroId')
  @ApiOperation({ summary: 'List businesses by rubro id' })
  findByRubro(@Param('rubroId') rubroId: string) {
    return this.businessesService.findByRubro(rubroId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a business' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBusinessDto) {
    return this.businessesService.update(id, updateDto);
  }

  @Patch(':id/finish')
  @ApiOperation({ summary: 'Finalize a business (set status and finalized date)' })
  finish(@Param('id') id: string, @Body('isSuccessful') isSuccessful: boolean) {
    return this.businessesService.finish(id, isSuccessful);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business' })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }
}


