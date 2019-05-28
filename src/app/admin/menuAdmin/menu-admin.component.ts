import { Component, OnInit } from '@angular/core';
import { UserService, MenuService } from '../../core/services';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Menu } from '../../core/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: '/menu-admin.component.html',
    styleUrls: ['./menu-admin.component.css']
})

export class MenuAdminComponent implements OnInit {
    editorForm: FormGroup;
    theUser: string;
    menuChoice: string;
    nav: Menu[];
    subNav: Menu[];
    formDisplay: boolean = true;
    singleMenu: Menu;
    parentId: string;
    editorStyle = {
        height: '400px',
        //width: '90vw',
        backgroundColor: '#fff'
    };
    modules: any;
    txtArea: HTMLTextAreaElement;

    constructor(private userSVC: UserService, private router: Router, private menuSVC: MenuService, private menuAdminSVC: MenuAdminService, private fb: FormBuilder){}

    logout(){
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    chooseMode(mode: string, id: string){
        this.menuChoice = mode;
        this.parentId = id;
    }

    ngOnInit(){
        // this.editorForm = new FormGroup({
        //     editName: new FormControl(),
        //     editContent: new FormControl(),
        //     editOrder: new FormControl(),
        //     editEnable: new FormControl()
        // });
        this.editorForm = this.fb.group({
            name: ['', Validators.required],
            content: '',
            order: ['', Validators.required],
            enable: ''
        });
        this.modules = this.menuAdminSVC.getEditorModules();
        this.theUser = this.userSVC.loggedInUser;
        this.getNav();
    }

    editorCreated(e) {
        let quill = e;
        this.txtArea = document.createElement('textarea');
        this.txtArea.setAttribute('formControlName', 'content');
        this.txtArea.style.cssText = "width: 100%;margin: 0px;background: rgb(29, 29, 29);box-sizing: border-box;color: rgb(204, 204, 204);font-size: 15px;outline: none;padding: 20px;line-height: 24px;font-family: Consolas, Menlo, Monaco, &quot;Courier New&quot;, monospace;position: absolute;top: 0;bottom: 0;border: none;display:none"

        let htmlEditor = quill.addContainer('ql-custom');
        htmlEditor.appendChild(this.txtArea);
        this.txtArea.value = this.editorForm.controls.content.value;
        let customButton = document.querySelector('.ql-showHtml');
        customButton.addEventListener('click', () => {
            if (this.txtArea.style.display === '') {
                this.editorForm.controls.content.setValue(this.txtArea.value);
                //quill.pasteHTML(html);
            } else {
                this.txtArea.value = this.editorForm.controls.content.value;
            }
            this.txtArea.style.display = this.txtArea.style.display === 'none' ? '' : 'none'
        });
    }

    maxLength(e) {
        // console.log(e);
        // if(e.editor.getLength() > 10) {
        //     e.editor.deleteText(10, e.editor.getLength());
        // }

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
        });
        // let key = this.nav[0].id;
        // let homeRef = dbRef.child(key);
        // homeRef.once('value')
        //     .then((snap) => {
        //         let tmp: string[] = snap.val();
        //         this.subNav = Object.keys(tmp).map(key => tmp[key])
        //     });

    }

    editNav(theMenu: Menu) {
        this.singleMenu = theMenu;
        this.menuAdminSVC.setForm(this.singleMenu, this.editorForm);
        this.formDisplay = false;
    }

    cancelEdit() {
        this.formDisplay = true;
    }

    updateMenu(){
        if (this.editorForm.valid) {
            if (this.editorForm.dirty){
                const menuItem = { ...this.singleMenu, ...this.editorForm.value};
                console.log('menuItem=', menuItem);
                console.log('this.singleMenu=', this.singleMenu);
                console.log('this.editorForm.value=', this.editorForm.value);
                this.menuAdminSVC.editMenu(menuItem);
                this.formDisplay = true;
                this.getNav();
                this.onSaveComplete();
            } else {
                this.onSaveComplete();
            }
        } else {
            console.log('Please correct the validation errors.');
        }
        // this.singleMenu.name = this.editorForm.controls.editName.value;
        // this.singleMenu.order = this.editorForm.controls.editOrder.value;
        // this.singleMenu.enable = this.editorForm.controls.editEnable.value;
        // this.singleMenu.content = this.editorForm.controls.editContent.value;
        // this.menuAdminSVC.editMenu(this.menuItem);
    }

    deleteNav(single: Menu){
        let verify = confirm(`Are you sure you want to delete this menu?`);
        if (verify == true) {
            this.menuAdminSVC.removeMenu(single);
            this.router.navigate(['/admin/']);
        } else {
            alert('Nothing deleted!');
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        console.log('onSaveComplete');
        this.editorForm.reset();
        //this.router.navigate(['/admin/menu-admin']);
    }
}