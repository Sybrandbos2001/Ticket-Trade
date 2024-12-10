import { Route } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { authGuard } from './guards/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';
import { ConcertComponent } from './pages/concert/concert.component';
import { AboutComponent } from './pages/about/about.component';
import { ConcertDetailComponent } from './pages/concert/concert-detail/concert-detail.component';
import { RegisterComponent } from './pages/register/register.component';

export const appRoutes: Route[] = [
    { path: '', component: LandingComponent }, 
    { path: 'registeren', component: RegisterComponent }, 
    { path: 'uitloggen', component: LogoutComponent  },
    { path: 'inloggen', component: LoginComponent },
    { path: 'user', component: UserComponent, canActivate: [authGuard] },
    { path: 'concerten', component: ConcertComponent  },
    { path: 'concert/:id', component: ConcertDetailComponent },
    { path: 'over', component: AboutComponent  },
    { path: '**', redirectTo: '' } ,    
];
