import { Injectable } from '@nestjs/common';
// Import CommonJS default export (class)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PinataClient = require('@pinata/sdk');

@Injectable()
export class IpfsService {
  private readonly pinata: any;

  constructor() {
    const apiKey = process.env.PINATA_API_KEY;
    const apiSecret = process.env.PINATA_API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('PINATA_API_KEY and PINATA_API_SECRET must be set to upload metadata to IPFS');
    }
    // Use CJS class constructor style: new PinataClient({ pinataApiKey, pinataSecretApiKey })
    this.pinata = new PinataClient({
      pinataApiKey: apiKey,
      pinataSecretApiKey: apiSecret,
    });
  }

  async pinJson(metadata: Record<string, any>, nameHint?: string): Promise<string> {
    const options = {
      pinataMetadata: {
        name: nameHint || 'certificate-metadata',
      },
    };
    const res = await this.pinata.pinJSONToIPFS(metadata, options);
    // res.IpfsHash is a CID (v1 or v0). Build ipfs:// URI
    return `ipfs://${res.IpfsHash}`;
  }
}


