import { Routes } from '@angular/router';
import { NewUserComponent } from './pages/user/components/userList/newUser.component';
import { AddUpdateUserComponent } from './pages/user/components/saveUser/add-update-user.component';

export const routes: Routes = [
  { path: 'user/users', component: NewUserComponent },
  { path: 'user/save', component: AddUpdateUserComponent },
  { path: '', redirectTo: '/user/users', pathMatch: 'full' }
];
