import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTopicDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID del tema',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  topicId: string;
}

