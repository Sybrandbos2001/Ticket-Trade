import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../services/user/user.service';
import { IAccount } from '@ticket-trade/domain';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  account: IAccount = {
    name: '',
    lastname: '',
    username: '',
    phone: '',
    email: '',
  };
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount(): void {
    this.userService.getAccount().subscribe({
      next: (data) => {
        this.account = data;
      },
      error: (err) => {
        console.error('Error loading account:', err);
      },
    });
  }
}
