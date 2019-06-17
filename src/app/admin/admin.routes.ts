import { Routes } from '@angular/router';
// import { AdminComponent } from './adminComponent/admin.component';
import { AdminMenuComponent } from './adminMenu/admin-menu.component';
import { LoginComponent } from './login/login.component';
import { SubMenuListComponent } from './subMenuList/sub-menu-list.component';
import { MenuListComponent } from './menuList/menu-list.component';
import { MenuAddComponent } from './menuAdd/menu-add.component';
import { MenuEditComponent } from './menuEdit/menu-edit.component';
import { MiscEditComponent } from './miscEdit/misc-edit.component';
import { BlogAddComponent } from './blogAdd/blog-add.component';
import { BlogEditComponent } from './blogEdit/blog-edit.component';
import { BlogListComponent } from './blogList/blog-list.component';

import { AuthGuard } from '../core/services';

export const AdminRoutes: Routes = [
  { path: 'menu-add', component: MenuAddComponent, canActivate: [AuthGuard] },
  { path: 'menu-add/:parentId', component: MenuAddComponent, canActivate: [AuthGuard] },
  { path: 'menu-edit/:id', component: MenuEditComponent, canActivate: [AuthGuard] },
  { path: 'menu-edit/:parentId/:id', component: MenuEditComponent, canActivate: [AuthGuard] },
  { path: 'blog-add', component: BlogAddComponent, canActivate: [AuthGuard] },
  { path: 'blog-edit/:id', component: BlogEditComponent, canActivate: [AuthGuard] },
  { path: 'blog-list', component: BlogListComponent, canActivate: [AuthGuard] },
  { path: 'menu-list', component: MenuListComponent, canActivate: [AuthGuard] },
  { path: 'sub-menu-list', component: SubMenuListComponent, canActivate: [AuthGuard] },
  { path: 'sub-menu-list/:parentId', component: SubMenuListComponent, canActivate: [AuthGuard]},
  { path: 'misc-edit/:mode', component: MiscEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignUpComponent },
  // { path: 'menu/:id', component:　MenuEditComponent, canActivate: [AuthGuard] },
  { path: '', component: AdminMenuComponent, canActivate: [AuthGuard] }
];
