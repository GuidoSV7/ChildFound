import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';

export enum CertificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('certifications')
@Unique(['userId', 'topicId'])
export class Certification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  topicId: string;

  @Column('int', { default: 0 })
  progressPercentage: number;

  @Column('text', { default: CertificationStatus.PENDING })
  status: CertificationStatus;

  @Column('text', { nullable: true })
  urlImage?: string;

  @ManyToOne(() => User, (user) => user.certifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Topic, (topic) => topic.certifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;
}


