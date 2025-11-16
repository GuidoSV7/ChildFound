import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  urlImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  urlVideo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty()
  @IsUUID()
  topicId: string;
}


