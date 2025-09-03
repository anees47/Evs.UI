import { Routes } from '@angular/router';
import { NewUserInfo2Component } from './components/new-user-info-2/new-user-info-2.component';

export const NEW_USER_INFO_2_ROUTES: Routes = [
  { path: 'users-table', component: NewUserInfo2Component },
  { path: '', redirectTo: 'users-table', pathMatch: 'full' }
];