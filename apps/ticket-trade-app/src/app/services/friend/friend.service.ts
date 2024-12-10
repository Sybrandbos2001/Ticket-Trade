import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { IProfile } from '@ticket-trade/domain';
import { map, Observable } from 'rxjs';
import { IFriendRecommendation } from '@ticket-trade/domain';


@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getFriends(): Observable<IProfile[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/friends`, { headers }).pipe(
      map((data) => {
        return data.map((item) => ({
          name: item.name,
          lastname: item.lastname, 
          username: item.username, 
          following: item.following, 
        }));
      })
    );
  }

  getRecommendations(): Observable<IFriendRecommendation[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/friends/recommendation`, { headers }).pipe(
      map((data) => {
        return data.map((item) => ({
          recommendedUserId: item.recommendedUserId,
          recommendedUsername: item.recommendedUsername, 
          mutualFriendCount: item.mutualFriendCount, 
          mutualFriends: item.mutualFriends, 
        }));
      })
    );
  }

  followUser(userName: string): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.post<void>(`${this.baseUrl}/friends/follow/${userName}`, {}, { headers });
  }

  unfollowUser(userName: string): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.post<void>(`${this.baseUrl}/friends/unfollow/${userName}`, {}, { headers });
  }
}
