import { Component, Input, OnInit } from '@angular/core';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Menu } from '../../core/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'edit-menu',
    templateUrl: '/menu-edit.component.html'
})

export class MenuEditComponent implements OnInit {
    public editorForm: FormGroup;
    public name: string;
    public order: number;
    public enable: boolean;
    public editorStyle = {
        height: '400px',
        // width: '90vw',
        backgroundColor: '#fff'
    };
    public modules: any;
    public txtArea: HTMLTextAreaElement;
    @Input() public menuData: any;
    @Input() public menu: Menu;
    constructor(private menuAdminSVC: MenuAdminService, private fb: FormBuilder ) {}

    public ngOnInit() {
      this.editorForm = this.fb.group({
        name: ['', Validators.required],
        content: '',
        order: ['', Validators.required],
        enable: ''
      });
      this.modules = this.menuAdminSVC.getEditorModules();
      this.menuAdminSVC.setForm(this.menu, this.editorForm);
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
    public maxLength() {
      // console.log(e);
      // if(e.editor.getLength() > 10) {
      //     e.editor.deleteText(10, e.editor.getLength());
      // }

    }

    public updateMenu() {
        if (this.menuData.addMode) {
            this.updateSubMenu(true);
        } else {
           this.updateSubMenu(false);
        }
        this.menuData.menuChoice = '';
    }

    public cancel() {
        this.menuData.menuChoice = '';
    }

    private updateSubMenu(isNew: boolean) {
      if (this.editorForm.valid) {
          if (this.editorForm.dirty) {
              const menuItem = { ...this.menu, ...this.editorForm.value};
              if (isNew) {
                this.menuAdminSVC.createSubMenu(this.menuData.parentId, menuItem);
              } else {
                this.menuAdminSVC.editSubMenu(this.menuData.parentId, menuItem);
              }
              this.onSaveComplete();
          } else {
              this.onSaveComplete();
          }
      } else {
          console.log('Please correct the validation errors.');
      }
    }

    private onSaveComplete(): void {
      // Reset the form to clear the flags
      console.log('onSaveComplete');
      this.editorForm.reset();
      // this.router.navigate(['/admin/menu-admin']);
    }
}
