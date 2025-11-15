import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async create(createTopicDto: CreateTopicDto) {
    try {
      const topic = this.topicRepository.create(createTopicDto);
      return await this.topicRepository.save(topic);
    } catch (error) {
      throw new BadRequestException('Error creating topic');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    return this.topicRepository.find({
      take: limit,
      skip: offset,
      relations: ['userTopics', 'userTopics.user', 'moduleTopics', 'moduleTopics.module']
    });
  }

  async findOne(id: string) {
    const topic = await this.topicRepository.findOne({
      where: { id },
      relations: ['userTopics', 'userTopics.user', 'moduleTopics', 'moduleTopics.module']
    });

    if (!topic) {
      throw new NotFoundException(`Topic with id ${id} not found`);
    }

    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    const topic = await this.findOne(id);
    
    Object.assign(topic, updateTopicDto);
    
    try {
      return await this.topicRepository.save(topic);
    } catch (error) {
      throw new InternalServerErrorException('Error updating topic');
    }
  }

  async remove(id: string) {
    const topic = await this.findOne(id);
    await this.topicRepository.remove(topic);
    return { message: `Topic with id ${id} deleted successfully` };
  }
}

