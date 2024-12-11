import { Component, OnInit } from '@angular/core';
import { IArtist } from '@ticket-trade/domain';
import { ArtistService } from '../../services/artist/artist.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent implements OnInit {
  
  artists: IArtist[] = [];
  
  constructor(
    private artistService: ArtistService,
  ) { }

  ngOnInit(): void {
    this.getArtists();
  }

  getArtists(): void {
    this.artistService.getArtists().subscribe({
      next: (data) => {
        this.artists = data;
      },
      error: (err) => {
        console.error('Error loading artists:', err);
      },
    });
  }
}
