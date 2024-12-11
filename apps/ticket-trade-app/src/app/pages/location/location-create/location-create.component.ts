import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { LocationService } from '../../../services/location/location.service';
import { SweetalertService } from '../../../services/sweetalert/sweetalert.service';
import { CreateLocationDto } from '../../../services/location/dto/create-location.dto';

@Component({
  selector: 'app-location-create',
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
    RouterModule
  ],
  templateUrl: './location-create.component.html',
  styleUrl: './location-create.component.css',
})
export class LocationCreateComponent {
  locationForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private sweetAlertService: SweetalertService,
    private router: Router
  ) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      postalcode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      const locationData: CreateLocationDto = {
        name: this.locationForm.get('name')?.value,
        street: this.locationForm.get('street')?.value,
        houseNumber: this.locationForm.get('houseNumber')?.value,
        postalcode: this.locationForm.get('postalcode')?.value,
        city: this.locationForm.get('city')?.value,
        country: this.locationForm.get('country')?.value,
      };

      this.locationService.createLocation(locationData).subscribe({
        next: () => {
          this.sweetAlertService.success(
            'Locatie is succesvol aangemaakt!',
            'Succes!'
          );
          this.router.navigate(['/locaties']); 
        },
        error: (err) => {
          console.error('Fout bij aanmaken van locatie:', err);
          this.sweetAlertService.error(
            'Er is iets misgegaan. Probeer het opnieuw.',
            'Fout!'
          );
        },
      });
    }
  }
}
