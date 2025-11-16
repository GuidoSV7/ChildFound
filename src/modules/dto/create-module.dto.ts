import { IsString, MinLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Nombre del módulo',
    example: 'Módulo de Desarrollo'
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'ID de la fase (opcional) a la que pertenece el módulo',
    required: false
  })
  @IsOptional()
  @IsUUID()
  faseId?: string;
}

