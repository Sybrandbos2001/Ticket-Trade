import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { SweetalertService } from '../../../services/sweetalert/sweetalert.service';
import { CreateConcertDto } from '../../../services/concert/dto/create-concert.dto';
import { ConcertService } from '../../../services/concert/concert.service';
import { ArtistService } from '../../../services/artist/artist.service';
import { LocationService } from '../../../services/location/location.service';
import { IArtist, ILocation } from '@ticket-trade/domain';
import { MatOption, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-concert-create',
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
  templateUrl: './concert-create.component.html',
  styleUrl: './concert-create.component.css',
})
export class ConcertCreateComponent implements OnInit {
  concertForm: FormGroup;
  artists: IArtist[] = [];
  locations: ILocation[] = [];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private concertService: ConcertService,
    private sweetAlertService: SweetalertService,
    private router: Router,
    private artistService: ArtistService,
    private locationService: LocationService
  ) {
    this.concertForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      startDateAndTime: ['', Validators.required],
      endDateAndTime: ['', Validators.required],
      amountTickets: ['', [Validators.required, Validators.min(1)]],
      locationId: ['', Validators.required],
      artistId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getLocations();
    this.getArtists();
  }

  onSubmit(): void {
    if (this.concertForm.valid) {
      const concertData: CreateConcertDto = {
        name: this.concertForm.get('name')?.value,
        price: this.concertForm.get('price')?.value,
        startDateAndTime: this.concertForm.get('startDateAndTime')?.value,
        endDateAndTime: this.concertForm.get('endDateAndTime')?.value,
        amountTickets: this.concertForm.get('amountTickets')?.value,
        locationId: this.concertForm.get('locationId')?.value,
        artistId: this.concertForm.get('artistId')?.value,
      };

      this.concertService.createConcert(concertData).subscribe({
        next: () => {
          this.sweetAlertService.success(
            'Locatie is succesvol aangemaakt!',
            'Succes!'
          );
          this.router.navigate(['/concerten']); 
        },
        error: (err) => {
          console.error('Fout bij aanmaken van concert:', err);
          this.sweetAlertService.error(
            'Er is iets misgegaan. Controleer je invoer.',
            'Fout!'
          );
        },
      });
    }
  }

  getLocations(): void {
    this.locationService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
      },
    });
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
