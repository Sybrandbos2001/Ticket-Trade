import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IConcert, IConcertRecommendation } from '@ticket-trade/domain';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CreateConcertDto } from './dto/create-concert.dto';


@Injectable({
  providedIn: 'root'
})
export class ConcertService {
  private baseUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getConcerts(): Observable<IConcert[]> {
    return this.http.get<any[]>(`${this.baseUrl}/concert`).pipe(
      map((data) => {
        return data.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          startDateAndTime: new Date(item.startDateAndTime),
          endDateAndTime: new Date(item.endDateAndTime),
          amountTickets: item.amountTickets,
          location: item.location ? {
            name: item.location.name,
            street: item.location.street,
            houseNumber: item.location.houseNumber,
            postalcode: item.location.postalcode,
            country: item.location.country,
            city: item.location.city,
          } : undefined,
          locationId: item.location?._id,
          artist: item.artist ? {
            name: item.artist.name,
            description: item.artist.description,
            genre: item.artist.genre?.name,
          } : undefined,
          artistId: item.artist?._id,
        }));
      })
    );
  }

  getConcert(concertId: string): Observable<IConcert> {
    return this.http.get<any>(`${this.baseUrl}/concert/id/${concertId}`).pipe(
      map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        startDateAndTime: new Date(item.startDateAndTime),
        endDateAndTime: new Date(item.endDateAndTime),
        amountTickets: item.amountTickets,
        location: item.location ? {
          name: item.location.name,
          street: item.location.street,
          houseNumber: item.location.houseNumber,
          postalcode: item.location.postalcode,
          country: item.location.country,
          city: item.location.city,
        } : undefined,
        locationId: item.location?._id,
        artist: item.artist ? {
          name: item.artist.name,
          description: item.artist.description,
          genre: item.artist.genre?.name,
        } : undefined,
        artistId: item.artist?._id,
      }))
    );
  }

  getConcertRecommendations(): Observable<IConcertRecommendation[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/concert/recommendation`, { headers }).pipe(
      map((data) => {
        return data.map((item) => ({
          recommendedConcertId: item.recommendedConcertId,
          concertName: item.concertName, 
          attendingFriendsCount: item.attendingFriendsCount, 
          attendingFriends: item.attendingFriends, 
        }));
      })
    );
  }

  createConcert(createConcert: CreateConcertDto): Observable<IConcert> {
    const headers = this.authService.getHeaders();
    return this.http.post<IConcert>(`${this.baseUrl}/concert`, createConcert, { headers });
  }
}
