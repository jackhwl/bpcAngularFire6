import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuAdminService, QuillService } from '../adminShared';
import { Misc } from '../../core/models';

@Component({
    selector: 'edit-misc',
    templateUrl: './misc-edit.component.html'
})

export class MiscEditComponent implements OnInit {
    public editorForm: FormGroup;
    public editorStyle: any;
    public modules: any;
    public txtArea: HTMLTextAreaElement;
    public mode: string;
    public misc: Misc;

    constructor(private menuAdminSVC: MenuAdminService,
                private quillSVC: QuillService,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder
                ) {}

    public ngOnInit() {
      this.mode = this.route.snapshot.params['mode'];
      this.editorForm = this.fb.group({
        content: ''
      });
      this.modules = this.quillSVC.EditorModules;
      this.editorStyle = this.quillSVC.EditorStyle;
      this.menuAdminSVC.getMisc()
        .then((data) => {
          this.misc = data.val();
          this.editorForm.setValue({
            content: this.mode === 'header' ? this.misc.header.content : this.misc.footer.content
          });
        });
    }

    public editorCreated(e) {
      this.quillSVC.editorCreated(e, this.txtArea, this.editorForm);
    }

    public maxLength(e) {
      this.quillSVC.maxLength(e);
    }

    public cancel() {
      this.onSaveComplete();
    }

    public update() {
      if (this.editorForm.valid) {
          if (this.editorForm.dirty) {
              this.menuAdminSVC.editMisc(
                this.mode,
                this.editorForm.controls.content.value)
              .then(this.onSaveComplete.bind(this));
          }
          this.onSaveComplete();
        } else {
          console.log('Please correct the validation errors.');
      }
    }

    public onSaveComplete(): void {
      this.router.navigate([`/admin/misc-edit/${this.mode}`]);
    }
  }
