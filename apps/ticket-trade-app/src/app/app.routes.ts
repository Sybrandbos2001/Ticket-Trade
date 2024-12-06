import { Route } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { authGuard } from './guards/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';

export const appRoutes: Route[] = [
    { path: '', component: LandingComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent  },
    { path: 'user', component: UserComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' } ,
    
];
