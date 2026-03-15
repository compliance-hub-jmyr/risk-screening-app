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
    // TODO: Placeholder for now, will be replaced with a real shell component
    loadComponent: () =>
      import('./features/suppliers/suppliers-shell.component').then(
        (m) => m.SuppliersShellComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
