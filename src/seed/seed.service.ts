import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/role.enum';
import { Rubro } from '../rubros/entities/rubro.entity';
import { Topic } from '../topics/entities/topic.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { ModuleTopic } from '../module-topics/entities/module-topic.entity';
import { Business, BusinessStatus } from '../businesses/entities/business.entity';
import { Fase } from '../fases/entities/fase.entity';
import { Certification, CertificationStatus } from '../certifications/entities/certification.entity';

import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    @InjectRepository( Rubro )
    private readonly rubroRepository: Repository<Rubro>,
    @InjectRepository( Topic )
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository( ModuleEntity )
    private readonly moduleRepository: Repository<ModuleEntity>,
    @InjectRepository( ModuleTopic )
    private readonly moduleTopicRepository: Repository<ModuleTopic>,
    @InjectRepository( Certification )
    private readonly certificationRepository: Repository<Certification>,
    @InjectRepository( Business )
    private readonly businessRepository: Repository<Business>,
    @InjectRepository( Fase )
    private readonly faseRepository: Repository<Fase>,
  ) {}

  async runSeed() {
    
    await this.deleteTables();
    await this.insertRubros();
    await this.insertFases();
    await this.insertModules();
    await this.insertTopics();
    await this.insertModuleTopics();
    await this.insertUsers();
    await this.insertBusinesses();
    await this.insertCertifications();
    return 'SEED EXECUTED';
  }

  async runSeedIfEmpty() {
    
    const results = [];


    // Verificar y seedear Users
    const existingUsers = await this.userRepository.count();
    if (existingUsers === 0) {
      await this.insertRubros();
      await this.insertFases();
      await this.insertModules();
      await this.insertTopics();
      await this.insertModuleTopics();
      await this.insertUsers();
      await this.insertBusinesses();
      await this.insertCertifications();
      results.push('Users seeded');
    } else {
      results.push('Users already exist');
    }
    return { message: 'SEED CHECK COMPLETED', details: results };
  }

  async forceSeed() {
    
    await this.deleteTables();
    await this.insertRubros();
    await this.insertFases();
    await this.insertModules();
    await this.insertTopics();
    await this.insertUsers();
    await this.insertBusinesses();
    return 'FORCE SEED EXECUTED';
  }

  async deleteTables() {
    
  
    
    await this.certificationRepository.delete({});
    await this.moduleTopicRepository.delete({});
    await this.topicRepository.delete({});
    await this.moduleRepository.delete({});
    await this.rubroRepository.delete({});
    await this.faseRepository.delete({});
    await this.userRepository.delete({});
  }


  private async insertRubros() {
    for (const r of initialData.rubros) {
      const rubro = this.rubroRepository.create({ name: r.name });
      await this.rubroRepository.save(rubro);
    }
  }

  private async insertModules() {
    const fases = await this.faseRepository.find();
    for (const [idx, m] of initialData.modules.entries()) {
      const fase = fases.length ? fases[idx % fases.length] : null;
      const module = this.moduleRepository.create({ name: m.name, faseId: fase?.id ?? null });
      await this.moduleRepository.save(module);
    }
  }

  private async insertTopics() {
    for (const t of initialData.topics) {
      const topic = this.topicRepository.create({ name: t.name });
      await this.topicRepository.save(topic);
    }
  }

  private async insertFases() {
    for (const f of initialData.fases) {
      const exists = await this.faseRepository.findOne({ where: { name: f.name } });
      if (!exists) {
        const fase = this.faseRepository.create({ name: f.name });
        await this.faseRepository.save(fase);
      }
    }
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

      // Buscar rubro y módulo por nombre si se proporcionan
      const rubro = userData.rubroName ? await this.rubroRepository.findOne({ where: { name: userData.rubroName } }) : null;
      const module = userData.moduleName ? await this.moduleRepository.findOne({ where: { name: userData.moduleName } }) : null;

      const user = this.userRepository.create({
        name: userData.userName,
        email: userData.email,
        password: hashedPassword,
        roles: role,
        rubroId: rubro?.id ?? null,
        moduleId: module?.id ?? null
      });

      const savedUser = await this.userRepository.save(user);
      createdUsers.push(savedUser);
    }
    // Generate additional users up to 30 total
    const rubros = await this.rubroRepository.find();
    const modules = await this.moduleRepository.find();
    const currentCount = await this.userRepository.count();
    const need = Math.max(0, 30 - currentCount);
    for (let i = 0; i < need; i++) {
      const idx = i + 1;
      const name = `User${idx + 100}`;
      const email = `user${idx + 100}@example.com`;
      const role: Role = Role.USER;
      const hashedPassword = bcrypt.hashSync('123456', 10);
      const rubro = rubros.length ? rubros[idx % rubros.length] : null;
      const module = modules.length ? modules[idx % modules.length] : null;
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        roles: role,
        rubroId: rubro?.id ?? null,
        moduleId: module?.id ?? null
      });
      await this.userRepository.save(user);
    }
    return createdUsers[0];
  }

  private async insertModuleTopics() {
    const modules = await this.moduleRepository.find();
    const topics = await this.topicRepository.find();
    if (modules.length === 0 || topics.length === 0) return;

    const relations: ModuleTopic[] = [];
    topics.forEach((topic, idx) => {
      const mod = modules[idx % modules.length];
      const rel = this.moduleTopicRepository.create({
        moduleId: mod.id,
        topicId: topic.id,
      });
      relations.push(rel);
    });
    await this.moduleTopicRepository.save(relations);
  }

  // insertUserTopics removed; replaced by insertCertifications

  private async insertCertifications() {
    const users = await this.userRepository.find();
    const topics = await this.topicRepository.find();
    if (users.length === 0 || topics.length === 0) return;

    const pickStatus = (p: number): CertificationStatus => {
      if (p <= 0) return CertificationStatus.PENDING;
      if (p >= 100) return CertificationStatus.COMPLETED;
      return CertificationStatus.IN_PROGRESS;
    };

    const relations: Certification[] = [];
    users.forEach((user, uIdx) => {
      const first = topics[uIdx % topics.length];
      const second = topics[(uIdx + 1) % topics.length];
      const progresses = [0, 30, 60, 100];
      [first, second].forEach((t, i) => {
        const progress = progresses[(uIdx + i) % progresses.length];
        const rel = this.certificationRepository.create({
          userId: user.id,
          topicId: t.id,
          progressPercentage: progress,
          status: pickStatus(progress),
          urlImage: null,
        });
        relations.push(rel);
      });
    });
    await this.certificationRepository.save(relations);
  }

  private async insertBusinesses() {
    const users = await this.userRepository.find();
    const rubros = await this.rubroRepository.find();
    if (users.length === 0) return;

    const businesses: Business[] = [];
    users.forEach((user, index) => {
      const rubroId = user.rubroId ?? (rubros.length ? rubros[index % rubros.length].id : null);
      const finished = index < 8; // first 8 finished
      const b = this.businessRepository.create({
        name: `Negocio de ${user.name}`,
        userId: user.id,
        rubroId: rubroId!,
        status: finished ? BusinessStatus.FINISHED : BusinessStatus.IN_PROGRESS,
        isSuccessful: finished,
        finalizedAt: finished ? new Date() : null
      });
      businesses.push(b);
    });
    if (businesses.length) {
      await this.businessRepository.save(businesses);
    }
  }

}
