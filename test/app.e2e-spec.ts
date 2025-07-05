import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('URL Shortener (e2e)', () => {
  let app: INestApplication<App>;
  let createdShortCode: string;
  let originalUrl: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/url', () => {
    it('should create a short URL successfully', async () => {
      originalUrl = 'https://www.example.com';
      
      const response = await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('originalUrl', originalUrl);
      expect(response.body).toHaveProperty('shortCode');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body.shortCode).toMatch(/^[a-zA-Z0-9]{6}$/);
      
      // Store for next test
      createdShortCode = response.body.shortCode;
    });

    it('should reject invalid URLs', async () => {
      await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: 'not-a-valid-url' })
        .expect(400);
    });

    it('should reject empty request body', async () => {
      await request(app.getHttpServer())
        .post('/api/url')
        .send({})
        .expect(400);
    });

    it('should create multiple unique short codes', async () => {
      const url1 = 'https://www.google.com';
      const url2 = 'https://www.github.com';
      
      const response1 = await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: url1 })
        .expect(201);
        
      const response2 = await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: url2 })
        .expect(201);
      
      expect(response1.body.shortCode).not.toBe(response2.body.shortCode);
      expect(response1.body.originalUrl).toBe(url1);
      expect(response2.body.originalUrl).toBe(url2);
    });
  });

  describe('GET /:shortCode', () => {
    it('should redirect to original URL', async () => {
      const response = await request(app.getHttpServer())
        .get(`/${createdShortCode}`)
        .expect(302);

      expect(response.headers.location).toBe(originalUrl);
    });

    it('should return 404 for non-existent short code', async () => {
      await request(app.getHttpServer())
        .get('/nonexistent123')
        .expect(404);
    });

    it('should return 404 for malformed short code', async () => {
      await request(app.getHttpServer())
        .get('/abc@#$')
        .expect(404);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full flow: create URL and redirect', async () => {
      const testUrl = 'https://nestjs.com';
      
      // Step 1: Create short URL
      const createResponse = await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: testUrl })
        .expect(201);
      
      const { shortCode } = createResponse.body;
      
      // Step 2: Use short URL and verify redirect
      const redirectResponse = await request(app.getHttpServer())
        .get(`/${shortCode}`)
        .expect(302);
      
      expect(redirectResponse.headers.location).toBe(testUrl);
    });
    
    it('should handle multiple concurrent requests', async () => {
      const urls = [
        'https://www.stackoverflow.com',
        'https://www.npmjs.com',
        'https://www.prisma.io'
      ];
      
      // Create multiple URLs concurrently
      const promises = urls.map(url => 
        request(app.getHttpServer())
          .post('/api/url')
          .send({ originalUrl: url })
          .expect(201)
      );
      
      const responses = await Promise.all(promises);
      
      // Verify all have unique short codes
      const shortCodes = responses.map(r => r.body.shortCode);
      const uniqueCodes = new Set(shortCodes);
      expect(uniqueCodes.size).toBe(shortCodes.length);
      
      // Verify all redirects work
      const redirectPromises = responses.map((response, index) => 
        request(app.getHttpServer())
          .get(`/${response.body.shortCode}`)
          .expect(302)
          .expect('Location', urls[index])
      );
      
      await Promise.all(redirectPromises);
    }, 10000); // 10 second timeout
  });
});
