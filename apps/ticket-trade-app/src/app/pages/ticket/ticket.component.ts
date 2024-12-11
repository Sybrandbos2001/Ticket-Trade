import { Component, OnInit } from '@angular/core';
import { ITicket } from '@ticket-trade/domain';
import { TicketService } from '../../services/ticket/ticket.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {
  tickets: ITicket[] = [];

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets(): void {
    const jwtToken = this.authService.getToken(); 

    if (!jwtToken) {
      console.error('Geen geldige gebruiker ingelogd.');
      return;
    }
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => {
        console.error('Error loading tickets:', err);
      },
    });
  }
}
