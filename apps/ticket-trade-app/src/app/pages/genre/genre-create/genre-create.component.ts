import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenreService } from '../../../services/genre/genre.service';
import { SweetalertService } from '../../../services/sweetalert/sweetalert.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreateGenreDto } from '../../../services/genre/dto/create-genre.dto';

@Component({
  selector: 'app-genre-create',
  standalone: true,
  imports: [
    NavbarComponent, 
    FooterComponent, 
    ReactiveFormsModule, 
    MatCardModule,       
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,
    CommonModule,
    RouterModule],
  templateUrl: './genre-create.component.html',
  styleUrl: './genre-create.component.css',
})
export class GenreCreateComponent {
  genreForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private genreService: GenreService,
    private sweetAlertService: SweetalertService,
    private router: Router
  ) {
    this.genreForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], 
    });
  }

  onSubmit(): void {
    if (this.genreForm.valid) {
      const genreData: CreateGenreDto = {
        name: this.genreForm.get('name')?.value,
      };

      this.genreService.createGenre(genreData).subscribe({
        next: () => {
          this.sweetAlertService.success(
            'Het genre is succesvol aangemaakt!',
            'Succes!'
          );
          this.router.navigate(['/genres']); 
        },
        error: (err) => {
          console.error('Fout bij aanmaken van genre:', err);
          this.sweetAlertService.error(
            'Er is iets misgegaan. Probeer het opnieuw.',
            'Fout!'
          );
        },
      });
    }
  }
}
