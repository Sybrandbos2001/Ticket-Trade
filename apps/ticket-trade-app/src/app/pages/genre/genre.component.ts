import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';
import { GenreService } from '../../services/genre/genre.service';
import { IGenre } from '@ticket-trade/domain';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.css',
})
export class GenreComponent implements OnInit {

  genres: IGenre[] = [];

  constructor(
    private genreService: GenreService,
  ) { }

  ngOnInit(): void {
    this.getGenres();
  }
  
  getGenres(): void {
    this.genreService.getGenres().subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: (err) => {
        console.error('Error loading genres:', err);
      },
    });
  }
}
