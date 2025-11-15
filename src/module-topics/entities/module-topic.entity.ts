import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { Module } from 'src/modules/entities/module.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Entity('module_topics')
@Unique(['moduleId', 'topicId'])
export class ModuleTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  moduleId: string;

  @Column('uuid')
  topicId: string;

  @ManyToOne(() => Module, (module) => module.moduleTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @ManyToOne(() => Topic, (topic) => topic.moduleTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;
}

