import { Component, OnInit } from '@angular/core';
import { ILocation } from '@ticket-trade/domain';
import { LocationService } from '../../services/location/location.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {

  locations: ILocation[] = [];  

  constructor(
    private locationService: LocationService,
  ) { }

  ngOnInit(): void {
    this.getLocations();
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
}
