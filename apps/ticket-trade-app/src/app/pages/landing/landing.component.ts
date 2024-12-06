import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    MatButtonModule, 
    MatDividerModule, 
    MatIconModule
  ], 
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

}
