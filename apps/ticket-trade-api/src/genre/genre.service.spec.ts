import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { getModelToken } from '@nestjs/mongoose';

describe('GenreService', () => {
  let service: GenreService;

  const mockGenreModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([{ name: 'Rock', description: 'Rock genre' }]),
    }),
    create: jest.fn().mockResolvedValue({ name: 'Pop', description: 'Pop genre' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        { provide: getModelToken('Genre'), useValue: mockGenreModel },
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
