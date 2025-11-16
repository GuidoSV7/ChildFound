import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTopic, UserTopicStatus } from './entities/user-topic.entity';
import { CreateUserTopicDto } from './dto/create-user-topic.dto';
import { User } from 'src/auth/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Injectable()
export class UserTopicsService {
  constructor(
    @InjectRepository(UserTopic)
    private readonly userTopicRepository: Repository<UserTopic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async create(createUserTopicDto: CreateUserTopicDto) {
    const { userId, topicId, progressPercentage = 0, status = UserTopicStatus.PENDING } = createUserTopicDto;

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Verificar que el tema existe
    const topic = await this.topicRepository.findOne({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException(`Topic with id ${topicId} not found`);
    }

    // Verificar si ya existe la relación
    const existing = await this.userTopicRepository.findOne({
      where: { userId, topicId }
    });

    if (existing) {
      throw new ConflictException('User-Topic relationship already exists');
    }

    const userTopic = this.userTopicRepository.create({ userId, topicId, progressPercentage, status });
    return await this.userTopicRepository.save(userTopic);
  }

  async updateProgress(id: string, progressPercentage: number, status?: UserTopicStatus) {
    if (progressPercentage < 0 || progressPercentage > 100) {
      throw new BadRequestException('progressPercentage debe estar entre 0 y 100');
    }

    const userTopic = await this.userTopicRepository.findOne({ where: { id } });
    if (!userTopic) {
      throw new NotFoundException(`UserTopic with id ${id} not found`);
    }

    userTopic.progressPercentage = progressPercentage;

    if (typeof status !== 'undefined') {
      userTopic.status = status;
    } else {
      // Inferir estado por progreso si no se envía
      if (progressPercentage <= 0) userTopic.status = UserTopicStatus.PENDING;
      else if (progressPercentage >= 100) userTopic.status = UserTopicStatus.COMPLETED;
      else userTopic.status = UserTopicStatus.IN_PROGRESS;
    }

    return await this.userTopicRepository.save(userTopic);
  }

  async findAll() {
    return this.userTopicRepository.find({
      relations: ['user', 'topic']
    });
  }

  async findByUser(userId: string) {
    return this.userTopicRepository.find({
      where: { userId },
      relations: ['topic']
    });
  }

  async findByTopic(topicId: string) {
    return this.userTopicRepository.find({
      where: { topicId },
      relations: ['user']
    });
  }

  async findOne(id: string) {
    const userTopic = await this.userTopicRepository.findOne({
      where: { id },
      relations: ['user', 'topic']
    });

    if (!userTopic) {
      throw new NotFoundException(`UserTopic with id ${id} not found`);
    }

    return userTopic;
  }

  async remove(id: string) {
    const userTopic = await this.findOne(id);
    await this.userTopicRepository.remove(userTopic);
    return { message: `UserTopic with id ${id} deleted successfully` };
  }

  async removeByUserAndTopic(userId: string, topicId: string) {
    const userTopic = await this.userTopicRepository.findOne({
      where: { userId, topicId }
    });

    if (!userTopic) {
      throw new NotFoundException('UserTopic relationship not found');
    }

    await this.userTopicRepository.remove(userTopic);
    return { message: 'UserTopic relationship deleted successfully' };
  }
}

