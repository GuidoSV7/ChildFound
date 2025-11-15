import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateUserDto } from 'src/auth/dto';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({status:201, description:'user Creado exitosamente', type: User})
  @ApiResponse({status:400, description:'Bad Request'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto)  {
    return this.usersService.findAll(paginationDto);
  }

 

  @Get('members/all')
  findAllMembers( @Query() paginationDto:PaginationDto)  {
    console.log('Controlador: Recibida petición GET /users/members/all con parámetros:', paginationDto);
    return this.usersService.findAllMembers(paginationDto);
  }

  @Get('resellers/all')
  findAllResellers( @Query() paginationDto:PaginationDto)  {
    console.log('Controlador: Recibida petición GET /users/resellers/all con parámetros:', paginationDto);
    return this.usersService.findAllResellers(paginationDto);
  }

  @Get('by-role/:role')
  async getUsersByRole(@Param('role') role: string, @Query() paginationDto: PaginationDto) {
    console.log(`Controlador: Recibida petición GET /users/by-role/${role} con parámetros:`, paginationDto);
    
    if (role === 'user') {
      return this.usersService.findAllMembers(paginationDto);
    } else if (role === 'admin') {
      return this.usersService.findAllAdmins(paginationDto);
    }
    
    throw new BadRequestException(`Rol '${role}' no válido. Usa 'user' o 'admin'`);
  }

  @Patch(':id/role')
  @ApiResponse({
    status: 200,
    description: 'Rol del usuario actualizado exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado'
  })
  @ApiResponse({
    status: 400,
    description: 'Rol no válido'
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return await this.usersService.updateUserRole(id, updateRoleDto.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string ,
        @Body() updateUserDto: UpdateUserDto) 
        {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
