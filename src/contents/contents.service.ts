import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Topic } from 'src/topics/entities/topic.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async create(createDto: CreateContentDto) {
    const topic = await this.topicRepository.findOne({ where: { id: createDto.topicId } });
    if (!topic) {
      throw new NotFoundException(`Topic with id ${createDto.topicId} not found`);
    }
    const content = this.contentRepository.create(createDto);
    try {
      return await this.contentRepository.save(content);
    } catch {
      throw new BadRequestException('Error creating content');
    }
  }

  findAll() {
    return this.contentRepository.find({ relations: ['topic'] });
  }

  findByTopic(topicId: string) {
    return this.contentRepository.find({
      where: { topicId },
      relations: ['topic'],
    });
  }

  async findOne(id: string) {
    const content = await this.contentRepository.findOne({ where: { id }, relations: ['topic'] });
    if (!content) throw new NotFoundException(`Content with id ${id} not found`);
    return content;
  }

  async update(id: string, updateDto: UpdateContentDto) {
    const content = await this.findOne(id);
    Object.assign(content, updateDto);
    return this.contentRepository.save(content);
  }

  async remove(id: string) {
    const content = await this.findOne(id);
    await this.contentRepository.remove(content);
    return { message: `Content with id ${id} deleted successfully` };
  }
}


