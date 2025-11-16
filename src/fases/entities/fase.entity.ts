import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Module as ModuleEntity } from 'src/modules/entities/module.entity';

@Entity('fases')
export class Fase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @OneToMany(() => ModuleEntity, (m) => m.fase)
  modules: ModuleEntity[];
}


