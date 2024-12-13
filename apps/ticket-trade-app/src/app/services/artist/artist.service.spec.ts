import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArtistService } from './artist.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { IArtist } from '@ticket-trade/domain';
import { CreateArtistDto } from './dto/create-artist.dto';
import { of } from 'rxjs';

describe('ArtistService', () => {
  let service: ArtistService;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthService>;

  const mockHeaders = { Authorization: 'Bearer token' };
  const mockArtists = [
    {
      _id: '1',
      name: 'Artist 1',
      description: 'Description 1',
      genre: { name: 'Rock' }
    },
    {
      _id: '2',
      name: 'Artist 2',
      description: 'Description 2',
      genre: null
    }
  ];

  beforeEach(() => {
    authServiceMock = {
      getHeaders: jest.fn().mockReturnValue(mockHeaders),
      loggedIn$: of(true),
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn().mockReturnValue(true),
      getToken: jest.fn().mockReturnValue('mock-token')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ArtistService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(ArtistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getArtists', () => {
    it('should fetch a list of artists and map the response', () => {
      service.getArtists().subscribe((artists) => {
        expect(artists.length).toBe(2);
        expect(artists[0]).toEqual({
          id: '1',
          name: 'Artist 1',
          description: 'Description 1',
          genre: { name: 'Rock' }
        });
        expect(artists[1]).toEqual({
          id: '2',
          name: 'Artist 2',
          description: 'Description 2',
          genre: undefined
        });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/artist`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockArtists);
    });
  });

  describe('#createArtist', () => {
    it('should create an artist and return the created artist', () => {
      const newArtist: CreateArtistDto = {
        name: 'New Artist',
        description: 'New Description',
        genreId: '123'
      };

      const createdArtist: IArtist = {
        id: '3',
        name: 'New Artist',
        description: 'New Description',
        genre: { name: 'Pop' }
      };

      service.createArtist(newArtist).subscribe((artist) => {
        expect(artist).toEqual(createdArtist);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/artist`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(createdArtist);
    });
  });
});