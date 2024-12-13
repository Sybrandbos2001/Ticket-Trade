import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockHeaders = { Authorization: 'Bearer mock-token' };
  const mockTickets = [
    {
      _id: '1',
      concert: {
        name: 'Concert 1',
        price: 50,
        startDateAndTime: '2023-12-25T20:00:00Z',
        endDateAndTime: '2023-12-25T22:00:00Z',
        amountTickets: 100,
        artist: {
          name: 'Artist 1',
          description: 'Description 1',
          genre: { name: 'Rock' },
        },
        location: {
          name: 'Venue 1',
          street: 'Main Street',
          houseNumber: 1,
          postalcode: '12345',
          country: 'Country',
          city: 'City',
        },
      },
      userId: 'user1',
      used: false,
      purchaseDateAndTime: '2023-12-01T10:00:00Z',
    },
  ];

  beforeEach(() => {
    const authServiceSpy = {
      getHeaders: jest.fn().mockReturnValue(mockHeaders),
      loggedIn$: jest.fn(),
      register: jest.fn(),
      login: jest.fn(),
      isAuthenticated: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TicketService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#buyTicket', () => {
    it('should send a ticket purchase request', () => {
      const concertId = '123';

      service.buyTicket(concertId).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/ticket`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ concertId });
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush({ success: true });
    });
  });

  describe('#getTickets', () => {
    it('should fetch a list of tickets and map the response', () => {
      service.getTickets().subscribe((tickets) => {
        expect(tickets.length).toBe(1);
        expect(tickets[0].concert?.name).toBe('Concert 1');
        expect(tickets[0].concert?.location?.name).toBe('Venue 1');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/ticket`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockTickets);
    });
  });

  describe('#getTicket', () => {
    it('should fetch a single ticket and map the response', () => {
      const ticketId = '1';

      service.getTicket(ticketId).subscribe((ticket) => {
        expect(ticket.concert?.name).toBe('Concert 1');
        expect(ticket.concert?.location?.name).toBe('Venue 1');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/ticket/id/${ticketId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockTickets[0]);
    });
  });
});
