import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { IConcert } from '@ticket-trade/domain';
import { ConcertService } from '../../../services/concert/concert.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-concert-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './concert-detail.component.html',
  styleUrl: './concert-detail.component.css',
})
export class ConcertDetailComponent implements OnInit {
  
  isLoggedIn$: Observable<boolean>;
  concert: IConcert = {
  id: '',
  name: '',
  price: 0,
  startDateAndTime: new Date(),
  endDateAndTime: new Date(),
  amountTickets: 0,
  location: {
    name: '',
    street: '',
    houseNumber: '',
    postalcode: '',
    country: '',
    city: '',
  },
  locationId: '',
  artist: {
    name: '',
    description: '',
    genre: {
      name: '',
    },
  },
  artistId: '',
};


  constructor(
    private concertService: ConcertService,     
    private route: ActivatedRoute,
    private authService: AuthService
  ) { 
    this.isLoggedIn$ = this.authService.loggedIn$;
  }

  ngOnInit(): void {
    const concertId = this.route.snapshot.paramMap.get('id');
    if (concertId) {
      this.getConcert(concertId);
    } else {
      console.error('Concert ID is null');
    }
  }

  getConcert(concertId : string): void {
    this.concertService.getConcert(concertId).subscribe({
      next: (data) => {
        this.concert = data;
        console.log('Concerts loaded:', this.concert);
      },
      error: (err) => {
        console.error('Error loading concerts:', err);
      },
    });
  }
}
