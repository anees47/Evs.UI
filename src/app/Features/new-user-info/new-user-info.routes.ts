import { Routes } from '@angular/router';
import { NewUserComponent } from './components/user-list/new-user.component';
import { AddUpdateUserComponent } from './components/save-user/add-update-user.component';
import { CategoriesComponent } from './components/categories-list/categories.component';
import { UserInfoTableComponent } from './components/user-info-table/user-info-table.component';

export const NEW_USER_INFO_ROUTES: Routes = [
  { path: 'users', component: NewUserComponent },
  { path: 'usersInfo', component: UserInfoTableComponent },
  { path: 'save', component: AddUpdateUserComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];