import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, roles = Role.USER, ...userData } = createUserDto;
      
      // Normalize email to lowercase
      if (userData.email) {
        userData.email = userData.email.toLowerCase().trim();
      }
      
      const hashedPassword = bcrypt.hashSync(password, 10);

      const user = this.userRepository.create({
        ...userData,
        roles,
        password: hashedPassword
      });
      
      const savedUser = await this.userRepository.save(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = savedUser;

      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ 
          id: savedUser.id, 
          sub: savedUser.id, 
          roles: savedUser.roles 
        })
      };

    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Error creating user');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
  
    // Normalize email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase().trim();
  
    // First find user with basic info + role
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: { email: true, password: true, roles: true, id: true, name: true }
    });
  
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has a password
    if (!user.password) {
      throw new UnauthorizedException('User does not have a password set. Please set a password first.');
    }

    // Verify password
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Remove password from user data
    const { password: _, ...userWithoutPassword } = user;
  
    return {
      ...userWithoutPassword,
      token: this.getJwtToken({ 
        id: user.id, 
        sub: user.id, 
        roles: user.roles 
      })
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d' // Token válido por 1 día
    });
    return token;
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ 
        id: user.id, 
        sub: user.id, 
        roles: user.roles 
      })
    };
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: { password: true }
      });

      if (!user || !user.password) return false;

      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new InternalServerErrorException('Error al verificar la contraseña');
    }
  }

  async checkHasPassword(userId: string): Promise<{ hasPassword: boolean }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: { id: true, email: true, password: true }
      });

      if (!user) {
        console.error(`checkHasPassword - Usuario no encontrado con ID: ${userId}`);
        throw new UnauthorizedException('Usuario no encontrado. Por favor, inicia sesión nuevamente.');
      }

      console.log(`checkHasPassword - Usuario encontrado: ${user.email}, hasPassword: ${user.password !== null}`);

      return { hasPassword: user.password !== null && user.password !== undefined };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('checkHasPassword - Error:', error);
      throw new InternalServerErrorException('Error al verificar la contraseña');
    }
  }

  async setPassword(userId: string, setPasswordDto: SetPasswordDto): Promise<{ message: string }> {
    try {
      const { password, confirmPassword } = setPasswordDto;

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      // Buscar usuario
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: { id: true, password: true, email: true }
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Verificar que el usuario no tenga contraseña (solo usuarios de Google)
      if (user.password !== null) {
        throw new BadRequestException('Ya tienes una contraseña establecida');
      }

      // Hashear la nueva contraseña
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Actualizar contraseña
      await this.userRepository.update(userId, { password: hashedPassword });

      return { message: 'Contraseña establecida exitosamente' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al establecer la contraseña');
    }
  }
}
