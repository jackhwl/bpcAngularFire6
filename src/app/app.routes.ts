import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: ':menu',  component: HomeComponent },
  { path: ':menu/:sub',  component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];
