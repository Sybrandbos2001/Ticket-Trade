import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TicketService } from '../ticket/ticket.service';

describe('TicketService', () => {
  let service: TicketService;

  const mockTicketModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    // Voeg andere methoden toe die je in je service gebruikt
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
