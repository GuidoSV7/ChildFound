import { Body, Controller, Post } from '@nestjs/common';
import { NftService } from './nft.service';
import { IpfsService } from './ipfs.service';

@Controller('nft')
export class NftController {
  constructor(
    private readonly nftService: NftService,
    private readonly ipfsService: IpfsService,
  ) {}

  @Post('mint')
  async mint(@Body() body: { to: string; tokenURI: string }) {
    const { to, tokenURI } = body;
    // Basic payload validation
    if (!to || !tokenURI) {
      return { error: 'Missing to or tokenURI' };
    }
    return this.nftService.mint(to, tokenURI);
  }

  @Post('mint-certificate')
  async mintCertificate(
    @Body()
    body: {
      to: string;
      recipientName: string;
      courseName?: string;
      issuedAt?: string; // ISO date string
      image?: string; // optional: URL or ipfs://
      attributes?: Array<{ trait_type: string; value: string | number }>;
      description?: string;
    },
  ) {
    const { to, recipientName } = body;
    if (!to || !recipientName) {
      return { error: 'Missing to or recipientName' };
    }

    const metadata = {
      name: `Certificate - ${recipientName}`,
      description:
        body.description ||
        `Certificate awarded to ${recipientName}${body.courseName ? ` for ${body.courseName}` : ''}.`,
      image: body.image, // optional; can be https:// or ipfs://
      attributes: [
        ...(body.attributes || []),
        { trait_type: 'Recipient', value: recipientName },
        ...(body.courseName ? [{ trait_type: 'Course', value: body.courseName }] : []),
        ...(body.issuedAt ? [{ trait_type: 'Issued At', value: body.issuedAt }] : []),
      ],
    };

    const tokenURI = await this.ipfsService.pinJson(metadata, `cert-${recipientName}`);
    return this.nftService.mint(to, tokenURI);
  }
}


