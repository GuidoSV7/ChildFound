import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubro } from './entities/rubro.entity';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { UpdateRubroDto } from './dto/update-rubro.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class RubrosService {
  constructor(
    @InjectRepository(Rubro)
    private readonly rubroRepository: Repository<Rubro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateRubroDto) {
    const rubro = this.rubroRepository.create(createDto);
    try {
      return await this.rubroRepository.save(rubro);
    } catch {
      throw new BadRequestException('Error creating rubro');
    }
  }

  findAll() {
    return this.rubroRepository.find({ relations: ['users'] });
  }

  async findOne(id: string) {
    const rubro = await this.rubroRepository.findOne({ where: { id }, relations: ['users'] });
    if (!rubro) throw new NotFoundException(`Rubro with id ${id} not found`);
    return rubro;
    }

  async update(id: string, updateDto: UpdateRubroDto) {
    const rubro = await this.findOne(id);
    Object.assign(rubro, updateDto);
    return this.rubroRepository.save(rubro);
  }

  async remove(id: string) {
    const rubro = await this.findOne(id);
    await this.rubroRepository.remove(rubro);
    return { message: `Rubro with id ${id} deleted successfully` };
  }

  getUsersByRubro(id: string) {
    return this.userRepository.find({ where: { rubroId: id } });
  }
}


