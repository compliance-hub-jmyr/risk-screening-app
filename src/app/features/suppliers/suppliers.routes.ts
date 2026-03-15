import { Routes } from '@angular/router';
import { ShellComponent } from './components/shell/shell.component';

export const SUPPLIERS_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        // Will be replaced in feature/us-sup-002-list-suppliers
        loadComponent: () =>
          import('./suppliers-shell.component').then((m) => m.SuppliersShellComponent),
      },
    ],
  },
];
