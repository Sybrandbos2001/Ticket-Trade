import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../../services/artist/artist.service';
import { SweetalertService } from '../../../services/sweetalert/sweetalert.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateArtistDto } from '../../../services/artist/dto/create-artist.dto';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { IGenre } from '@ticket-trade/domain';
import { GenreService } from '../../../services/genre/genre.service';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-artist-create',
  standalone: true,
  imports: [
    NavbarComponent, 
    FooterComponent, 
    ReactiveFormsModule, 
    MatCardModule,       
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,
    MatOption,
    CommonModule,
    RouterModule,
    MatSelectModule
  ],
  templateUrl: './artist-create.component.html',
  styleUrl: './artist-create.component.css',
})
export class ArtistCreateComponent implements OnInit {

  artistForm: FormGroup;
  genres: IGenre[] = [];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private sweetAlertService: SweetalertService,
    private router: Router,
    private genreService: GenreService,
  ) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required], 
      description: ['', Validators.required], 
      genreId: ['', Validators.required], 
    });
  }

  ngOnInit(): void {
    this.getGenres();
  }

  onSubmit(): void {
    if (this.artistForm.valid) {
      const artistData: CreateArtistDto = {
        name: this.artistForm.get('name')?.value,
        description: this.artistForm.get('description')?.value,
        genreId: this.artistForm.get('genreId')?.value,
      };

      this.artistService.createArtist(artistData).subscribe({
        next: () => {
          this.sweetAlertService.success(
            'De artiest is succesvol aangemaakt!',
            'Succes!'
          );
          this.artistForm.reset();
          this.router.navigate(['/artiesten']); 
        },
        error: (err) => {
          console.error('Fout bij aanmaken van artiest:', err);
          this.sweetAlertService.error(
            'Er is iets misgegaan. Probeer het opnieuw.',
            'Fout!'
          );
        },
      });
    }
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
