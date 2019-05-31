import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlogAdminService, QuillService } from '../adminShared';
import { Blog } from '../../core/models';

@Component({
    selector: 'add-blog',
    templateUrl: './blog-add.component.html'
})

export class BlogAddComponent implements OnInit {
  @Output() public saveComplete = new EventEmitter();
    public editorForm: FormGroup;
    // public imgTitle: string;
    // public imageSRC: string;
    // public postTitle: string;
    // public postAuthor: string;
    // public content: string;
    public post: Blog;
    public editorStyle: any;
    public modules: any;
    public txtArea: HTMLTextAreaElement;

    constructor(private blogAdminSVC: BlogAdminService,
                private quillSVC: QuillService) {}

    public ngOnInit() {
      this.editorForm = this.blogAdminSVC.getFormInstance();
      this.modules = this.quillSVC.EditorModules;
      this.editorStyle = this.quillSVC.EditorStyle;
    }

    public editorCreated(e) {
      this.quillSVC.editorCreated(e, this.txtArea, this.editorForm);
    }

    public maxLength(e) {
      this.quillSVC.maxLength(e);
    }

    // public fileLoad($event: any) {
    //     const myReader: FileReader = new FileReader();
    //     const file: File = $event.target.files[0];
    //     this.imgTitle = file.name;
    //     myReader.readAsDataURL(file);

    //     myReader.onload = (e: any) => {
    //         this.imageSRC = e.target.result;
    //     };
    // }

    public createPost() {
      if (this.editorForm.valid) {
        if (this.editorForm.dirty) {
            const postItem = { ...this.post, ...this.editorForm.value};
            this.blogAdminSVC.createPost(postItem);
        }
        this.onSaveComplete();
      } else {
        console.log('Please correct the validation errors.');
      }
    }

    public cancel() {
        this.onSaveComplete();
    }

    public onSaveComplete(): void {
      this.saveComplete.emit();
    }
  }
