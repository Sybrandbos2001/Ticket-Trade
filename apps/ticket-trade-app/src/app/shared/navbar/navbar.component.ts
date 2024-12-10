import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbCollapseModule,
    ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService],
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  public isMenuCollapsed = true;
  userPayload: any = null;
  username: string | null = null;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.loggedIn$;
  }

  ngOnInit(): void {
    this.userPayload = this.authService.getTokenPayload();
    this.username = this.userPayload?.username || 'Gebruiker'; 
  }

  logout(): void {
    this.authService.logout();
  }
}
