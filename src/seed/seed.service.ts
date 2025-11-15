import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/role.enum';

import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    
    await this.deleteTables();

    const adminUser = await this.insertUsers();
    return 'SEED EXECUTED';
  }

  async runSeedIfEmpty() {
    
    const results = [];


    // Verificar y seedear Users
    const existingUsers = await this.userRepository.count();
    if (existingUsers === 0) {
      await this.insertUsers();
      results.push('Users seeded');
    } else {
      results.push('Users already exist');
    }
    return { message: 'SEED CHECK COMPLETED', details: results };
  }

  async forceSeed() {
    
    await this.deleteTables();


    const adminUser = await this.insertUsers();
    return 'FORCE SEED EXECUTED';
  }

  async deleteTables() {
    
  
    
    // Con @ChildEntity, todas las entidades se guardan en la misma tabla 'users'
    // Solo necesitamos limpiar la tabla principal
    await this.userRepository.delete({});
  }


  private async insertUsers() {
    const createdUsers = [];

    for (const userData of initialData.users) {
      // Mapear roles a enum Role
      let role: Role = Role.USER;
      if (userData.roles === 'admin') {
        role = Role.ADMIN;
      }

      // Hashear la contraseña (si no está hasheada ya)
      const hashedPassword = userData.password.startsWith('$2') 
        ? userData.password 
        : bcrypt.hashSync(userData.password, 10);

      const user = this.userRepository.create({
        name: userData.userName,
        email: userData.email,
        password: hashedPassword,
        roles: role
      });

      const savedUser = await this.userRepository.save(user);
      createdUsers.push(savedUser);
    }
    return createdUsers[0];
  }


}
