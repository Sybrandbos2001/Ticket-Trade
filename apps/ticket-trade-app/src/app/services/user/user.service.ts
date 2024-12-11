import { Injectable } from '@angular/core';
import { IAccount } from '@ticket-trade/domain';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAccount(): Observable<IAccount> {
    const headers = this.authService.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/user/account`, { headers }).pipe(
      map((item) => ({
        name: item.name,
        lastname: item.lastname,
        username: item.username,
        phone: item.phone,
        email: item.email,
      }))
    );
  }
}
