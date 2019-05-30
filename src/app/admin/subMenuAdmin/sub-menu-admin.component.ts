import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Menu } from '../../core/models/menu';

@Component({
    templateUrl: '/sub-menu-admin.component.html'
})

export class SubMenuAdminComponent implements OnInit {
    public menuChoice: string = '';
    public formDisplay: boolean = true;
    public nav: Menu[];
    public subNav: Menu[];
    public selectedMenu: string = null;
    public subMenu: Menu;
    public parentId: string;
    public menuData: any = {menuChoice: '', parentId: '', subMenu: null};

    constructor(private userSVC: UserService,
                private router: Router,
                private menuAdminSVC: MenuAdminService) {}

    public logout() {
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    // chooseMode(mode: string, id: string){
    //     this.menuChoice = mode;
    //     this.parentId = id;
    // }

    public ngOnInit() {
        this.setNav();
    }

    public setNav() {
      this.menuAdminSVC.getNav().subscribe((menu) => this.nav = menu);
    }

    public onChange(id) {
        this.setSubNav(id);
    }

    public setSubNav(parentId: string) {
      this.menuAdminSVC.getSubNav(parentId).subscribe((menu) => this.subNav = menu);
    }

    public addNav() {
        this.menuChoice = 'editSub';
        this.parentId = this.selectedMenu;
        // this.subMenu = new Menu (
        //     '',
        //     1,
        //     false
        // );
        this.subMenu = {
            name: '',
            content: '',
            order: 1,
            enable: false
        };
        this.menuData.parentId =  this.parentId;
        this.menuData.menuChoice = this.menuChoice;
        this.menuData.addMode = true;
    }

    public editNav(menu: Menu) {
        const dbRef = firebase.database().ref('content/').child(menu.id);
        dbRef.once('value')
            .then((snapshot) => {
                if (snapshot.exists()){
                    const contents = snapshot.val();
                    menu.content = contents.content;
                }
        });

        this.menuChoice = 'editSub';
        this.subMenu = menu;
        this.parentId = this.selectedMenu;

        this.menuData.parentId =  this.parentId;
        this.menuData.menuChoice = this.menuChoice;
        this.menuData.addMode = false;
    }

    public deleteNav(menu: Menu){
        const verify = confirm(`Are you sure you want to delete this menu?`);
        if (verify === true) {
          this.parentId = this.selectedMenu;
          this.menuAdminSVC.removeSubMenu(this.parentId, menu);
        }
    }
}
