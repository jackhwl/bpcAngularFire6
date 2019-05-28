import { Routes } from '@angular/router';
import { AdminComponent } from './adminComponent/admin.component';
import { AdminMenuComponent } from './adminMenu/admin-menu.component';
import { LoginComponent } from './login/login.component';
import { MenuAdminComponent } from './menuadmin/menu-admin.component';
import { MenuListComponent } from './menuList/menu-list.component';
import { MenuEditComponent } from './menuedit/menu-edit.component';
import { AuthGuard } from '../core/services';

export const AdminRoutes: Routes = [
  {
      path: 'admin',
      component: AdminComponent,
      children: [
          { path: 'menu-list', component: MenuListComponent, canActivate: [AuthGuard] },
          { path: 'menu-list/:id', component: MenuListComponent, canActivate: [AuthGuard] },
          // { path: 'blog-admin', component: BlogAdminComponent, canActivate: [AuthGuard] },
          { path: 'menu-admin', component: MenuAdminComponent, canActivate: [AuthGuard] },
          // { path: 'sub-menu-admin', component: SubMenuAdminComponent, canActivate: [AuthGuard] },
          { path: 'menu-edit/:sub', component: MenuEditComponent, canActivate: [AuthGuard] },
          { path: 'login', component: LoginComponent },
          // { path: 'signup', component: SignUpComponent },
          // { path: 'menu/:id', component:　MenuEditComponent, canActivate: [AuthGuard] },
          { path: '', component: AdminMenuComponent, canActivate: [AuthGuard] }
      ]
  }
];
