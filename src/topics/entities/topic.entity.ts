import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ModuleTopic } from 'src/module-topics/entities/module-topic.entity';
import { Certification } from 'src/certifications/entities/certification.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;


  @OneToMany(() => ModuleTopic, (moduleTopic) => moduleTopic.topic)
  moduleTopics: ModuleTopic[];

  @OneToMany(() => Certification, (cert) => cert.topic)
  certifications: Certification[];
}

