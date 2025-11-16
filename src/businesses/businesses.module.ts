import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { Business } from './entities/business.entity';
import { User } from 'src/auth/entities/user.entity';
import { Rubro } from 'src/rubros/entities/rubro.entity';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
  imports: [TypeOrmModule.forFeature([Business, User, Rubro])],
  exports: [BusinessesService, TypeOrmModule]
})
export class BusinessesModule {}


