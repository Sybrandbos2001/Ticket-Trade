import { Test, TestingModule } from '@nestjs/testing';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('ArtistController', () => {
  let controller: ArtistController;

  const mockArtistService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Artist' }]),
    create: jest.fn().mockResolvedValue({ id: '2', name: 'New Artist' }),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ userId: '123' }),
    sign: jest.fn().mockReturnValue('mockedJwtToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [
        { provide: ArtistService, useValue: mockArtistService },
        { provide: getModelToken('Artist'), useValue: {} }, // Mock voor ArtistModel
        { provide: JwtService, useValue: mockJwtService }, // Mock voor JwtService
      ],
    })
      .overrideGuard(AuthGuard) // Override de AuthGuard met de mock
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ArtistController>(ArtistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
