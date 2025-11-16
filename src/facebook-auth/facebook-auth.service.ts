import { Inject, Injectable, BadRequestException, ConflictException, HttpException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/role.enum';
import { FacebookAuthDto } from './dto/facebook-auth.dto';
import facebookOauthConfig from './facebook-oauth.config';

@Injectable()
export class FacebookAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(facebookOauthConfig.KEY)
    private readonly facebookConfig: ConfigType<typeof facebookOauthConfig>,
  ) {}

  async authenticateWithFacebook(dto: FacebookAuthDto): Promise<{
    id: string;
    name: string;
    email: string;
    roles: Role;
    facebookId?: string;
    isNewUser: boolean;
  }> {
    try {
      const { facebookId, email, name } = dto;
      if (!facebookId || facebookId.trim() === '') {
        throw new BadRequestException('El ID de Facebook es requerido');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('El email no es válido');
      }
      if (!name || name.trim() === '') {
        throw new BadRequestException('El nombre es requerido');
      }

      const normalizedEmail = email.toLowerCase().trim();
      let existingUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: normalizedEmail })
        .orWhere('user.facebookId = :facebookId', { facebookId })
        .getOne();

      if (existingUser && existingUser.facebookId === facebookId && existingUser.email !== normalizedEmail) {
        throw new ConflictException('Ya existe un usuario con este Facebook ID vinculado a otro email');
      }

      if (existingUser) {
        let needsUpdate = false;
        if (!existingUser.facebookId || existingUser.facebookId !== facebookId) {
          existingUser.facebookId = facebookId;
          needsUpdate = true;
        }
        if (existingUser.name !== name) {
          existingUser.name = name;
          needsUpdate = true;
        }
        if (needsUpdate) {
          await this.userRepository.save(existingUser);
        }
        const { password: _, ...userWithoutPassword } = existingUser;
        return { ...userWithoutPassword, isNewUser: false };
      }

      const newUser = this.userRepository.create({
        email: normalizedEmail,
        name,
        facebookId,
        roles: Role.USER,
        password: null,
      });
      const savedUser = await this.userRepository.save(newUser);
      const { password: _, ...userWithoutPassword } = savedUser as User & { password?: string };
      return { ...(userWithoutPassword as Omit<User,'password'>), isNewUser: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error en autenticación con Facebook:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async authenticateWithFacebookAccessToken(accessToken: string): Promise<{
    id: string;
    name: string;
    email: string;
    roles: Role;
    facebookId?: string;
    isNewUser: boolean;
  }> {
    try {
      if (!accessToken || accessToken.trim() === '') {
        throw new BadRequestException('El accessToken de Facebook es requerido');
      }

      // 1) Validate token belongs to our app
      const appToken = `${this.facebookConfig.appId}|${this.facebookConfig.appSecret}`;
      const debugResp = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appToken)}`
      );
      if (!debugResp.ok) {
        throw new UnauthorizedException('accessToken de Facebook inválido');
      }
      const debugData: any = await debugResp.json();
      const isValid = debugData?.data?.is_valid === true;
      const appId = debugData?.data?.app_id as string | undefined;
      if (!isValid || !appId || appId !== this.facebookConfig.appId) {
        throw new UnauthorizedException('Token no válido para esta aplicación');
      }

      // 2) Fetch user info
      const meResp = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`
      );
      if (!meResp.ok) {
        throw new UnauthorizedException('No se pudo obtener el perfil de Facebook');
      }
      const me: any = await meResp.json();
      const facebookId: string | undefined = me.id;
      const name: string = me.name ?? '';
      const email: string | undefined = me.email;

      if (!facebookId) {
        throw new UnauthorizedException('No se encontró el ID de usuario de Facebook');
      }
      if (!email) {
        // Facebook puede no retornar email si no se otorgó permiso
        throw new BadRequestException('El email de Facebook no está disponible');
      }

      const normalizedEmail = email.toLowerCase().trim();
      let existingUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: normalizedEmail })
        .orWhere('user.facebookId = :facebookId', { facebookId })
        .getOne();

      if (existingUser && existingUser.facebookId === facebookId && existingUser.email !== normalizedEmail) {
        throw new ConflictException('Ya existe un usuario con este Facebook ID vinculado a otro email');
      }

      if (existingUser) {
        let needsUpdate = false;
        if (!existingUser.facebookId || existingUser.facebookId !== facebookId) {
          existingUser.facebookId = facebookId;
          needsUpdate = true;
        }
        if (name && existingUser.name !== name) {
          existingUser.name = name;
          needsUpdate = true;
        }
        if (needsUpdate) {
          await this.userRepository.save(existingUser);
        }
        const { password: _, ...userWithoutPassword } = existingUser;
        return { ...userWithoutPassword, isNewUser: false };
      }

      const newUser = this.userRepository.create({
        email: normalizedEmail,
        name: name || normalizedEmail.split('@')[0],
        facebookId,
        roles: Role.USER,
        password: null,
      });
      const savedUser = await this.userRepository.save(newUser);
      const { password: _, ...userWithoutPassword } = savedUser as User & { password?: string };
      return { ...(userWithoutPassword as Omit<User,'password'>), isNewUser: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error verificando accessToken de Facebook:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOrCreateUserFromStrategy(strategyUser: any): Promise<Omit<User,'password'>> {
    try {
      const { email, name, facebookId } = strategyUser;
      if (!email) {
        throw new BadRequestException('Email no proporcionado por Facebook');
      }
      const normalizedEmail = email.toLowerCase().trim();
      let user = await this.userRepository.findOne({ where: { email: normalizedEmail } });
      if (user) {
        if (!user.facebookId) {
          user.facebookId = facebookId;
          await this.userRepository.save(user);
        }
        const { password: _, ...userWithoutPassword } = user as User & { password?: string };
        return userWithoutPassword as Omit<User,'password'>;
      }
      const newUser = this.userRepository.create({
        email: normalizedEmail,
        name,
        facebookId,
        roles: Role.USER,
        password: null,
      });
      const saved = await this.userRepository.save(newUser);
      const { password: _, ...userWithoutPassword } = saved as User & { password?: string };
      return userWithoutPassword as Omit<User,'password'>;
    } catch (error) {
      console.error('Error findOrCreateUserFromStrategy:', error);
      throw new InternalServerErrorException('Error procesando autenticación de Facebook');
    }
  }
}


