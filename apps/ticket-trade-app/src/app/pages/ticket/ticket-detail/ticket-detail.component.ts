import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ITicket } from '@ticket-trade/domain';
import { TicketService } from '../../../services/ticket/ticket.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css',
})
export class TicketDetailComponent implements OnInit {
  ticket: ITicket = {
    id: '',
    concert: {
      id: '',
      name: '',
      price: 0,
      startDateAndTime: new Date(),
      endDateAndTime: new Date(),
      amountTickets: 0,
      artist: {
        id: '',
        name: '',
        description: '',
        genre: {
          name: '',
          id: '',
        },
      },
      location: {
        id: '',
        name: '',
        street: '',
        houseNumber: '',
        postalcode: '',
        country: '',
        city: '',
      },
    },
    userId: '',
    used: false,
    purchaseDateAndTime: new Date(),
  };
  errorMessage: string | null = null;
  ticketNotFound = false;


  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
  ) {}

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.getTicket(ticketId);
    } else {
      console.error('Ticket ID is null');
    }
  }

  getTicket(ticketId: string): void {
    this.ticketService.getTicket(ticketId).subscribe({
      next: (data) => {
        this.ticket = data;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.ticketNotFound = true;
          this.errorMessage = 'Ticket niet gevonden.';
        } else {
          this.errorMessage = 'Er is een fout opgetreden.';
        }
      },
    });
  }
}
