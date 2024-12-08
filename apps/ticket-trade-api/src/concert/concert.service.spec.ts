import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ConcertService', () => {
  let service: ConcertService;

  const mockConcertModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        { provide: getModelToken('Concert'), useValue: mockConcertModel },
        { provide: getModelToken('Artist'), useValue: {} }, // Mock voor ArtistModel
        { provide: getModelToken('Location'), useValue: {} }, // Mock voor LocationModel
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
  });

  it.todo("toDo");
});
