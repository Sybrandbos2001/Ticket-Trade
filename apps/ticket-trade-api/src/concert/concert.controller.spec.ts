import { Test, TestingModule } from '@nestjs/testing';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('ConcertController', () => {
  let controller: ConcertController;

  const mockConcertService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Concert' }]),
    create: jest.fn().mockResolvedValue({ id: '2', name: 'New Concert' }),
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
      controllers: [ConcertController],
      providers: [
        { provide: ConcertService, useValue: mockConcertService },
        { provide: getModelToken('Concert'), useValue: {} },
        { provide: getModelToken('Artist'), useValue: {} },
        { provide: getModelToken('Location'), useValue: {} },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(AuthGuard) // Override de echte guard met een mock
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ConcertController>(ConcertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
