import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { getModelToken } from '@nestjs/mongoose';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test User' }]),
    create: jest.fn().mockResolvedValue({ id: '2', name: 'New User' }),
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
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: getModelToken('User'), useValue: {} }, // Mock voor UserModel
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(AuthGuard) // Override de guard met de mock
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it.todo("toDo");
});
