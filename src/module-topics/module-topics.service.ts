import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleTopic } from './entities/module-topic.entity';
import { CreateModuleTopicDto } from './dto/create-module-topic.dto';
import { Module } from 'src/modules/entities/module.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Injectable()
export class ModuleTopicsService {
  constructor(
    @InjectRepository(ModuleTopic)
    private readonly moduleTopicRepository: Repository<ModuleTopic>,
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async create(createModuleTopicDto: CreateModuleTopicDto) {
    const { moduleId, topicId } = createModuleTopicDto;

    // Verificar que el módulo existe
    const module = await this.moduleRepository.findOne({ where: { id: moduleId } });
    if (!module) {
      throw new NotFoundException(`Module with id ${moduleId} not found`);
    }

    // Verificar que el tema existe
    const topic = await this.topicRepository.findOne({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException(`Topic with id ${topicId} not found`);
    }

    // Verificar si ya existe la relación
    const existing = await this.moduleTopicRepository.findOne({
      where: { moduleId, topicId }
    });

    if (existing) {
      throw new ConflictException('Module-Topic relationship already exists');
    }

    const moduleTopic = this.moduleTopicRepository.create({ moduleId, topicId });
    return await this.moduleTopicRepository.save(moduleTopic);
  }

  async findAll() {
    return this.moduleTopicRepository.find({
      relations: ['module', 'topic']
    });
  }

  async findByModule(moduleId: string) {
    return this.moduleTopicRepository.find({
      where: { moduleId },
      relations: ['topic']
    });
  }

  async findByTopic(topicId: string) {
    return this.moduleTopicRepository.find({
      where: { topicId },
      relations: ['module']
    });
  }

  async findOne(id: string) {
    const moduleTopic = await this.moduleTopicRepository.findOne({
      where: { id },
      relations: ['module', 'topic']
    });

    if (!moduleTopic) {
      throw new NotFoundException(`ModuleTopic with id ${id} not found`);
    }

    return moduleTopic;
  }

  async remove(id: string) {
    const moduleTopic = await this.findOne(id);
    await this.moduleTopicRepository.remove(moduleTopic);
    return { message: `ModuleTopic with id ${id} deleted successfully` };
  }

  async removeByModuleAndTopic(moduleId: string, topicId: string) {
    const moduleTopic = await this.moduleTopicRepository.findOne({
      where: { moduleId, topicId }
    });

    if (!moduleTopic) {
      throw new NotFoundException('ModuleTopic relationship not found');
    }

    await this.moduleTopicRepository.remove(moduleTopic);
    return { message: 'ModuleTopic relationship deleted successfully' };
  }
}

