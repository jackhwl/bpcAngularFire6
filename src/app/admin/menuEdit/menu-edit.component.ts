import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuAdminService, QuillService } from '../adminShared';
import { Menu } from '../../core/models';

@Component({
    selector: 'edit-menu',
    templateUrl: './menu-edit.component.html'
})

export class MenuEditComponent implements OnInit {
    public editorForm: FormGroup;
    public singleMenu: Menu;
    public editorStyle: any;
    public modules: any;
    public txtArea: HTMLTextAreaElement;
    public parentId: string;
    public id: string;
    constructor(private menuAdminSVC: MenuAdminService,
                private quillSVC: QuillService,
                private route: ActivatedRoute,
                private router: Router
                ) {}

    public ngOnInit() {
      this.parentId = this.route.snapshot.params['parentId'];
      this.id = this.route.snapshot.params['id'];
      this.editorForm = this.menuAdminSVC.getFormInstance();
      this.menuAdminSVC.getMenu(this.parentId, this.id)
        .then((m) => {
          this.singleMenu = m.val();
          this.singleMenu.parentId = this.parentId;
          this.menuAdminSVC.setForm(this.singleMenu, this.editorForm);
        });
      this.modules = this.quillSVC.EditorModules;
      this.editorStyle = this.quillSVC.EditorStyle;
    }

    public editorCreated(e) {
      this.quillSVC.editorCreated(e, this.txtArea, this.editorForm);
    }

    public maxLength(e) {
      this.quillSVC.maxLength(e);
    }

    public cancelEdit() {
      this.onSaveComplete();
    }

    public updateMenu() {
      if (this.editorForm.valid) {
          if (this.editorForm.dirty) {
              const menuItem = { ...this.singleMenu, ...this.editorForm.value};
              menuItem.parentId = this.parentId;
              this.menuAdminSVC.editMenu(menuItem)
                    .then(this.onSaveComplete.bind(this));
          }
          this.onSaveComplete();
        } else {
          console.log('Please correct the validation errors.');
      }
    }

    public onSaveComplete(): void {
      if (this.parentId) {
        this.router.navigate([`/admin/sub-menu-list/${this.parentId}`]);
      } else {
        this.router.navigate(['/admin/menu-list']);
      }
    }

    // public updateMenu0() {
    //     if (this.menuData.addMode) {
    //       this.updateSubMenu(true);
    //     } else {
    //       this.updateSubMenu(false);
    //     }
    //     this.menuData.menuChoice = '';
    // }

    // private updateSubMenu(isNew: boolean) {
    //   if (this.editorForm.valid) {
    //       if (this.editorForm.dirty) {
    //           const menuItem = { ...this.singleMenu, ...this.editorForm.value};
    //           if (isNew) {
    //             this.menuAdminSVC.createSubMenu(this.menuData.parentId, menuItem);
    //           } else {
    //             this.menuAdminSVC.editSubMenu(this.menuData.parentId, menuItem);
    //           }
    //           this.onSaveComplete();
    //       } else {
    //           this.onSaveComplete();
    //       }
    //   } else {
    //       console.log('Please correct the validation errors.');
    //   }
    // }

    // private onSaveComplete(): void {
    //   // Reset the form to clear the flags
    //   console.log('onSaveComplete111');
    //   this.editorForm.reset();
    //   console.log('onSaveComplete222');
    //   // this.router.navigate(['/admin/menu-admin']);
    // }
}
