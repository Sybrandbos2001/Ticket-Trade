import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map, Observable } from 'rxjs';
import { ILocation } from '@ticket-trade/domain';
import { environment } from '../../../environments/environment';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  getLocations(): Observable<ILocation[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/location`, {headers}).pipe(
      map((data) => {
        return data.map((item) => ({
          id: item._id,
          street: item.street,
          houseNumber: item.houseNumber,
          postalcode: item.postalcode,
          country: item.country,
          name: item.name,
          city: item.city,
        }));
      })
    );
  }

  createLocation(createLocation: CreateLocationDto): Observable<ILocation> {
    const headers = this.authService.getHeaders();
    return this.http.post<ILocation>(`${this.baseUrl}/location`, createLocation, { headers });
  }
}
