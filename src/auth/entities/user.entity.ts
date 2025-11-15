import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Module } from 'src/modules/entities/module.entity';
import { UserTopic } from 'src/user-topics/entities/user-topic.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false,
        nullable: true
    })
    password: string;

    @Column('int', {
        nullable: true
    })
    age?: number;

    @Column('text', {
        nullable: true
    })
    city?: string;

    @Column('text', {
        nullable: true
    })
    rubro?: string;

    @Column('text', {
        nullable: true,
        unique: true
    })
    googleId?: string;

    @Column('uuid', {
        nullable: true
    })
    moduleId?: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    roles: Role;

    @ManyToOne(() => Module, (module) => module.users, { nullable: true })
    @JoinColumn({ name: 'moduleId' })
    module?: Module;

    @OneToMany(() => UserTopic, (userTopic) => userTopic.user)
    userTopics: UserTopic[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        if (this.email) {
            this.email = this.email.toLowerCase().trim();
        }
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }
}
