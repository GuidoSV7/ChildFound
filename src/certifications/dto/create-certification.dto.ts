import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min, IsUrl } from 'class-validator';
import { CertificationStatus } from '../entities/certification.entity';

export class CreateCertificationDto {
  @ApiProperty() @IsUUID() userId: string;
  @ApiProperty() @IsUUID() topicId: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional() @IsInt() @Min(0) @Max(100)
  progressPercentage?: number;

  @ApiProperty({ required: false, enum: CertificationStatus, default: CertificationStatus.PENDING })
  @IsOptional() @IsEnum(CertificationStatus)
  status?: CertificationStatus;

  @ApiProperty({ required: false })
  @IsOptional() @IsUrl()
  urlImage?: string;
}


