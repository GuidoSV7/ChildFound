import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity('rubros')
export class Rubro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.rubro)
  users: User[];
}


