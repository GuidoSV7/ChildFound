import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({
    description: 'Nombre del tema',
    example: 'JavaScript'
  })
  @IsString()
  @MinLength(1)
  name: string;
}

