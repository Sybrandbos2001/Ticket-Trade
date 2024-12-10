import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';



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
    console.log('Registering user:', user);
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: LoginDto) {
    return this.http.post<{ jwt_token: string }>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        catchError(this.handleError)
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

  getTokenPayload(): any | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Invalid token', error);
        return null;
      }
    }
    return null;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Er is een fout opgetreden';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'De gevraagde gegevens konden niet worden gevonden.';
    } else if (error.status === 500) {
      errorMessage = 'Interne serverfout, probeer het later opnieuw.';
    }
    console.error('Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
