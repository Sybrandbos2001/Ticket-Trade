import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { ITicket } from '@ticket-trade/domain';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  buyTicket(concertId: string): Observable<any> {
    const headers = this.authService.getHeaders();

    const body = { concertId };

    return this.http.post(`${this.baseUrl}/ticket`, body, { headers });
  }

  getTickets(): Observable<ITicket[]> {
    const headers = this.authService.getHeaders();

    return this.http.get<any[]>(`${this.baseUrl}/ticket`, { headers }).pipe(
      map((data) => {
        return data.map((item) => ({
          id: item._id,
          concert: {
            name: item.concert.name,
            price: item.concert.price,
            startDateAndTime: new Date(item.concert.startDateAndTime),
            endDateAndTime: new Date(item.concert.endDateAndTime),
            amountTickets: item.concert.amountTickets,
            artist: item.concert.artist
              ? {
                  name: item.concert.artist.name,
                  description: item.concert.artist.description,
                  genre: item.concert.artist.genre?.name,
                }
              : undefined,
            location: item.concert.location
              ? {
                  name: item.concert.location.name,
                  street: item.concert.location.street,
                  houseNumber: item.concert.location.houseNumber,
                  postalcode: item.concert.location.postalcode,
                  country: item.concert.location.country,
                  city: item.concert.location.city,
                }
              : undefined,
          },
          userId: item.userId,
          used: item.used,
          purchaseDateAndTime: new Date(item.purchaseDateAndTime),
        }));
      })
    );
  }

  getTicket(ticketId: string): Observable<ITicket> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<any>(`${this.baseUrl}/ticket/id/${ticketId}`, { headers })
      .pipe(
        map((item) => ({
          id: item._id,
          concert: {
            name: item.concert.name,
            price: item.concert.price,
            startDateAndTime: new Date(item.concert.startDateAndTime),
            endDateAndTime: new Date(item.concert.endDateAndTime),
            amountTickets: item.concert.amountTickets,
            artist: item.concert.artist
              ? {
                  name: item.concert.artist.name,
                  description: item.concert.artist.description,
                  genre: item.concert.artist.genre?.name,
                }
              : undefined,
            location: item.concert.location
              ? {
                  name: item.concert.location.name,
                  street: item.concert.location.street,
                  houseNumber: item.concert.location.houseNumber,
                  postalcode: item.concert.location.postalcode,
                  country: item.concert.location.country,
                  city: item.concert.location.city,
                }
              : undefined,
          },
          userId: item.userId,
          used: item.used,
          purchaseDateAndTime: new Date(item.purchaseDateAndTime),
        }))
      );
  }
}
