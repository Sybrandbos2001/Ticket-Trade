import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ArtistService', () => {
  let service: ArtistService;

  const mockArtistModel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        { provide: getModelToken('Artist'), useValue: mockArtistModel },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
  });

  it.todo("toDo");
});
