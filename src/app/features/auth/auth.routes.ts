import { Routes } from '@angular/router';
import { guestGuard } from './guards';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/login.component').then((m) => m.LoginComponent),
  },
];
