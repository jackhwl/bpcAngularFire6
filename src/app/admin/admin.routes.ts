import { Routes } from '@angular/router';
import { AdminComponent } from './adminComponent/admin.component';
import { AdminMenuComponent } from './adminMenu/admin-menu.component';
import { LoginComponent } from './login/login.component';
import { MenuAdminComponent } from './menuAdmin/menu-admin.component';
import { SubMenuAdminComponent } from './subMenuAdmin/sub-menu-admin.component';
// import { MenuListComponent } from './menuList/menu-list.component';
import { MenuAddComponent } from './menuAdd/menu-add.component';
import { MenuEditComponent } from './menuEdit/menu-edit.component';
import { BlogAdminComponent } from './blogAdmin/blog-admin.component';

import { AuthGuard } from '../core/services';

export const AdminRoutes: Routes = [
  {
      path: 'admin',
      component: AdminComponent,
      children: [
          { path: 'menu-add', component: MenuAddComponent, canActivate: [AuthGuard] },
          { path: 'menu-add/:parentId', component: MenuAddComponent, canActivate: [AuthGuard] },
          { path: 'menu-edit/:parentId', component: MenuEditComponent, canActivate: [AuthGuard] },
          { path: 'menu-edit/:parentId/:id', component: MenuEditComponent,
                  canActivate: [AuthGuard] },
          { path: 'blog-admin', component: BlogAdminComponent, canActivate: [AuthGuard] },
          { path: 'menu-admin', component: MenuAdminComponent, canActivate: [AuthGuard] },
          { path: 'sub-menu-admin', component: SubMenuAdminComponent, canActivate: [AuthGuard] },
          { path: 'sub-menu-admin/:parentId', component: SubMenuAdminComponent,
                  canActivate: [AuthGuard] },
          { path: 'login', component: LoginComponent },
          // { path: 'signup', component: SignUpComponent },
          { path: 'menu/:id', component:　MenuEditComponent, canActivate: [AuthGuard] },
          { path: '', component: AdminMenuComponent, canActivate: [AuthGuard] }
      ]
  }
];
