import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('GenreController', () => {
  let controller: GenreController;

  const mockGenreService = {
    findAll: jest.fn().mockResolvedValue([{ name: 'Rock', description: 'Rock genre' }]),
    create: jest.fn().mockResolvedValue({ name: 'Pop', description: 'Pop genre' }),
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
      controllers: [GenreController],
      providers: [
        { provide: GenreService, useValue: mockGenreService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(AuthGuard) // Override de echte guard met de mock
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<GenreController>(GenreController);
  });

  it.todo("toDo");
});
