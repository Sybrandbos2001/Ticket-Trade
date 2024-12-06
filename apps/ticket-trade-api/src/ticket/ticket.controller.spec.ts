import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('TicketController', () => {
  let controller: TicketController;

  const mockTicketService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Ticket' }]),
    create: jest.fn().mockResolvedValue({ id: '2', name: 'New Ticket' }),
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
      controllers: [TicketController],
      providers: [
        { provide: TicketService, useValue: mockTicketService },
        { provide: getModelToken('Ticket'), useValue: {} }, // Mock TicketModel
        { provide: getModelToken('Concert'), useValue: {} }, // Mock ConcertModel
        { provide: getModelToken('User'), useValue: {} }, // Mock UserModel
        { provide: JwtService, useValue: mockJwtService }, // Mock JwtService
      ],
    })
      .overrideGuard(AuthGuard) // Override de echte guard
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TicketController>(TicketController);
  });

  it.todo("toDo");
});
