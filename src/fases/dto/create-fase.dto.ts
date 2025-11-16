import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateFaseDto {
  @ApiProperty({ description: 'Nombre de la fase', example: 'Fase 1' })
  @IsString()
  @MinLength(1)
  name: string;
}


