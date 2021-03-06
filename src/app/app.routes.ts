import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { BlogDetailComponent } from './blogDetail/';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'},
  { path: 'blog/:title', component: BlogDetailComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: ':menu',  component: HomeComponent },
  { path: ':menu/:sub',  component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];
