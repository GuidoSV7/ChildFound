import { Controller, Get, Post, Body, Param, Delete, Patch, Header, Query } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CertificationStatus } from './entities/certification.entity';

@ApiTags('Certifications')
@Controller('certifications')
export class CertificationsController {
  constructor(private readonly service: CertificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create certification (user-topic)' })
  create(@Body() dto: CreateCertificationDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all certifications' })
  findAll() { return this.service.findAll(); }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'List certifications by user' })
  findByUser(@Param('userId') userId: string) { return this.service.findByUser(userId); }

  @Get('by-topic/:topicId')
  @ApiOperation({ summary: 'List certifications by topic' })
  findByTopic(@Param('topicId') topicId: string) { return this.service.findByTopic(topicId); }

  @Get('certificate')
  @ApiOperation({ summary: 'Generate certificate HTML' })
  @Header('Content-Type', 'text/html; charset=utf-8')
  getCertificate(
    @Query('name') name?: string,
    @Query('topic') topic?: string,
  ) {
    return this.service.renderCertificateHtml(name ?? 'Usuario', topic ?? 'Tema');
  }

  @Post('certificate/mint')
  @ApiOperation({ summary: 'Generate certificate PNG and mint as NFT' })
  async mintCertificateNft(
    @Body('to') to: string,
    @Body('name') name: string,
    @Body('topic') topic: string,
  ) {
    if (!to || !name || !topic) {
      return { error: 'Missing to, name or topic' };
    }
    return this.service.mintCertificateNft(to, name, topic);
  }

  @Post('certificate/mint-simple')
  @ApiOperation({ summary: 'Mint NFT using only name and topic (uses DEFAULT_MINT_TO)' })
  async mintCertificateNftSimple(
    @Body('name') name: string,
    @Body('topic') topic: string,
  ) {
    if (!name || !topic) {
      return { error: 'Missing name or topic' };
    }
    return this.service.mintCertificateNftDefault(name, topic);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certification by id' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update progress, status and urlImage' })
  updateProgress(
    @Param('id') id: string,
    @Body('progressPercentage') progressPercentage: number,
    @Body('status') status?: CertificationStatus,
    @Body('urlImage') urlImage?: string,
  ) {
    return this.service.updateProgress(id, Number(progressPercentage), status, urlImage);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete certification' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}


