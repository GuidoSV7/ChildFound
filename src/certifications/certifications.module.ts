import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationsService } from './certifications.service';
import { CertificationsController } from './certifications.controller';
import { Certification } from './entities/certification.entity';
import { User } from 'src/auth/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { NftModule } from 'src/nft/nft.module';
import { IpfsService } from 'src/nft/ipfs.service';
import { NftService } from 'src/nft/nft.service';

@Module({
  controllers: [CertificationsController],
  providers: [CertificationsService, IpfsService, NftService],
  imports: [TypeOrmModule.forFeature([Certification, User, Topic]), NftModule],
  exports: [CertificationsService, TypeOrmModule]
})
export class CertificationsModule {}


