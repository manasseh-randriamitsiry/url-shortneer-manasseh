import { Controller, Get, Post, Body, Param, Redirect, NotFoundException } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('api/url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get('/:shortCode')
  @Redirect()
  async redirect(@Param('shortCode') code: string) {
    const url = await this.urlService.findOne(code);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return { url: url.originalUrl };
  }
}
