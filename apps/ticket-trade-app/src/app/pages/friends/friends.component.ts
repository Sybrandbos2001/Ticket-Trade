import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { IFriendRecommendation, IProfile } from '@ticket-trade/domain';
import { FriendService } from '../../services/friend/friend.service';
import { RouterModule } from '@angular/router';
import { SweetalertService } from '../../services/sweetalert/sweetalert.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent {
  
  friends: IProfile[] = [];
  searchForm: FormGroup;
  friendRecommendations: IFriendRecommendation[] = [];
  searchResults: IProfile[] = [];

  constructor(
    private fb: FormBuilder,
    private friendService: FriendService,
    private sweetAlertService: SweetalertService
  ) { 
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }

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
        this.searchForm.reset();
        this.searchResults = [];
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
        this.friends = this.friends.filter((friend) => friend.username !== userName);
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

  onSubmit(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value.trim();
    if (!searchTerm) {
      this.searchResults = [];
      return;
    }

    this.friendService.searchProfiles(searchTerm).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (err) => {
        console.error('Fout bij zoeken naar gebruikers:', err);
        this.searchResults = [];
      }
    });
  }
}
