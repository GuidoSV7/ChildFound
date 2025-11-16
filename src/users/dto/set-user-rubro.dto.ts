import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SetUserRubroDto {
  @ApiProperty({ description: 'ID del rubro a asignar', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  rubroId: string;
}


