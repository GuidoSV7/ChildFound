import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { BusinessStatus } from '../entities/business.entity';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Nombre del negocio', example: 'Panadería San Juan' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'ID del usuario dueño del negocio' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID del rubro del negocio' })
  @IsUUID()
  rubroId: string;

  @ApiProperty({ enum: BusinessStatus, required: false, default: BusinessStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(BusinessStatus)
  status?: BusinessStatus;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isSuccessful?: boolean;
}


