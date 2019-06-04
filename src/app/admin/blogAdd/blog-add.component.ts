import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogAdminService, QuillService } from '../adminShared';
import { Blog } from '../../core/models';

@Component({
    selector: 'add-blog',
    templateUrl: './blog-add.component.html'
})

export class BlogAddComponent implements OnInit {
    public editorForm: FormGroup;
    public post: Blog;
    public editorStyle: any;
    public modules: any;
    public txtArea: HTMLTextAreaElement;

    constructor(private blogAdminSVC: BlogAdminService,
                private router: Router,
                private quillSVC: QuillService) {}

    public ngOnInit() {
      this.editorForm = this.blogAdminSVC.getFormInstance();
      this.modules = this.quillSVC.EditorModules;
      this.editorStyle = this.quillSVC.EditorStyle;
    }

    public editorCreated(e) {
      this.txtArea = document.createElement('textarea');
      this.quillSVC.editorCreated(e, this.txtArea, this.editorForm);
    }

    public cancel() {
      this.onSaveComplete();
    }

    public create() {
      if (this.editorForm.valid) {
        if (this.editorForm.dirty) {
            const postItem = { ...this.post, ...this.editorForm.value};
            this.blogAdminSVC.createPost(postItem)
                  .then(this.onSaveComplete.bind(this));
        }
      } else {
        console.log('Please correct the validation errors.');
      }
    }

    public onSaveComplete(): void {
      this.router.navigate(['/admin/blog-list']);
    }
}
