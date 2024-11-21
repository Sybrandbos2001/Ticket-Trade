import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;

  // Mock UserModel
  const mockUserModel = {
    find: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue([]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call find method of UserModel', async () => {
    await service.findAll();
    expect(mockUserModel.find).toHaveBeenCalled();
    expect(mockUserModel.find().select).toHaveBeenCalledWith('-password');
  });
});
