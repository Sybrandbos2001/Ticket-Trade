import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  // Mock UserService
  const mockUserService = {
    findAll: jest.fn().mockResolvedValue([]), 
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    const result = await controller.findAll(); 
    expect(result).toEqual([]);
    expect(mockUserService.findAll).toHaveBeenCalled();
  });
});
