import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { CreateLocationDto } from './dto/create-location.dto';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockHeaders = { Authorization: 'Bearer mock-token' };
  const mockLocations = [
    {
      _id: '1',
      street: 'Main Street',
      houseNumber: 123,
      postalcode: '12345',
      country: 'Country',
      name: 'Location 1',
      city: 'City 1'
    },
    {
      _id: '2',
      street: 'Second Street',
      houseNumber: 456,
      postalcode: '67890',
      country: 'Country',
      name: 'Location 2',
      city: 'City 2'
    }
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
        LocationService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getLocations', () => {
    it('should fetch a list of locations and map the response', () => {
      service.getLocations().subscribe((locations) => {
        expect(locations.length).toBe(2);
        expect(locations[0].name).toBe('Location 1');
        expect(locations[1].name).toBe('Location 2');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/location`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockLocations);
    });
  });

  describe('#createLocation', () => {
    it('should create a location and return the created location', () => {
      const createLocationDto: CreateLocationDto = {
        street: 'New Street',
        houseNumber: '789',
        postalcode: '54321',
        country: 'New Country',
        name: 'New Location',
        city: 'New City'
      };

      const createdLocation = {
        id: '3',
        street: 'New Street',
        houseNumber: 789,
        postalcode: '54321',
        country: 'New Country',
        name: 'New Location',
        city: 'New City'
      };

      service.createLocation(createLocationDto).subscribe((location) => {
        expect(location.name).toBe('New Location');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/location`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createLocationDto);
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(createdLocation);
    });
  });
});
