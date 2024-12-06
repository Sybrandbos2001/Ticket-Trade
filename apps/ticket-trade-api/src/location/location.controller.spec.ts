import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('LocationController', () => {
  let controller: LocationController;

  const mockLocationService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Location' }]),
    create: jest.fn().mockResolvedValue({ id: '2', name: 'New Location' }),
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
      controllers: [LocationController],
      providers: [
        { provide: LocationService, useValue: mockLocationService },
        { provide: getModelToken('Location'), useValue: {} }, // Mock voor LocationModel
        { provide: JwtService, useValue: mockJwtService }, // Mock voor JwtService
      ],
    })
      .overrideGuard(AuthGuard) // Override de guard met een mock
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<LocationController>(LocationController);
  });

  it.todo("toDo");
});
