import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MenuAdminService, QuillService } from '../adminShared';
import { Menu } from '../../core/models';

@Component({
    selector: 'add-menu',
    templateUrl: './menu-add.component.html'
})

export class MenuAddComponent implements OnInit {
    @Input() public parentId: string;
    @Output() public saveComplete = new EventEmitter();
    public editorForm: FormGroup;
    public menu: Menu;
    public editorStyle: any;
    public modules: any;
    public txtArea: HTMLTextAreaElement;

    constructor(private menuAdminSVC: MenuAdminService,
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
                if (this.parentId) {
                    this.menuAdminSVC.createSubMenu(this.parentId, menuItem);
                } else {
                    this.menuAdminSVC.createMenu(menuItem);
                }
            }
            this.onSaveComplete();
        } else {
            console.log('Please correct the validation errors.');
        }
    }

    public onSaveComplete(): void {
        this.saveComplete.emit();
    }
    public cancel() {
        this.onSaveComplete();
    }
}
