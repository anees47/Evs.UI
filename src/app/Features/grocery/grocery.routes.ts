import { Routes } from '@angular/router';
import { GroceryCatalogComponent } from './components/grocery-catalog/grocery-catalog.component';

export const GROCERY_ROUTES: Routes = [
  { path: 'catalog', component: GroceryCatalogComponent },
  { path: 'option1', redirectTo: 'catalog', pathMatch: 'full' }, // Redirect old route
  { path: '', redirectTo: 'catalog', pathMatch: 'full' }
];