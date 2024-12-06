import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:3000/api/auth';
  private jwtHelper = new JwtHelperService();
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ jwt_token: string }>(`${this.baseUrl}/login`, credentials).pipe(
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
