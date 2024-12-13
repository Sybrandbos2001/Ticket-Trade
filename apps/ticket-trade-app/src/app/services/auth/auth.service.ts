import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private jwtHelper = new JwtHelperService();
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(user: RegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: LoginDto) {
    return this.http.post<{ jwt_token: string }>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.jwt_token);
        this.loggedIn.next(true);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  changePassword(changePasswordDto: ChangePasswordDto): Observable<any> {
    const headers = this.getHeaders(); 
    return this.http.patch(`${this.baseUrl}/auth/password`, changePasswordDto, { headers });
  }
  

  getTokenPayload(): any | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getHeaders(): HttpHeaders {
    const jwtToken = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });
  }
}
