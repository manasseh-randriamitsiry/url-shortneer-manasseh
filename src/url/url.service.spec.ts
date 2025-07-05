import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { DatabaseService } from '../database/database.service';

describe('UrlService', () => {
  let service: UrlService;

  const mockDatabaseService = {
    url: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a short code', () => {
    const shortCode = service.generateShortCode();
    expect(shortCode).toBeDefined();
    expect(typeof shortCode).toBe('string');
    expect(shortCode.length).toBe(6);
  });

  it('should create a short URL', async () => {
    const createUrlDto = { originalUrl: 'https://example.com' };
    const mockResult = {
      id: 1,
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      createdAt: new Date(),
    };

    mockDatabaseService.url.create.mockResolvedValue(mockResult);

    const result = await service.create(createUrlDto);
    expect(result).toEqual(mockResult);
    expect(mockDatabaseService.url.create).toHaveBeenCalledWith({
      data: {
        originalUrl: createUrlDto.originalUrl,
        shortCode: expect.any(String) as string,
      },
    });
  });

  it('should find a URL by short code', async () => {
    const shortCode = 'abc123';
    const mockResult = {
      id: 1,
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      createdAt: new Date(),
    };

    mockDatabaseService.url.findUnique.mockResolvedValue(mockResult);

    const result = await service.findOne(shortCode);
    expect(result).toEqual(mockResult);
    expect(mockDatabaseService.url.findUnique).toHaveBeenCalledWith({
      where: { shortCode },
    });
  });
});
