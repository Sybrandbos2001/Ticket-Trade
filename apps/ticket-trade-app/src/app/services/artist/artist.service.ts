import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, Observable } from 'rxjs';
import { IArtist } from '@ticket-trade/domain';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  getArtists(): Observable<IArtist[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/artist`, {headers}).pipe(
      map((data) => {
        return data.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          genre: item.genre ? {
            name: item.genre.name,
          } : undefined,
        }));
      })
    );
  }

  createArtist(createArtist: CreateArtistDto): Observable<IArtist> {
    const headers = this.authService.getHeaders();
    return this.http.post<IArtist>(`${this.baseUrl}/artist`, createArtist, { headers });
  }
}
