import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification, CertificationStatus } from './entities/certification.entity';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { User } from 'src/auth/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { IpfsService } from 'src/nft/ipfs.service';
import { NftService } from 'src/nft/nft.service';

@Injectable()
export class CertificationsService {
  constructor(
    @InjectRepository(Certification) private readonly certRepo: Repository<Certification>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Topic) private readonly topicRepo: Repository<Topic>,
    private readonly ipfsService: IpfsService,
    private readonly nftService: NftService,
  ) {}

  async create(dto: CreateCertificationDto) {
    const { userId, topicId, progressPercentage = 0, status = CertificationStatus.PENDING, urlImage } = dto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const topic = await this.topicRepo.findOne({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Topic not found');
    const exists = await this.certRepo.findOne({ where: { userId, topicId } });
    if (exists) throw new ConflictException('Certification already exists for user and topic');
    const cert = this.certRepo.create({ userId, topicId, progressPercentage, status, urlImage });
    try { return await this.certRepo.save(cert); } catch { throw new BadRequestException('Error creating certification'); }
  }

  findAll() { return this.certRepo.find({ relations: ['user', 'topic'] }); }
  findByUser(userId: string) { return this.certRepo.find({ where: { userId }, relations: ['topic'] }); }
  findByTopic(topicId: string) { return this.certRepo.find({ where: { topicId }, relations: ['user'] }); }
  async findOne(id: string) {
    const cert = await this.certRepo.findOne({ where: { id }, relations: ['user', 'topic'] });
    if (!cert) throw new NotFoundException('Certification not found');
    return cert;
  }

  async updateProgress(id: string, progressPercentage: number, status?: CertificationStatus, urlImage?: string) {
    if (progressPercentage < 0 || progressPercentage > 100) throw new BadRequestException('progressPercentage must be between 0 and 100');
    const cert = await this.certRepo.findOne({ where: { id } });
    if (!cert) throw new NotFoundException('Certification not found');
    cert.progressPercentage = progressPercentage;
    cert.urlImage = urlImage ?? cert.urlImage;
    if (status) cert.status = status;
    else cert.status = progressPercentage >= 100 ? CertificationStatus.COMPLETED : (progressPercentage <= 0 ? CertificationStatus.PENDING : CertificationStatus.IN_PROGRESS);

    // Auto-generate certificate image when completed and missing urlImage
    if (cert.status === CertificationStatus.COMPLETED && !cert.urlImage) {
      // Fetch user/topic to personalize the certificate
      const [user, topic] = await Promise.all([
        this.userRepo.findOne({ where: { id: cert.userId } }),
        this.topicRepo.findOne({ where: { id: cert.topicId } }),
      ]);
      const recipientName = user?.name ?? 'Usuario';
      const topicName = topic?.name ?? 'Tema';
      const png = await this.renderCertificatePng(recipientName, topicName);
      const imageUri = await this.ipfsService.pinFileBuffer(png, `certificate-${recipientName}-${topicName}.png`);
      cert.urlImage = imageUri;
    }

    return this.certRepo.save(cert);
  }

  async remove(id: string) {
    const cert = await this.findOne(id);
    await this.certRepo.remove(cert);
    return { message: 'Certification deleted' };
  }

  renderCertificateHtml(name: string, topic: string) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    // Using Tailwind CDN for quick styling
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificado</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .certificate-bg {
      background-image:
        radial-gradient(ellipse at top left, rgba(255,255,255,0.25), transparent 60%),
        radial-gradient(ellipse at bottom right, rgba(255,255,255,0.15), transparent 60%);
    }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center py-10 px-4">
  <main class="w-full max-w-4xl">
    <section class="relative certificate-bg rounded-2xl border border-slate-700/70 shadow-2xl overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-20 -left-20 w-72 h-72 bg-fuchsia-500/20 blur-3xl rounded-full"></div>
        <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full"></div>
      </div>

      <div class="relative p-8 sm:p-12 bg-slate-900/40 backdrop-blur">
        <div class="flex items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400"></div>
            <div>
              <p class="text-xs uppercase tracking-widest text-slate-400">Reconocimiento oficial</p>
              <h2 class="text-base font-semibold text-slate-200">Certificado de finalización</h2>
            </div>
          </div>
          <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
            Completado
          </span>
        </div>

        <div class="text-center space-y-6">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Felicidades <span class="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-300">${this.escapeHtml(name)}</span>
          </h1>
          <p class="text-slate-300 text-lg sm:text-xl">
            por completar el tema <span class="font-semibold text-slate-100">“${this.escapeHtml(topic)}”</span>
          </p>
          <p class="text-sm text-slate-400">Otorgado el ${formattedDate}</p>
        </div>

        <div class="mt-10">
            <div class="h-12 border-t border-slate-700/70"></div>
            <p class="text-sm text-slate-300 font-medium">Dirección del Programa</p>
            <p class="text-xs text-slate-400">Firma autorizada</p>
        </div>
      </div>
    </section>
  </main>
</body>
</html>`;
  }

  private escapeHtml(input: string): string {
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async renderCertificatePng(name: string, topic: string): Promise<Buffer> {
    // Lazy import to avoid requiring puppeteer in environments that don't need PNG generation
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    } as any);
    try {
      const page = await browser.newPage();
      const html = this.renderCertificateHtml(name, topic);
      await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pngBuffer = await page.screenshot({ type: 'png', fullPage: true }) as Buffer;
      await page.close();
      return pngBuffer;
    } finally {
      await browser.close();
    }
  }

  async mintCertificateNft(to: string, name: string, topic: string) {
    const png = await this.renderCertificatePng(name, topic);
    const imageUri = await this.ipfsService.pinFileBuffer(png, `certificate-${name}-${topic}.png`);
    const nowIso = new Date().toISOString();
    const metadata = {
      name: `Certificado - ${name}`,
      description: `Felicidades ${name} por completar el tema ${topic}.`,
      image: imageUri,
      attributes: [
        { trait_type: 'Recipient', value: name },
        { trait_type: 'Topic', value: topic },
        { trait_type: 'Issued At', value: nowIso },
      ],
    };
    const tokenURI = await this.ipfsService.pinJson(metadata, `cert-${name}-${topic}`);
    const mintResult = await this.nftService.mint(to, tokenURI);
    return { imageUri, tokenURI, ...mintResult };
  }

  async mintCertificateNftDefault(name: string, topic: string) {
    const defaultTo = process.env.DEFAULT_MINT_TO?.trim();
    if (!defaultTo) {
      throw new BadRequestException('DEFAULT_MINT_TO env var is not set');
    }
    const result = await this.mintCertificateNft(defaultTo, name, topic);
    const contractAddress = process.env.CONTRACT_ADDRESS?.trim();
    const tokenExplorerBase = process.env.BLOCK_EXPLORER_TOKEN_BASE?.trim(); // e.g., https://sepolia.etherscan.io/token/
    const txExplorerBase = process.env.BLOCK_EXPLORER_TX_BASE?.trim(); // e.g., https://sepolia.etherscan.io/tx/

    const tokenId = (result as any).tokenId as string | undefined;
    const txHash = (result as any).txHash as string | undefined;

    const tokenUrl = tokenExplorerBase && contractAddress && tokenId
      ? `${tokenExplorerBase.replace(/\/+$/,'')}/${contractAddress}?a=${tokenId}`
      : undefined;

    const txUrl = txExplorerBase && txHash
      ? `${txExplorerBase.replace(/\/+$/,'')}/${txHash}`
      : undefined;

    return {
      imageUri: result.imageUri,
      tokenURI: result.tokenURI,
      tokenId,
      txHash,
      contractAddress,
      tokenUrl, // Ready-to-open URL if BASE provided
      txUrl,
    };
  }
}


