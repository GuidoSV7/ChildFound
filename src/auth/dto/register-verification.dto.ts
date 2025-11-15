import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class SendVerificationDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El código de referido debe ser una cadena de texto' })
  referralCode?: string;
}

export class VerifyCodeDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsString({ message: 'El código de verificación es requerido' })
  @MinLength(6, { message: 'El código debe tener 6 dígitos' })
  verificationCode: string;
}

export class ResendVerificationDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;
}
