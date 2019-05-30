import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { UserService } from '../../core/services';
import { Menu } from '../../core/models';

@Component({
    templateUrl: '/menu-admin.component.html',
    styleUrls: ['./menu-admin.component.css']
})

export class MenuAdminComponent implements OnInit {
    public editorForm: FormGroup;
    public theUser: string;
    public menuChoice: string;
    public nav: Menu[];
    public subNav: Menu[];
    public formDisplay: boolean = true;
    public singleMenu: Menu;
    public parentId: string;
    public editorStyle = {
        height: '400px',
        // width: '90vw',
        backgroundColor: '#fff'
    };
    public modules: any;
    public txtArea: HTMLTextAreaElement;

    constructor(private userSVC: UserService,
                private router: Router,
                private menuAdminSVC: MenuAdminService,
                private fb: FormBuilder) {}

    public logout() {
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    public chooseMode(mode: string, id: string) {
        this.menuChoice = mode;
        this.parentId = id;
    }

    public ngOnInit() {
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
        this.setNav();
    }

    public editorCreated(e) {
        const quill = e;
        this.txtArea = document.createElement('textarea');
        this.txtArea.setAttribute('formControlName', 'content');
        this.txtArea.style.cssText = `width: 100%;margin: 0px;background: rgb(29, 29, 29);
        box-sizing: border-box;color: rgb(204, 204, 204);
        font-size: 15px;outline: none;padding: 20px;line-height: 24px;
        font-family: Consolas, Menlo, Monaco, &quot;Courier New&quot;, monospace;
        position: absolute;top: 0;bottom: 0;border: none;display:none`;

        const htmlEditor = quill.addContainer('ql-custom');
        htmlEditor.appendChild(this.txtArea);
        this.txtArea.value = this.editorForm.controls.content.value;
        const customButton = document.querySelector('.ql-showHtml');
        customButton.addEventListener('click', () => {
            if (this.txtArea.style.display === '') {
                this.editorForm.controls.content.setValue(this.txtArea.value);
                // quill.pasteHTML(html);
            } else {
                this.txtArea.value = this.editorForm.controls.content.value;
            }
            this.txtArea.style.display = this.txtArea.style.display === 'none' ? '' : 'none';
        });
    }

    public maxLength(e) {
        // console.log(e);
        // if(e.editor.getLength() > 10) {
        //     e.editor.deleteText(10, e.editor.getLength());
        // }

    }

    public setNav() {
      this.menuAdminSVC.getNav().subscribe((menu) => this.nav = menu);
    }

    public editNav(theMenu: Menu) {
        this.singleMenu = theMenu;
        this.menuAdminSVC.setForm(this.singleMenu, this.editorForm);
        this.formDisplay = false;
    }

    public cancelEdit() {
        this.formDisplay = true;
    }

    public updateMenu() {
        if (this.editorForm.valid) {
            if (this.editorForm.dirty) {
                const menuItem = { ...this.singleMenu, ...this.editorForm.value};
                this.menuAdminSVC.editMenu(menuItem);
                this.formDisplay = true;
                this.setNav();
                this.onSaveComplete();
            } else {
                this.onSaveComplete();
            }
        } else {
            console.log('Please correct the validation errors.');
        }
    }

    public deleteNav(single: Menu) {
        const verify = confirm(`Are you sure you want to delete this menu?`);
        if (verify === true) {
            this.menuAdminSVC.removeMenu(single);
            this.router.navigate(['/admin/menu-admin']);
        }
    }

    public onSaveComplete(): void {
        // Reset the form to clear the flags
        console.log('onSaveComplete');
        this.editorForm.reset();
        // this.router.navigate(['/admin/menu-admin']);
    }
}
