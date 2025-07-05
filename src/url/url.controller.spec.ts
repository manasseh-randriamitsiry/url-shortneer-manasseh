import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { NotFoundException } from '@nestjs/common';

describe('UrlController', () => {
  let controller: UrlController;

  const mockUrlService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a short URL', async () => {
    const createUrlDto = { originalUrl: 'https://example.com' };
    const mockResult = {
      id: 1,
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      createdAt: new Date(),
    };

    mockUrlService.create.mockResolvedValue(mockResult);

    const result = await controller.create(createUrlDto);
    expect(result).toEqual(mockResult);
    expect(mockUrlService.create).toHaveBeenCalledWith(createUrlDto);
  });

  it('should redirect to original URL', async () => {
    const shortCode = 'abc123';
    const mockUrl = {
      id: 1,
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      createdAt: new Date(),
    };

    mockUrlService.findOne.mockResolvedValue(mockUrl);

    const result = await controller.redirect(shortCode);
    expect(result).toEqual({ url: mockUrl.originalUrl });
    expect(mockUrlService.findOne).toHaveBeenCalledWith(shortCode);
  });

  it('should throw NotFoundException when URL not found', async () => {
    const shortCode = 'nonexistent';
    mockUrlService.findOne.mockResolvedValue(null);

    await expect(controller.redirect(shortCode)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUrlService.findOne).toHaveBeenCalledWith(shortCode);
  });
});
