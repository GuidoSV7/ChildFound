import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ModuleTopic } from 'src/module-topics/entities/module-topic.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @OneToMany(() => User, (user) => user.module)
  users: User[];

  @OneToMany(() => ModuleTopic, (moduleTopic) => moduleTopic.module)
  moduleTopics: ModuleTopic[];
}

