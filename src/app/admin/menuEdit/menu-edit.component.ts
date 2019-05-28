import { Component, Input, OnInit } from '@angular/core';
import { UserService, MenuService } from '../../core/services';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Menu } from '../../core/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'edit-menu',
    templateUrl: '/menu-edit.component.html'
})

export class MenuEditComponent implements OnInit{
    editorForm: FormGroup;
    name: string;
    order: number;
    enable: boolean;
    editorStyle = {
        height: '400px',
        //width: '90vw',
        backgroundColor: '#fff'
    };
    modules: any;
    txtArea: HTMLTextAreaElement;
    @Input() menuData: any;
    @Input() menu: Menu;
    constructor( private menuAdminSVC: MenuAdminService, private router: Router, private fb: FormBuilder ){}

    // fileLoad($event: any) {
    //     let myReader:FileReader = new FileReader();
    //     let file:File = $event.target.files[0];
    //     this.imgTitle = file.name;
    //     myReader.readAsDataURL(file);

    //     myReader.onload = (e: any) => {
    //         this.imageSRC = e.target.result;
    //     }
    // }

    ngOnInit(){
      this.editorForm = this.fb.group({
        name: ['', Validators.required],
        content: '',
        order: ['', Validators.required],
        enable: ''
      });
      this.modules = this.menuAdminSVC.getEditorModules();
      this.menuAdminSVC.setForm(this.menu, this.editorForm);
      //this.theUser = this.userSVC.loggedInUser;
      //this.getNav();
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

    updateMenu() {
        if (this.menuData.addMode) {
            //this.menuAdminSVC.createSubMenu(this.menuData.parentId, menu);;
            this.updateSubMenu(true)
        } else {
           this.updateSubMenu(false);
            //this.menuAdminSVC.editSubMenu(this.menuData.parentId, menu);
        }
        this.menuData.menuChoice = '';
    }

    updateSubMenu(isNew: boolean){
      if (this.editorForm.valid) {
          if (this.editorForm.dirty){
              const menuItem = { ...this.menu, ...this.editorForm.value};
              console.log('menuItem=', menuItem);
              console.log('this.singleMenu=', this.menu);
              console.log('this.editorForm.value=', this.editorForm.value);
              //this.menuAdminSVC.editMenu(menuItem);
              if (isNew) {
                this.menuAdminSVC.createSubMenu(this.menuData.parentId, menuItem);
              }
              else {
                this.menuAdminSVC.editSubMenu(this.menuData.parentId, menuItem);
              }
              //this.formDisplay = true;
              //this.getNav();
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

    onSaveComplete(): void {
      // Reset the form to clear the flags
      console.log('onSaveComplete');
      this.editorForm.reset();
      //this.router.navigate(['/admin/menu-admin']);
    }
    cancel() {
        this.menuData.menuChoice = '';
    }
}
