import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FriendService } from './friend.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

describe('FriendService', () => {
  let service: FriendService;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockHeaders = { Authorization: 'Bearer mock-token' };
  const mockProfiles = [
    {
      name: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      following: true
    },
  ];

  const mockRecommendations = [
    {
      recommendedUserId: '2',
      recommendedUsername: 'janedoe',
      mutualFriendCount: 3,
      mutualFriends: ['Alice', 'Bob', 'Charlie']
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
        FriendService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(FriendService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getFriends', () => {
    it('should fetch a list of friends and map the response', () => {
      service.getFriends().subscribe((friends) => {
        expect(friends.length).toBe(1);
        expect(friends[0].username).toBe('johndoe');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/friends`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockProfiles);
    });
  });

  describe('#getRecommendations', () => {
    it('should fetch friend recommendations and map the response', () => {
      service.getRecommendations().subscribe((recommendations) => {
        expect(recommendations.length).toBe(1);
        expect(recommendations[0].recommendedUsername).toBe('janedoe');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/friends/recommendation`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockRecommendations);
    });
  });

  describe('#searchProfiles', () => {
    it('should fetch profiles based on a search query and map the response', () => {
      const query = 'john';

      service.searchProfiles(query).subscribe((profiles) => {
        expect(profiles.length).toBe(1);
        expect(profiles[0].username).toBe('johndoe');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/profile/search/${query}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush(mockProfiles);
    });
  });

  describe('#followUser', () => {
    it('should send a follow request for a user', () => {
      const username = 'johndoe';

      service.followUser(username).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/friends/follow/${username}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush({});
    });
  });

  describe('#unfollowUser', () => {
    it('should send an unfollow request for a user', () => {
      const username = 'johndoe';

      service.unfollowUser(username).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/friends/unfollow/${username}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(mockHeaders.Authorization);
      req.flush({});
    });
  });
});