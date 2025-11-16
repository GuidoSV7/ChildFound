import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubrosService } from './rubros.service';
import { RubrosController } from './rubros.controller';
import { Rubro } from './entities/rubro.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [RubrosController],
  providers: [RubrosService],
  imports: [TypeOrmModule.forFeature([Rubro, User])],
  exports: [RubrosService, TypeOrmModule]
})
export class RubrosModule {}


