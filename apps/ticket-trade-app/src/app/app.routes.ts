import { Route } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
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

export const appRoutes: Route[] = [
    { path: '', component: LandingComponent }, 
    { path: 'over', component: AboutComponent  },

    { path: 'registeren', component: RegisterComponent },
    { path: 'inloggen', component: LoginComponent },
    { path: 'uitloggen', component: LogoutComponent, canActivate: [authGuard]  },
    { path: 'account', component: AccountComponent, canActivate: [authGuard] },

    { path: 'profiel/:username', component: ProfileComponent },
    { path: 'vrienden', component: FriendsComponent, canActivate: [authGuard] },
    
    { path: 'concerten', component: ConcertComponent  },
    { path: 'concert/:id', component: ConcertDetailComponent },

    { path: 'tickets', component: TicketComponent, canActivate: [authGuard]  },
    { path: 'ticket/:id', component: TicketDetailComponent, canActivate: [authGuard] },

    { path: '**', redirectTo: '' } ,  
    
];
