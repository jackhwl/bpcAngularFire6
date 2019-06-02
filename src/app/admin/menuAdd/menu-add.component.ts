import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuAdminService, QuillService } from '../adminShared';
import { Menu } from '../../core/models';

@Component({
    selector: 'add-menu',
    templateUrl: './menu-add.component.html'
})

export class MenuAddComponent implements OnInit {
    public editorForm: FormGroup;
    public menu: Menu;
    public editorStyle: any;
    public modules: any;
    public txtArea: HTMLTextAreaElement;
    public parentId: string;

    constructor(private menuAdminSVC: MenuAdminService,
                private route: ActivatedRoute,
                private router: Router,
                private quillSVC: QuillService) {}

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
        this.parentId = this.route.snapshot.params['parentId'];
        this.editorForm = this.menuAdminSVC.getFormInstance();
        this.modules = this.quillSVC.EditorModules;
        this.editorStyle = this.quillSVC.EditorStyle;
      }

    public editorCreated(e) {
        this.quillSVC.editorCreated(e, this.txtArea, this.editorForm);
    }

    public maxLength(e) {
        this.quillSVC.maxLength(e);
    }

    public createMenu() {
        if (this.editorForm.valid) {
            if (this.editorForm.dirty) {
                const menuItem = { ...this.menu, ...this.editorForm.value};
                menuItem.parentId = this.parentId;
                this.menuAdminSVC.createMenu(menuItem)
                      .then(this.onSaveComplete.bind(this));
            }
        } else {
            console.log('Please correct the validation errors.');
        }
    }

    public onSaveComplete(): void {
        if (this.parentId) {
          this.router.navigate([`/admin/sub-menu-admin/${this.parentId}`]);
        } else {
          this.router.navigate(['/admin/menu-admin']);
        }
    }

    public cancel() {
        this.onSaveComplete();
    }
}
