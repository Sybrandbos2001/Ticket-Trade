import { Injectable } from '@angular/core';
import { IGenre } from '@ticket-trade/domain';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  getGenres(): Observable<IGenre[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/genre`, {headers}).pipe(
      map((data) => {
        return data.map((item) => ({
          id: item._id,
          name: item.name,
        }));
      })
    );
  }

  createGenre(createGenre: CreateGenreDto): Observable<IGenre> {
    const headers = this.authService.getHeaders();
    return this.http.post<IGenre>(`${this.baseUrl}/genre`, createGenre, { headers });
  }
}
