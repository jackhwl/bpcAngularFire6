import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlogAdminService, QuillService } from '../adminShared';
import { Blog } from '../../core/models';

@Component({
    selector: 'edit-blog',
    templateUrl: './blog-edit.component.html'
})

export class BlogEditComponent implements OnInit {
  @Input() public thePost: Blog;
  @Output() public saveComplete = new EventEmitter();
    public editorForm: FormGroup;
    public imgTitle: string;
    public imageSRC: string;
    public postTitle: string;
    public postAuthor: string;
    public content: string;
    public post: Blog;
    public singlePost: Blog;
    public editorStyle = {
      height: '400px',
      // width: '90vw',
      backgroundColor: '#fff'
    };
    public modules: any;
    public txtArea: HTMLTextAreaElement;

    constructor(private blogAdminSVC: BlogAdminService,
                private quillSVC: QuillService,
                private fb: FormBuilder) {}

    public ngOnInit() {
        this.singlePost = this.thePost;
        this.editorForm = this.fb.group({
            title: ['', Validators.required],
            author: '',
            imgurl: '',
            content: ['', Validators.required],
            enable: false,
            ontop: false,
            order: 100
        });
        this.editorForm.setValue({
            title: this.thePost.title,
            author: this.thePost.author ? this.thePost.author : '',
            imgurl: this.thePost.imgurl ? this.thePost.imgurl : '',
            content: this.thePost.content,
            enable: (this.thePost.enable === undefined || this.thePost.enable === null)
                    ? true : this.thePost.enable,
            ontop: (this.thePost.ontop === undefined || this.thePost.ontop === null)
                    ? false : this.thePost.ontop,
            order: this.thePost.order ? this.thePost.order : 100
          });

        this.modules = this.quillSVC.getEditorModules();
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

    public updatePost() {
      if (this.editorForm.valid) {
        if (this.editorForm.dirty) {
            const postItem = { ...this.singlePost, ...this.editorForm.value};
            this.blogAdminSVC.editPost(postItem);
        }
        this.onSaveComplete();
      } else {
          console.log('Please correct the validation errors.');
      }
    }

    public onSaveComplete(): void {
      this.saveComplete.emit();
    }
  }
