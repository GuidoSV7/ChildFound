import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fase } from './entities/fase.entity';
import { CreateFaseDto } from './dto/create-fase.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';

@Injectable()
export class FasesService {
  constructor(
    @InjectRepository(Fase)
    private readonly faseRepository: Repository<Fase>,
  ) {}

  async create(createDto: CreateFaseDto) {
    const fase = this.faseRepository.create(createDto);
    try {
      return await this.faseRepository.save(fase);
    } catch {
      throw new BadRequestException('Error creating fase');
    }
  }

  findAll() {
    return this.faseRepository.find();
  }

  async findOne(id: string) {
    const fase = await this.faseRepository.findOne({ where: { id }, relations: ['modules'] });
    if (!fase) throw new NotFoundException('Fase not found');
    return fase;
  }

  async update(id: string, updateDto: UpdateFaseDto) {
    const fase = await this.findOne(id);
    Object.assign(fase, updateDto);
    return this.faseRepository.save(fase);
  }

  async remove(id: string) {
    const fase = await this.findOne(id);
    await this.faseRepository.remove(fase);
    return { message: `Fase ${id} deleted` };
  }
}


