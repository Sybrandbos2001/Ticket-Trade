import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { IConcert, IConcertRecommendation } from '@ticket-trade/domain'; 
import { ConcertService } from '../../services/concert/concert.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-concert',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './concert.component.html',
  styleUrl: './concert.component.css'
})
export class ConcertComponent implements OnInit {

  concerts: IConcert[] = [];
  concertRecommendations: IConcertRecommendation[] = [];

  constructor(private concertService: ConcertService) { }

  ngOnInit(): void {
    this.getConcerts();
    this.getConcertRecommendations();
  }

  getConcerts(): void {
    this.concertService.getConcerts().subscribe({
      next: (data) => {
        this.concerts = data;
      },
      error: (err) => {
        console.error('Error loading concerts:', err);
      },
    });
  }

  getConcertRecommendations(): void {
    this.concertService.getConcertRecommendations().subscribe({
      next: (data) => {
        this.concertRecommendations = data;
      },
      error: (err) => {
        console.error('Error loading recommendations:', err);
      },
    });
  }
}
