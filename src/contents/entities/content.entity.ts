import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Topic } from 'src/topics/entities/topic.entity';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  urlImage?: string;

  @Column('text', { nullable: true })
  urlVideo?: string;

  @Column('text', { nullable: true })
  text?: string;

  @Column('uuid')
  topicId: string;

  @ManyToOne(() => Topic, (topic) => topic.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;
}


