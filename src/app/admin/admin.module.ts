import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuillModule } from 'ngx-quill';
import '../../styles/quill.scss';

import { AdminComponent } from './adminComponent/admin.component';
import { AdminMenuComponent } from './adminMenu/admin-menu.component';
import { LoginComponent } from './login/login.component';
// import { SignUpComponent } from './signUp/sign-up.component';

import { UserService, AuthGuard, AuthService } from '../core/services';
import { MenuAdminService } from './adminShared/menu-admin.service';
// import { BlogAdminService } from './adminShared/blog-admin.service';

import { MenuListComponent } from './menuList/menu-list.component';

import { MenuAdminComponent } from './menuAdmin/menu-admin.component';
import { MenuAddComponent } from './menuAdd/menu-add.component';
// import { MenuEditComponent } from './menuEdit/menu-edit.component';
// import { SubMenuAdminComponent } from './subMenuAdmin/sub-menu-admin.component';

// import { BlogAdminComponent } from './blogAdmin/blog-admin.component';
// import { BlogAddComponent } from './blogAdd/blog-add.component';

import { TruncatePipe } from './adminShared/trunc.pipe';
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
        //MenuEditComponent,
        // SubMenuAdminComponent,
        // BlogAdminComponent,
        // BlogAddComponent,
        TruncatePipe
    ],
    providers: [
        UserService,
        MenuAdminService,
        // BlogAdminService,
        AuthGuard,
        AuthService
    ]
})
export class AdminModule {}
