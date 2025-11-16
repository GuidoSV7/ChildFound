import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business, BusinessStatus } from './entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { User } from 'src/auth/entities/user.entity';
import { Rubro } from 'src/rubros/entities/rubro.entity';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rubro)
    private readonly rubroRepository: Repository<Rubro>,
  ) {}

  async create(createDto: CreateBusinessDto) {
    const user = await this.userRepository.findOne({ where: { id: createDto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const rubro = await this.rubroRepository.findOne({ where: { id: createDto.rubroId } });
    if (!rubro) throw new NotFoundException('Rubro no encontrado');

    const business = this.businessRepository.create({
      ...createDto,
      status: createDto.status ?? BusinessStatus.IN_PROGRESS,
      isSuccessful: createDto.isSuccessful ?? false,
    });
    try {
      return await this.businessRepository.save(business);
    } catch {
      throw new BadRequestException('Error creando negocio');
    }
  }

  findAll() {
    return this.businessRepository.find({ relations: ['user', 'rubro'] });
  }

  async findOne(id: string) {
    const business = await this.businessRepository.findOne({ where: { id }, relations: ['user', 'rubro'] });
    if (!business) throw new NotFoundException('Negocio no encontrado');
    return business;
  }

  findByUser(userId: string) {
    return this.businessRepository.find({ where: { userId }, relations: ['rubro'] });
  }

  findByRubro(rubroId: string) {
    return this.businessRepository.find({ where: { rubroId }, relations: ['user'] });
  }

  async update(id: string, updateDto: UpdateBusinessDto) {
    const business = await this.findOne(id);
    Object.assign(business, updateDto);
    return this.businessRepository.save(business);
  }

  async finish(id: string, isSuccessful: boolean) {
    const business = await this.findOne(id);
    business.status = BusinessStatus.FINISHED;
    business.isSuccessful = Boolean(isSuccessful);
    business.finalizedAt = new Date();
    return this.businessRepository.save(business);
  }

  async remove(id: string) {
    const business = await this.findOne(id);
    await this.businessRepository.remove(business);
    return { message: `Negocio ${id} eliminado` };
  }
}


