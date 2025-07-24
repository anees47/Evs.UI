import { Routes } from '@angular/router';
import { NewUserComponent } from './pages/NewUserInfo/components/NewUserInfo/userList/newUser.component';
import { AddUpdateUserComponent } from './pages/NewUserInfo/components/NewUserInfo/saveUser/add-update-user.component';
import { CategoriesComponent } from './pages/NewUserInfo/components/Categories/list/categories.component';
import { NewUserInfo2Component } from './pages/NewUserInofo-2/new-user-info-2/new-user-info-2.component';

export const routes: Routes = [
  { path: 'user/users', component: NewUserComponent },
  { path: 'user/usersInfo', component: NewUserInfo2Component },
  { path: 'user/save', component: AddUpdateUserComponent },
  { path: 'user/categories', component: CategoriesComponent },
  { path: '', redirectTo: '/user/users', pathMatch: 'full' }
];
