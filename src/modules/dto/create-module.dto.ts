import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Nombre del módulo',
    example: 'Módulo de Desarrollo'
  })
  @IsString()
  @MinLength(1)
  name: string;
}

