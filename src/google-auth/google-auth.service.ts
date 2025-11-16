import { Injectable, BadRequestException, InternalServerErrorException, ConflictException, HttpException, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';

import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/role.enum';
import { GoogleAuthDto } from './dto/google-auth.dto';
import googleOauthConfig from './google-oauth.config';

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
  ) {}

  async validateGoogleUser(googleUser: any) {
    try {
      const { email, name, googleId } = googleUser;
      
      if (!email) {
        throw new BadRequestException('Email not provided by Google');
      }
      
      const normalizedEmail = email.toLowerCase().trim();

      // Check if user already exists
      let existingUser = await this.userRepository.findOne({
        where: { email: normalizedEmail }
      });

      if (existingUser) {
        // Update Google ID if not set
        if (!existingUser.googleId) {
          existingUser.googleId = googleId;
          await this.userRepository.save(existingUser);
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = existingUser;

        return userWithoutPassword;
      }

      // Create new user
      const newUser = this.userRepository.create({
        email: normalizedEmail,
        name,
        googleId,
        roles: Role.USER, // Default role for Google users
        password: null // No password for Google users
      });

      const savedUser = await this.userRepository.save(newUser);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;

    } catch (error) {
      console.error('Error validating Google user:', error);
      throw new InternalServerErrorException('Error processing Google authentication');
    }
  }

  /**
   * Mobile: verify Google ID Token and find/create user
   */
  async authenticateWithGoogleIdToken(idToken: string) {
    try {
      if (!idToken || idToken.trim() === '') {
        throw new BadRequestException('El idToken de Google es requerido');
      }

      // Verify token with Google
      const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
      if (!tokenInfoResponse.ok) {
        throw new UnauthorizedException('idToken de Google inválido');
      }
      const tokenInfo: any = await tokenInfoResponse.json();

      const audience = tokenInfo.aud as string | undefined;
      const email = tokenInfo.email as string | undefined;
      const emailVerified = tokenInfo.email_verified === 'true' || tokenInfo.email_verified === true;
      const googleId = tokenInfo.sub as string | undefined;
      const name = (tokenInfo.name as string | undefined) ?? '';

      // Validate audience matches our client ID
      if (!audience || audience !== this.googleConfiguration.clientID) {
        throw new UnauthorizedException('Audiencia del token inválida');
      }
      if (!email || !emailVerified) {
        throw new UnauthorizedException('El email del token no está verificado');
      }
      if (!googleId) {
        throw new UnauthorizedException('Token de Google sin identificador de usuario');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Find by email or googleId
      let existingUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: normalizedEmail })
        .orWhere('user.googleId = :googleId', { googleId })
        .getOne();

      if (existingUser && existingUser.googleId === googleId && existingUser.email !== normalizedEmail) {
        throw new ConflictException('Ya existe un usuario con este Google ID vinculado a otro email');
      }

      if (existingUser) {
        let needsUpdate = false;
        if (!existingUser.googleId || existingUser.googleId !== googleId) {
          existingUser.googleId = googleId;
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
        googleId,
        roles: Role.USER,
        password: null,
      });
      const savedUser = await this.userRepository.save(newUser);
      const { password: _, ...userWithoutPassword } = savedUser;
      return { ...userWithoutPassword, isNewUser: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error verificando idToken de Google:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOrCreateUser(googleProfile: any) {
    try {
      const { emails, displayName, id: googleId } = googleProfile;
      const email = emails[0]?.value;
      const name = displayName;

      if (!email) {
        throw new BadRequestException('Email not provided by Google');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if user exists
      let user = await this.userRepository.findOne({
        where: { email: normalizedEmail }
      });

      if (user) {
        // Update Google ID if not set
        if (!user.googleId) {
          user.googleId = googleId;
          await this.userRepository.save(user);
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      // Create new user
      const newUser = this.userRepository.create({
        email,
        name,
        googleId,
        roles: Role.USER,
        password: null
      });

      const savedUser = await this.userRepository.save(newUser);

      const { password: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;

    } catch (error) {
      console.error('Error finding or creating user:', error);
      throw new InternalServerErrorException('Error processing Google authentication');
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async authenticateWithGoogle(googleAuthDto: GoogleAuthDto) {
    try {
      const { googleId, email, name, picture } = googleAuthDto;

      // Validar que googleId no esté vacío
      if (!googleId || googleId.trim() === '') {
        throw new BadRequestException('El ID de Google es requerido');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('El email no es válido');
      }

      // Validar que name no esté vacío
      if (!name || name.trim() === '') {
        throw new BadRequestException('El nombre es requerido');
      }

      // Buscar usuario existente por email O por googleId
      const normalizedEmail = email.toLowerCase().trim();
      let existingUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: normalizedEmail })
        .orWhere('user.googleId = :googleId', { googleId })
        .getOne();

      // Si encontramos un usuario por googleId pero con email diferente, es un conflicto
      if (existingUser && existingUser.googleId === googleId && existingUser.email !== normalizedEmail) {
        throw new ConflictException('Ya existe un usuario con este Google ID vinculado a otro email');
      }

      let isNewUser = false;

      if (existingUser) {
        // Usuario existe - actualizar datos si es necesario
        let needsUpdate = false;

        // Actualizar googleId si no lo tiene o es diferente
        if (!existingUser.googleId || existingUser.googleId !== googleId) {
          existingUser.googleId = googleId;
          needsUpdate = true;
        }

        // Actualizar name si es diferente
        if (existingUser.name !== name) {
          existingUser.name = name;
          needsUpdate = true;
        }

        // Guardar cambios si es necesario
        if (needsUpdate) {
          await this.userRepository.save(existingUser);
        }

        const { password: _, ...userWithoutPassword } = existingUser;

        return {
          ...userWithoutPassword,
          isNewUser: false
        };
      }

      // Crear nuevo usuario
      const newUser = this.userRepository.create({
        email: normalizedEmail,
        name,
        googleId,
        roles: Role.USER, // Rol por defecto para usuarios de Google
        password: null // No password para usuarios de Google
      });

      const savedUser = await this.userRepository.save(newUser);

      const { password: _, ...userWithoutPassword } = savedUser;

      return {
        ...userWithoutPassword,
        isNewUser: true
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error en autenticación con Google:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

}