import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: JwtPayload ): Promise<User> {
        
        const { id } = payload;

        console.log(`JWT Strategy - Validando token para userId: ${id}`);

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) {
            console.error(`JWT Strategy - Usuario no encontrado con ID: ${id}`);
            throw new UnauthorizedException('Token not valid - User not found');
        }

        console.log(`JWT Strategy - Usuario validado: ${user.email}`);

        return user;
    }

}