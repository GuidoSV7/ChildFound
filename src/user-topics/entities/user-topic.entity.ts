import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Entity('user_topics')
@Unique(['userId', 'topicId'])
export class UserTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  topicId: string;

  @ManyToOne(() => User, (user) => user.userTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Topic, (topic) => topic.userTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;
}

