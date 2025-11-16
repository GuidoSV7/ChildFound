import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FasesService } from './fases.service';
import { FasesController } from './fases.controller';
import { Fase } from './entities/fase.entity';

@Module({
  controllers: [FasesController],
  providers: [FasesService],
  imports: [TypeOrmModule.forFeature([Fase])],
  exports: [FasesService, TypeOrmModule]
})
export class FasesModule {}


