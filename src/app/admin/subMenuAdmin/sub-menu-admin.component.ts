import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services';
import { Router } from '@angular/router';
import { MenuAdminService } from '../adminShared';
import { Menu } from '../../core/models/menu';

@Component({
    templateUrl: './sub-menu-admin.component.html'
})

export class SubMenuAdminComponent implements OnInit {
    public menuChoice: string = '';
    public nav: Menu[];
    public subNav: Menu[];
    public selectedMenu: string = null;
    public singleMenu: Menu;
    public subMenu: Menu;
    public parentId: string;
    public menuData: any = {menuChoice: '', parentId: '', subMenu: null};

    constructor(private userSVC: UserService,
                private router: Router,
                private menuAdminSVC: MenuAdminService) {}

    public ngOnInit() {
        this.setNav();
    }

    public logout() {
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    public chooseMode(mode: string, id: string){
        this.menuChoice = mode;
        this.parentId = id;
    }

    public setNav() {
      this.menuAdminSVC.getNav()
        .subscribe((menu) => this.nav = menu);
    }

    public onChange(id) {
        this.parentId = id;
        this.setSubNav();
    }

    public setSubNav() {
      this.menuAdminSVC.getSubNav(this.parentId)
        .subscribe((menus) => {
            this.subNav = menus;
            this.subNav.map((menu) => menu.parentId = this.parentId);
        });
    }

    // public addNav() {
    //     this.menuChoice = 'editSub';
    //     this.parentId = this.selectedMenu;
    //     // this.subMenu = new Menu (
    //     //     '',
    //     //     1,
    //     //     false
    //     // );
    //     this.subMenu = {
    //         name: '',
    //         content: '',
    //         order: 1,
    //         enable: false
    //     };
    //     this.menuData.parentId =  this.parentId;
    //     this.menuData.menuChoice = this.menuChoice;
    //     this.menuData.addMode = true;
    // }

    public editNav(theMenu: Menu) {
        this.singleMenu = theMenu;
        this.chooseMode('edit', this.parentId);
    }

    // public editNav0(menu: Menu) {
    //     this.singleMenu = menu;
    //     // this.menuAdminSVC.setForm(this.singleMenu, this.editorForm);

    //     this.menuChoice = 'editSub';
    //     this.subMenu = menu;
    //     this.parentId = this.selectedMenu;

    //     this.menuData.parentId =  this.parentId;
    //     this.menuData.menuChoice = this.menuChoice;
    //     this.menuData.addMode = false;
    // }

    public deleteNav(menu: Menu) {
        const confirmDelete = confirm(`Are you sure you want to delete this menu?`);
        if (confirmDelete) {
          this.menuAdminSVC.removeMenu(menu);
        }
    }

    public onSaveComplete(): void {
        this.setNav();
        this.chooseMode('', this.parentId);
        this.router.navigate(['/admin/sub-menu-admin']);
    }
}
