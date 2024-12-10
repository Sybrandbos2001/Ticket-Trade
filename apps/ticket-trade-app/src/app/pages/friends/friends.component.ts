import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { IFriendRecommendation, IProfile } from '@ticket-trade/domain';
import { FriendService } from '../../services/friend/friend.service';
import { RouterModule } from '@angular/router';
import { SweetalertService } from '../../services/sweetalert/sweetalert.service';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent {
  
  friends: IProfile[] = [];
  friendRecommendations: IFriendRecommendation[] = [];

  constructor(
    private friendService: FriendService,
    private sweetAlertService: SweetalertService
  ) { }

  ngOnInit(): void {
    this.getFriends();
    this.getFriendRecommendations();
  }

  getFriends(): void {
    this.friendService.getFriends().subscribe({
      next: (data) => {
        this.friends = data;
      },
      error: (err) => {
        console.error('Error loading friends:', err);
      },
    });
  }

  getFriendRecommendations(): void {
    this.friendService.getRecommendations().subscribe({
      next: (data) => {
        this.friendRecommendations = data;
      },
      error: (err) => {
        console.error('Error loading recommendations:', err);
      },
    });
  }

  followUser(userName: string): void {
    this.friendService.followUser(userName).subscribe({
      next: () => {
        this.getFriends();
        this.getFriendRecommendations();
        this.sweetAlertService.success(
          'Je volgt nu deze gebruiker',
          'Vriendschap gemaakt!'
        );
      },
      error: (err) => {
        console.error('Error following user:', err);
      },
    });
  }

  unfollowUser(userName: string): void {
    this.friendService.unfollowUser(userName).subscribe({
      next: () => {
        this.getFriends();
        this.getFriendRecommendations();
        this.sweetAlertService.success(
          'Gebruiker is niet meer je vriend',
          'Vriendschap verbroken!'
        );
      },
      error: (err) => {
        console.error('Error unfollowing user:', err);
      },
    });
  }
}
