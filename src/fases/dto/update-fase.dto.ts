import { PartialType } from '@nestjs/swagger';
import { CreateFaseDto } from './create-fase.dto';

export class UpdateFaseDto extends PartialType(CreateFaseDto) {}


