import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // adjust path as needed
import { CreateUrlDto } from './dto/create-url.dto';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  constructor(private readonly db: DatabaseService) {}

  generateShortCode(length = 6): string {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  async create(createUrlDto: CreateUrlDto) {
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    // Generate a unique short code
    do {
      shortCode = this.generateShortCode();
      attempts++;

      if (attempts > maxAttempts) {
        throw new Error('Unable to generate unique short code');
      }

      const existing = await this.findOne(shortCode);
      if (!existing) {
        break;
      }
    } while (attempts <= maxAttempts);

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
