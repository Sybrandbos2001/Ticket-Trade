import { Route } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';
import { ConcertComponent } from './pages/concert/concert.component';
import { AboutComponent } from './pages/about/about.component';
import { ConcertDetailComponent } from './pages/concert/concert-detail/concert-detail.component';
import { RegisterComponent } from './pages/register/register.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { TicketDetailComponent } from './pages/ticket/ticket-detail/ticket-detail.component';
import { AccountComponent } from './pages/account/account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './guards/admin/admin.guard';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { GenreComponent } from './pages/genre/genre.component';
import { GenreCreateComponent } from './pages/genre/genre-create/genre-create.component';
import { LocationComponent } from './pages/location/location.component';
import { LocationCreateComponent } from './pages/location/location-create/location-create.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { ArtistCreateComponent } from './pages/artist/artist-create/artist-create.component';
import { ConcertCreateComponent } from './pages/concert/concert-create/concert-create.component';

export const appRoutes: Route[] = [
    { path: '', component: LandingComponent }, 
    { path: 'over', component: AboutComponent  },

    { path: 'registeren', component: RegisterComponent },
    { path: 'inloggen', component: LoginComponent },
    { path: 'wachtwoord-wijzigen', component: ChangePasswordComponent, canActivate: [AuthGuard]  },
    { path: 'uitloggen', component: LogoutComponent, canActivate: [AuthGuard]  },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
    { path: 'forbidden', component: ForbiddenComponent },

    { path: 'profiel/:username', component: ProfileComponent },
    { path: 'vrienden', component: FriendsComponent, canActivate: [AuthGuard] },
    
    { path: 'concerten', component: ConcertComponent  },
    { path: 'concert/id/:id', component: ConcertDetailComponent },
    { path: 'concert/aanmaken', component: ConcertCreateComponent, canActivate: [AdminGuard] },

    { path: 'tickets', component: TicketComponent, canActivate: [AuthGuard]  },
    { path: 'ticket/:id', component: TicketDetailComponent, canActivate: [AuthGuard] },

    { path: 'genres', component: GenreComponent, canActivate: [AdminGuard] },
    { path: 'genre/aanmaken', component: GenreCreateComponent, canActivate: [AdminGuard] },

    { path: 'locaties', component: LocationComponent, canActivate: [AdminGuard] },
    { path: 'locatie/aanmaken', component: LocationCreateComponent, canActivate: [AdminGuard] },
    
    { path: 'artiesten', component: ArtistComponent, canActivate: [AdminGuard] },
    { path: 'artiest/aanmaken', component: ArtistCreateComponent, canActivate: [AdminGuard] },

    { path: '**', redirectTo: '' },  
];
