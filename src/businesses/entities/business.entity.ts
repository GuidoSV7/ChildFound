import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Rubro } from 'src/rubros/entities/rubro.entity';

export enum BusinessStatus {
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  rubroId: string;

  @Column('text', { default: BusinessStatus.IN_PROGRESS })
  status: BusinessStatus;

  @Column('bool', { default: false })
  isSuccessful: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'finalized_at', type: 'timestamp', nullable: true })
  finalizedAt?: Date | null;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Rubro, (rubro) => rubro.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rubroId' })
  rubro: Rubro;
}


