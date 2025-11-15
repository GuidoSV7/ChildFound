import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTopic } from 'src/user-topics/entities/user-topic.entity';
import { ModuleTopic } from 'src/module-topics/entities/module-topic.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @OneToMany(() => UserTopic, (userTopic) => userTopic.topic)
  userTopics: UserTopic[];

  @OneToMany(() => ModuleTopic, (moduleTopic) => moduleTopic.topic)
  moduleTopics: ModuleTopic[];
}

