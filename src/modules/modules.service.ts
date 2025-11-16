import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    try {
      const module = this.moduleRepository.create(createModuleDto);
      return await this.moduleRepository.save(module);
    } catch (error) {
      throw new BadRequestException('Error creating module');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    return this.moduleRepository.find({
      take: limit,
      skip: offset,
      relations: ['users', 'moduleTopics', 'moduleTopics.topic', 'fase']
    });
  }

  async findOne(id: string) {
    const module = await this.moduleRepository.findOne({
      where: { id },
      relations: ['users', 'moduleTopics', 'moduleTopics.topic', 'fase']
    });

    if (!module) {
      throw new NotFoundException(`Module with id ${id} not found`);
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    const module = await this.findOne(id);
    
    Object.assign(module, updateModuleDto);
    
    try {
      return await this.moduleRepository.save(module);
    } catch (error) {
      throw new InternalServerErrorException('Error updating module');
    }
  }

  async remove(id: string) {
    const module = await this.findOne(id);
    await this.moduleRepository.remove(module);
    return { message: `Module with id ${id} deleted successfully` };
  }
}

