import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleTopicDto {
  @ApiProperty({
    description: 'ID del módulo',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  moduleId: string;

  @ApiProperty({
    description: 'ID del tema',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  topicId: string;
}

