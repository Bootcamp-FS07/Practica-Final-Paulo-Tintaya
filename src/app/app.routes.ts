import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { AuthGuard } from './core/services/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent, data: {title: 'Login'}},
      { path: 'signup', component: SignupComponent, data: {title: 'Signup'} },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'feed',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/feed/feed.component').then(m => m.FeedComponent),
    data: {title: 'Feed'},
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];
