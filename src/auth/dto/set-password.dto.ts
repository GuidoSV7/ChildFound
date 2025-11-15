import { IsString, MinLength, Matches } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @MinLength(6, { message: 'La confirmación de contraseña debe tener al menos 6 caracteres' })
  confirmPassword: string;
}
