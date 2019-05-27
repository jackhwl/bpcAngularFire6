import { Component, OnInit } from '@angular/core';
import { UserService, MenuService } from '../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Menu } from '../../core/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './menu-list.component.html',
    styleUrls: []
})

export class MenuListComponent implements OnInit {
    editorForm: FormGroup;
    theUser: string;
    menuChoice: string;
    rootNav: Menu[];
    nav: Menu[];
    subNav: Menu[];
    formDisplay: boolean = true;
    singleMenu: Menu;
    parentId: string;
    selectedMenu: string;
    editorStyle = {
        height: '400px',
        //width: '90vw',
        backgroundColor: '#fff'
    };
    modules: any;
    txtArea: HTMLTextAreaElement;

    constructor(private userSVC: UserService, private route: ActivatedRoute, private router: Router, private menuSVC: MenuService, private menuAdminSVC: MenuAdminService, private fb: FormBuilder){}

    logout(){
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    chooseMode(mode: string, id: string){
        this.menuChoice = mode;
        this.parentId = id;
    }

    ngOnInit(){
        const param = this.route.snapshot.paramMap.get('id');
        if (param) {
            this.selectedMenu = param;
        } else {
            this.selectedMenu = "0";
        }
        console.log('selectedMenu=', this.selectedMenu)
        this.getSubNav(this.selectedMenu);
        this.theUser = this.userSVC.loggedInUser;
    }
    onChange(id) {
        if (id === "0") {
            this.router.navigate(['/admin/menu-list']);
        } else {
            this.router.navigate(['/admin/menu-list/' + encodeURIComponent(id)]);
        }
        //this.getSubNav(id);
    }

    getNav(){
        let dbRef = firebase.database().ref('menu/').orderByChild('order');
        // dbRef.on('value', (snapshot) => {
        //     let tmp: string[] = snapshot.val();
        //     this.nav = Object.keys(tmp).map(key => tmp[key])
        // });
        dbRef.once('value')
            .then((snapshot) => {
                // let tmp: string[] = snapshot.val();
                // console.log(tmp);
                //this.nav = Object.keys(tmp).map(key => tmp[key])
                let tmp: string[] = [];
                snapshot.forEach(function(childSnapshot){
                    tmp.push(childSnapshot.val());
                })
                this.nav = Object.keys(tmp).map(key => tmp[key]);
                this.rootNav = Object.keys(tmp).map(key => tmp[key]);
        });
        // let key = this.nav[0].id;
        // let homeRef = dbRef.child(key);
        // homeRef.once('value')
        //     .then((snap) => {
        //         let tmp: string[] = snap.val();
        //         this.subNav = Object.keys(tmp).map(key => tmp[key])
        //     });

    }
    getSubNav(parentId: string){
        if (parentId == '0') {
            this.getNav();
        } else {

            let dbRef = firebase.database().ref('subMenu/').child(parentId).child('items').orderByChild('order');
            dbRef.on('value', (snapshot) => {
                if (snapshot.exists()){
                    let tmp: string[] = snapshot.val();
                    this.nav = Object.keys(tmp).map(key => tmp[key]);
                } else {
                    this.nav = [];
                }
            });
        }
        //         dbRef.once('value')
        //     .then((snapshot) => {
        //         let tmp: string[] = [];
        //         snapshot.forEach(function(childSnapshot){
        //             tmp.push(childSnapshot.val());
        //         })
        //         this.subNav = Object.keys(tmp).map(key => tmp[key]);
        // });
    } 

}