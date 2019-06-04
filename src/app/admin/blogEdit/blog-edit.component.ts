import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogAdminService, QuillService } from '../adminShared';
import { Blog } from '../../core/models';

@Component({
    selector: 'edit-blog',
    templateUrl: './blog-edit.component.html'
})

export class BlogEditComponent implements OnInit {
    public editorForm: FormGroup;
    // public post: Blog;
    public singlePost: Blog;
    public editorStyle: any;
    public modules: any;
    public txtArea: HTMLTextAreaElement;
    public id: string;

    constructor(private blogAdminSVC: BlogAdminService,
                private quillSVC: QuillService,
                private route: ActivatedRoute,
                private router: Router) {}

    public ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      this.editorForm = this.blogAdminSVC.getFormInstance();
      this.blogAdminSVC.getPost(this.id)
        .then((b) => {
          this.singlePost = b.val();
          this.blogAdminSVC.setForm(this.singlePost, this.editorForm);
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

    public cancel() {
        this.onSaveComplete();
    }

    public update() {
      if (this.editorForm.valid) {
        if (this.editorForm.dirty) {
            const postItem = { ...this.singlePost, ...this.editorForm.value };
            this.blogAdminSVC.editPost(postItem);
        }
        this.onSaveComplete();
      } else {
          console.log('Please correct the validation errors.');
      }
    }

    public onSaveComplete(): void {
      this.router.navigate(['/admin/blog-list']);
    }
  }
