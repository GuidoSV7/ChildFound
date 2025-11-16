import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRubroDto {
  @ApiProperty({ description: 'Nombre del rubro', example: 'Tecnología' })
  @IsString()
  @MinLength(1)
  name: string;
}


