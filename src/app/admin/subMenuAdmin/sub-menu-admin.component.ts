import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Menu } from '../../core/models/menu';


@Component({
    templateUrl: '/sub-menu-admin.component.html',
    styleUrls: ['./sub-menu-admin.component.css']
})

export class SubMenuAdminComponent implements OnInit {
    menuChoice: string = '';
    formDisplay: boolean = true;
    nav: Menu[];
    subNav: Menu[];
    selectedMenu: string = null;
    subMenu: Menu;
    parentId: string;
    menuData: any = {menuChoice: '', parentId: '', subMenu: null};

    constructor(private userSVC: UserService, private router: Router, private menuAdminSVC: MenuAdminService){}

    logout(){
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    // chooseMode(mode: string, id: string){
    //     this.menuChoice = mode;
    //     this.parentId = id;
    // }

    ngOnInit(){
        //this.theUser = this.userSVC.loggedInUser;
        //this.menuData.menuChoice = '';
        this.getNav();
    }

    getNav(){
        let dbRef = firebase.database().ref('menu/').orderByChild('order');
        dbRef.once('value')
            .then((snapshot) => {
                let tmp: string[] = [];
                snapshot.forEach(function(childSnapshot){
                    tmp.push(childSnapshot.val());
                })
                this.nav = Object.keys(tmp).map(key => tmp[key]);
        });
    }

    onChange(id) {
        this.getSubNav(id);
    }

    getSubNav(parentId: string){
        let dbRef = firebase.database().ref('subMenu/').child(parentId).child('items').orderByChild('order');
        dbRef.on('value', (snapshot) => {
            if (snapshot.exists()){
                let tmp: string[] = snapshot.val();
                this.subNav = Object.keys(tmp).map(key => tmp[key]);
            } else {
                this.subNav = [];
            }
        });
        //         dbRef.once('value')
        //     .then((snapshot) => {
        //         let tmp: string[] = [];
        //         snapshot.forEach(function(childSnapshot){
        //             tmp.push(childSnapshot.val());
        //         })
        //         this.subNav = Object.keys(tmp).map(key => tmp[key]);
        // });
    }
    addNav() {
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
    editNav(menu: Menu) {
        let dbRef = firebase.database().ref('content/').child(menu.id);
        dbRef.once('value')
            .then((snapshot) => {
                if (snapshot.exists()){
                    let contents = snapshot.val();
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

    deleteNav(menu: Menu){
        let verify = confirm(`Are you sure you want to delete this menu?`);
        if (verify == true) {
          this.parentId = this.selectedMenu;
            this.menuAdminSVC.removeSubMenu(this.parentId, menu);
        }
    }
}
