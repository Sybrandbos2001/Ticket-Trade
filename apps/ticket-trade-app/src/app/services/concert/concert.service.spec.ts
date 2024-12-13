import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConcertService } from './concert.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { CreateConcertDto } from './dto/create-concert.dto';


describe('ConcertService', () => {
  let service: ConcertService;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockHeaders = { Authorization: 'Bearer mock-token' };
  const mockConcerts = [
    {
      _id: '1',
      name: 'Concert 1',
      price: 50,
      startDateAndTime: '2023-12-25T20:00:00Z',
      endDateAndTime: '2023-12-25T22:00:00Z',
      amountTickets: 100,
      location: {
        name: 'Venue 1',
        street: 'Main Street',
        houseNumber: 1,
        postalcode: '12345',
        country: 'Country',
        city: 'City'
      },
      artist: {
        name: 'Artist 1',
        description: 'Description 1',
        genre: { name: 'Rock' }
      }
    },
  ];

  beforeEach(() => {
    const authServiceSpy = {
      getHeaders: jest.fn().mockReturnValue(mockHeaders),
      loggedIn$: jest.fn(),
      register: jest.fn(),
      login: jest.fn(),
      isAuthenticated: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConcertService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ConcertService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getConcerts', () => {
    it('should fetch a list of concerts and map the response', () => {
      service.getConcerts().subscribe((concerts) => {
        expect(concerts.length).toBe(1);
        expect(concerts[0].name).toBe('Concert 1');
        expect(concerts[0].location?.name).toBe('Venue 1');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/concert`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConcerts);
    });
  });

  describe('#getConcert', () => {
    it('should fetch a single concert and map the response', () => {
      const concertId = '1';

      service.getConcert(concertId).subscribe((concert) => {
        expect(concert.name).toBe('Concert 1');
        expect(concert.location?.name).toBe('Venue 1');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/concert/id/${concertId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConcerts[0]);
    });
  });

  describe('#getConcertRecommendations', () => {
    it('should fetch concert recommendations and map the response', () => {
      const mockRecommendations = [
        {
          recommendedConcertId: '2',
          concertName: 'Concert 2',
          attendingFriendsCount: 5,
          attendingFriends: ['Friend 1', 'Friend 2']
        }
      ];

      service.getConcertRecommendations().subscribe((recommendations) => {
        expect(recommendations.length).toBe(1);
        expect(recommendations[0].concertName).toBe('Concert 2');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/concert/recommendation`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockRecommendations);
    });
  });

  describe('#createConcert', () => {
    it('should create a concert and return the created concert', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'New Concert',
        price: 75,
        startDateAndTime: new Date('2024-01-01T18:00:00Z'),
        endDateAndTime: new Date('2024-01-01T21:00:00Z'),
        amountTickets: 200,
        locationId: '123',
        artistId: '456'
      };

      const createdConcert = {
        id: '3',
        name: 'New Concert',
        price: 75,
        startDateAndTime: new Date('2024-01-01T18:00:00Z'),
        endDateAndTime: new Date('2024-01-01T21:00:00Z'),
        amountTickets: 200,
        locationId: '123',
        artistId: '456'
      };

      service.createConcert(createConcertDto).subscribe((concert) => {
        expect(concert.name).toBe('New Concert');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/concert`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createConcertDto);
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(createdConcert);
    });
  });
});
