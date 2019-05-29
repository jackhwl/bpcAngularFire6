import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Menu } from '../../core/models/menu';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'add-menu',
    templateUrl: '/menu-add.component.html'
})

export class MenuAddComponent implements OnInit {
    public editorForm: FormGroup;
    public name: string;
    public content: string;
    public order: number = 0;
    public enable: boolean = false;
    public menu: Menu;
    public editorStyle = {
        height: '400px',
        // width: '90vw',
        backgroundColor: '#fff'
    };
    public modules: any;
    public txtArea: HTMLTextAreaElement;
    @Input() public parentId: string;

    constructor( private menuAdminSVC: MenuAdminService,
                 private router: Router, private fb: FormBuilder ) {}

    // fileLoad($event: any) {
    //     let myReader:FileReader = new FileReader();
    //     let file:File = $event.target.files[0];
    //     this.imgTitle = file.name;
    //     myReader.readAsDataURL(file);

    //     myReader.onload = (e: any) => {
    //         this.imageSRC = e.target.result;
    //     }
    // }

    public ngOnInit() {
        // console.log('this.parentId=');
        // console.log(this.parentId);
        this.editorForm = this.fb.group({
            name: ['', Validators.required],
            content: '',
            order: ['', Validators.required],
            enable: 'false'
        });
        this.modules = this.menuAdminSVC.getEditorModules();
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
        const customButton = document.querySelector('.ql-showHtml') as HTMLButtonElement;
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

    public createMenu() {
        if (this.editorForm.valid) {
            if (this.editorForm.dirty) {
                const menuItem = { ...this.menu, ...this.editorForm.value};
                console.log('menuItem=', menuItem);
                console.log('this.singleMenu=', this.menu);
                console.log('this.editorForm.value=', this.editorForm.value);
                if (this.parentId) {
                    this.menuAdminSVC.createSubMenu(this.parentId, menuItem);
                } else {
                    this.menuAdminSVC.createMenu(menuItem);
                }
                this.onSaveComplete();
            } else {
                this.onSaveComplete();
            }
        } else {
            console.log('Please correct the validation errors.');
        }
    }

    public onSaveComplete(): void {
        // Reset the form to clear the flags
        console.log('onSaveComplete');
        // this.editorForm.reset();
        this.router.navigate(['/admin']);
    }
    public cancel() {
        this.router.navigate(['/admin']);
    }
}
