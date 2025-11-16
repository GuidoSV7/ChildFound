import { Injectable } from '@nestjs/common';
import { Contract, JsonRpcProvider, Wallet, isAddress } from 'ethers';
// Load JSON at runtime to avoid TS resolveJsonModule requirement
// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../abi/nft-erc721.abi.json');

@Injectable()
export class NftService {
  private readonly contract: Contract;

  constructor() {
    const rpcUrl = process.env.RPC_URL?.trim();
    const privateKey = process.env.PRIVATE_KEY?.trim();
    const contractAddress = process.env.CONTRACT_ADDRESS?.trim();

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS must be set in environment variables');
    }

    if (!isAddress(contractAddress)) {
      throw new Error(`Invalid CONTRACT_ADDRESS: ${contractAddress}. It must be a 20-byte hex address (0x...)`);
    }

    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);
    this.contract = new Contract(contractAddress, abi as any, wallet);
  }

  async mint(to: string, tokenURI: string) {
    const tx = await this.contract.safeMint(to, tokenURI);
    const receipt = await tx.wait();
    const tokenId = await this.contract.nextTokenId().then((n: bigint) => (n - 1n).toString());
    return { txHash: receipt?.hash, status: receipt?.status, tokenId };
  }
}


