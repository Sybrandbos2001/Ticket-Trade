import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // Valid JWT with structure: header.payload.signature
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const mockHeaders = { Authorization: `Bearer ${mockToken}` };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#register', () => {
    it('should register a user', () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        name: 'Test',
        lastname: 'User',
        phone: '0612345678'

      };

      service.register(registerDto).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerDto);
      req.flush({ success: true });
    });
  });

  describe('#login', () => {
    it('should login a user and store the token', () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginDto).subscribe((response) => {
        expect(response.jwt_token).toBe(mockToken);
        expect(localStorage.getItem('access_token')).toBe(mockToken);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginDto);
      req.flush({ jwt_token: mockToken });
    });
  });

  describe('#isAuthenticated', () => {
    it('should return true if token is valid', async () => {
      jest.spyOn(service['jwtHelper'], 'isTokenExpired').mockResolvedValue(false);
      localStorage.setItem('access_token', mockToken);
      const result = service.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return false if no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false if token is expired', async () => {
      jest.spyOn(service['jwtHelper'], 'isTokenExpired').mockResolvedValue(true);
      localStorage.setItem('access_token', mockToken);
      const result = service.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('#logout', () => {
    it('should clear the token and navigate to home', () => {
      const router = TestBed.inject(Router);
      const routerSpy = jest.spyOn(router, 'navigate');
      localStorage.setItem('access_token', mockToken);

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });
  });

  describe('#changePassword', () => {
    it('should send a change password request', () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123'
      };

      service.changePassword(changePasswordDto).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/password`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(changePasswordDto);
      expect(req.request.headers.get('Authorization')).toBe('Bearer null');
      req.flush({ success: true });
    });
  });

  describe('#getTokenPayload', () => {
    it('should decode the token payload', () => {
      const mockPayload = { sub: '123', email: 'test@example.com' };
      jest.spyOn(service, 'getToken').mockReturnValue(mockToken);
      jest.spyOn(service['jwtHelper'], 'decodeToken').mockReturnValue(mockPayload);

      const payload = service.getTokenPayload();
      expect(payload).toBeNull();
    });

    it('should return null if no token exists', () => {
      jest.spyOn(service, 'getToken').mockReturnValue(null);
      const payload = service.getTokenPayload();
      expect(payload).toBeNull();
    });
  });

  describe('#getHeaders', () => {
    it('should return headers with Authorization token', () => {
      jest.spyOn(service, 'getToken').mockReturnValue(mockToken);

      const headers = service.getHeaders();
      expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(headers.get('Content-Type')).toBe('application/json');
    });
  });
});
