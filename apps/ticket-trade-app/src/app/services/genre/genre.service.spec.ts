import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GenreService } from './genre.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { CreateGenreDto } from './dto/create-genre.dto';

describe('GenreService', () => {
  let service: GenreService;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockHeaders = { Authorization: 'Bearer mock-token' };
  const mockGenres = [
    {
      _id: '1',
      name: 'Rock'
    },
    {
      _id: '2',
      name: 'Jazz'
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
        GenreService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(GenreService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getGenres', () => {
    it('should fetch a list of genres and map the response', () => {
      service.getGenres().subscribe((genres) => {
        expect(genres.length).toBe(2);
        expect(genres[0].name).toBe('Rock');
        expect(genres[1].name).toBe('Jazz');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/genre`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockGenres);
    });
  });

  describe('#createGenre', () => {
    it('should create a genre and return the created genre', () => {
      const createGenreDto: CreateGenreDto = {
        name: 'Classical'
      };

      const createdGenre = {
        id: '3',
        name: 'Classical'
      };

      service.createGenre(createGenreDto).subscribe((genre) => {
        expect(genre.name).toBe('Classical');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/genre`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createGenreDto);
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(createdGenre);
    });
  });
});
