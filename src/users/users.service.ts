import { Injectable, InternalServerErrorException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository, DataSource } from 'typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('usersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const {password, roles = Role.USER, ...UserDetails} = createUserDto;
      
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      const user = this.userRepository.create({
        ...UserDetails,
        password: hashedPassword,
        roles
      });
      
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message || 'Error creating user');
    }
  }

  findAll(paginationDto:PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;

    return this.userRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findAllAdmins(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;

    return this.userRepository.find({
      where: { roles: Role.ADMIN },
      take: limit,
      skip: offset,
    });
  }

  async findAllMembers(paginationDto: PaginationDto) {
    try {
      const {limit = 100, offset = 0} = paginationDto;

      const users = await this.userRepository.find({
        where: { roles: Role.USER },
        take: limit,
        skip: offset,
      });

      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de usuarios');
    }
  }

  async findAllResellers(paginationDto: PaginationDto) {
    try {
      const {limit = 100, offset = 0} = paginationDto;

      // Como solo hay 2 roles, retornamos usuarios con rol USER
      const users = await this.userRepository.find({
        where: { roles: Role.USER },
        take: limit,
        skip: offset,
      });

      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de usuarios');
    }
  }

  async findOne(id : string) {
    let user: User;

    const queryBuilder = this.userRepository.createQueryBuilder();
    user= await queryBuilder
      .where('id =:id ',{
        id:id,
      })
      .getOne();

    if(!user){
      throw new NotFoundException( `User con id ${id} no encontrada`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const {...toUpdate} = updateUserDto;

    const user= await this.userRepository.preload({ id,...toUpdate});

    if(!user){
      throw new NotFoundException(`User con id ${id} no encontrada`);
    }

    //Create Query Runner
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try{
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);

    } catch{
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new InternalServerErrorException('Error al actualizar los datos de la User');
    }
  }

  async remove(id: string) {
    const user= await this.findOne(id);

    await this.userRepository.remove(user);

    return { mensaje: `La user con id ${id} se eliminó exitosamente.` };
  }

  async deleteAllUsers(){
    const query = this.userRepository.createQueryBuilder('user');

    try{
      return await query
       .delete()
       .where({})
       .execute(); 
    } catch(error){
      return error.message;
    }
  }

  async updateUserRole(userId: string, newRole: Role) {
    try {
      // Buscar el usuario actual
      const user = await this.userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      const currentRole = user.roles;

      // Si el rol es el mismo, no hacer nada
      if (currentRole === newRole) {
        return {
          success: true,
          message: 'El usuario ya tiene este rol',
          data: user
        };
      }

      // Validar que el nuevo rol sea válido
      if (newRole !== Role.ADMIN && newRole !== Role.USER) {
        throw new BadRequestException('Rol no válido. Solo se permiten roles: admin o user');
      }

      // Actualizar el rol
      await this.userRepository.update(userId, { roles: newRole });

      // Obtener el usuario actualizado
      const updatedUser = await this.userRepository.findOne({ where: { id: userId } });

      return {
        success: true,
        message: `Rol actualizado de ${currentRole} a ${newRole} exitosamente`,
        data: updatedUser
      };

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error interno al actualizar el rol del usuario');
    }
  }
}
