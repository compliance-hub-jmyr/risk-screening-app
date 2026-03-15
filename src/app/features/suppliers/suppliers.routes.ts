import { Routes } from '@angular/router';
import { ShellComponent } from './components/shell/shell.component';

export const SUPPLIERS_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/suppliers-list/suppliers-list.component').then(
            (m) => m.SuppliersListComponent,
          ),
      },
    ],
  },
];
