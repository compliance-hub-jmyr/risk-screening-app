import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'suppliers',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'suppliers',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/suppliers/suppliers.routes').then((m) => m.SUPPLIERS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
