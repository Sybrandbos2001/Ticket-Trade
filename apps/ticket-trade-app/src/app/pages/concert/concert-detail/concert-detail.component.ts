import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { IConcert } from '@ticket-trade/domain';
import { ConcertService } from '../../../services/concert/concert.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService } from '../../../services/ticket/ticket.service';
import { SweetalertService } from '../../../services/sweetalert/sweetalert.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  errorMessage: string | null = null;
  concertNotFound = false;

  constructor(
    private concertService: ConcertService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private ticketService: TicketService,
    private sweetAlertService: SweetalertService,
    private router: Router
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

  getConcert(concertId: string): void {
    this.concertService.getConcert(concertId).subscribe({
      next: (data) => {
        this.concert = data;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.concertNotFound = true;
          this.errorMessage = 'Concert niet gevonden.';
        } else {
          this.errorMessage = 'Er is een fout opgetreden.';
        }
      },
    });
  }

  buyTicket(): void {
    if (!this.concert.id) {
      console.error('Geen geldige concert gekozen.');
      return;
    }

    this.ticketService.buyTicket(this.concert.id).subscribe({
      next: () => {
        this.sweetAlertService.success(
          'Je wordt doorgestuurd naar je ticketoverzicht.',
          'Aankoop succesvol!'
        );
        this.router.navigate(['/tickets']);
      },
      error: (error: Error) => {
        this.sweetAlertService.error(
          'Controleer je invoer.',
          'Aankoop mislukt!'
        );
      },
    });
  }
}
