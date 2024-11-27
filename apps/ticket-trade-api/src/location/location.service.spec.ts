import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { getModelToken } from '@nestjs/mongoose';

describe('LocationService', () => {
  let service: LocationService;

  const mockLocationModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    // Voeg andere methoden toe die je in de service gebruikt
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: getModelToken('Location'), useValue: mockLocationModel },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
