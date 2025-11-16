import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { IpfsService } from './ipfs.service';

@Module({
  controllers: [NftController],
  providers: [NftService, IpfsService],
  exports: [NftService, IpfsService]
})
export class NftModule {}


