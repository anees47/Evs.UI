import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./Features/new-user-info/new-user-info.routes').then(m => m.NEW_USER_INFO_ROUTES)
  },
  {
    path: 'grocery',
    loadChildren: () => import('./Features/grocery/grocery.routes').then(m => m.GROCERY_ROUTES)
  },
  {
    path: 'user-info-2',
    loadChildren: () => import('./Features/new-user-info-2/new-user-info-2.routes').then(m => m.NEW_USER_INFO_2_ROUTES)
  },
  { path: '', redirectTo: '/user/users', pathMatch: 'full' }
];
