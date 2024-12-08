import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getModelToken } from '@nestjs/mongoose';

describe('TicketService', () => {
  let service: TicketService;

  const mockTicketModel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  const mockConcertModel = {};
  const mockUserModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: getModelToken('Ticket'), useValue: mockTicketModel },
        { provide: getModelToken('Concert'), useValue: mockConcertModel },
        { provide: getModelToken('User'), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it.todo("toDo");
});
