import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // adjust path as needed
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(private readonly db: DatabaseService) {}

  generateShortCode(length = 6): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  async create(createUrlDto: CreateUrlDto) {
    const shortCode = this.generateShortCode();
    return this.db.url.create({
      data: {
        originalUrl: createUrlDto.originalUrl,
        shortCode,
      },
    });
  }

  async findOne(shortCode: string) {
    return this.db.url.findUnique({
      where: { shortCode },
    });
  }
}
