import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockHeaders = { Authorization: 'Bearer mock-token' };
  const mockAccount = {
    name: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
  };

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
        UserService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAccount', () => {
    it('should fetch account details and map the response', () => {
      service.getAccount().subscribe((account) => {
        expect(account.name).toBe('John');
        expect(account.lastname).toBe('Doe');
        expect(account.username).toBe('johndoe');
        expect(account.phone).toBe('123-456-7890');
        expect(account.email).toBe('john.doe@example.com');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/account`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockAccount);
    });
  });
});