import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuillModule } from 'ngx-quill';
import '../../styles/quill.scss';

import { AdminComponent } from './adminComponent/admin.component';
import { AdminMenuComponent } from './adminMenu/admin-menu.component';
import { LoginComponent } from './login/login.component';
// import { SignUpComponent } from './signUp/sign-up.component';

import { UserService, AuthGuard, AuthService } from '../core/services';
import { MenuAdminService, BlogAdminService, QuillService, TruncatePipe } from './adminShared';

import { MenuListComponent } from './menuList/menu-list.component';

import { MenuAdminComponent } from './menuAdmin/menu-admin.component';
import { MenuAddComponent } from './menuAdd/menu-add.component';
import { MenuEditComponent } from './menuEdit/menu-edit.component';
import { SubMenuListComponent } from './subMenuList/sub-menu-list.component';

import { BlogAdminComponent } from './blogAdmin/blog-admin.component';
import { BlogAddComponent } from './blogAdd/blog-add.component';
import { BlogEditComponent } from './blogEdit/blog-edit.component';

import { AdminRoutes } from './admin.routes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        QuillModule,
        RouterModule.forChild(AdminRoutes)
    ],
    exports: [
        RouterModule,
        TruncatePipe
    ],
    declarations: [
        AdminComponent,
        AdminMenuComponent,
        LoginComponent,
        // SignUpComponent,
        MenuListComponent,
        MenuAdminComponent,
        MenuAddComponent,
        MenuEditComponent,
        SubMenuListComponent,
        BlogAdminComponent,
        BlogAddComponent,
        BlogEditComponent,
        TruncatePipe
    ],
    providers: [
        UserService,
        MenuAdminService,
        BlogAdminService,
        QuillService,
        AuthGuard,
        AuthService
    ]
})
export class AdminModule {}
