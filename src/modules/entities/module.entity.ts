import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ModuleTopic } from 'src/module-topics/entities/module-topic.entity';
import { Fase } from 'src/fases/entities/fase.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('uuid', { nullable: true })
  faseId?: string;

  @OneToMany(() => User, (user) => user.module)
  users: User[];

  @OneToMany(() => ModuleTopic, (moduleTopic) => moduleTopic.module)
  moduleTopics: ModuleTopic[];

  @ManyToOne(() => Fase, (fase) => fase.modules, { nullable: true })
  @JoinColumn({ name: 'faseId' })
  fase?: Fase;
}

