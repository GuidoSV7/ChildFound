import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserTopicStatus } from '../entities/user-topic.entity';

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

  @ApiProperty({ description: 'Progreso del usuario en el tema (0-100)', required: false, example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage?: number;

  @ApiProperty({ description: 'Estado del progreso', required: false, enum: UserTopicStatus, example: UserTopicStatus.PENDING })
  @IsOptional()
  @IsEnum(UserTopicStatus)
  status?: UserTopicStatus;
}

