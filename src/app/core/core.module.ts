import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, PreloadAllModules } from '@angular/router';


//import { NavComponent } from './nav';
import { SideBarComponent } from './sidebar';
//import { SubNavComponent } from './subnav';

@NgModule({
    imports: [
        CommonModule, RouterModule
    ],
    exports: [
        //NavComponent, SubNavComponent,
        SideBarComponent
    ],
    declarations: [
        //NavComponent, SubNavComponent,
        SideBarComponent
    ],
    providers: [
    ]
})
export class CoreModule {}
