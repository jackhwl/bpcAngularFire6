import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlogAdminService } from '../adminShared/blog-admin.service';
import { Blog } from '../../core/models';

@Component({
    selector: 'add-blog',
    templateUrl: './blog-add.component.html'
})

export class BlogAddComponent implements OnInit {
    public editorForm: FormGroup;
    public imgTitle: string;
    public imageSRC: string;
    public postTitle: string;
    public postAuthor: string;
    public content: string;
    public post: Blog;
    public editorStyle = {
      height: '400px',
      // width: '90vw',
      backgroundColor: '#fff'
    };
    public modules: any;
    public txtArea: HTMLTextAreaElement;

    constructor(private blogAdminSVC: BlogAdminService,
                private router: Router,
                private fb: FormBuilder) {}

    public ngOnInit() {
      this.editorForm = this.fb.group({
        title: ['', Validators.required],
        author: '',
        order: 100,
        enable: false,
        content: ['', Validators.required],
        imgurl: '',
        ontop: false
        // enable: ''
      });
      this.modules = this.blogAdminSVC.getEditorModules();
    }

    public editorCreated(e) {
      const quill = e;
      this.txtArea = document.createElement('textarea');
      this.txtArea.setAttribute('formControlName', 'content');
      this.txtArea.style.cssText =
      `width: 100%;margin: 0px;
      background: rgb(29, 29, 29);
      box-sizing: border-box;color: rgb(204, 204, 204);
      font-size: 15px;outline: none;padding: 20px;
      line-height: 24px;
      font-family: Consolas, Menlo, Monaco, &quot;Courier New&quot;,
      monospace;position: absolute;top: 0;bottom: 0;border: none;display:none`;

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

  public maxLength(e) {
      // console.log(e);
      // if(e.editor.getLength() > 10) {
      //     e.editor.deleteText(10, e.editor.getLength());
      // }

  }

    public fileLoad($event: any) {
        const myReader: FileReader = new FileReader();
        const file: File = $event.target.files[0];
        this.imgTitle = file.name;
        myReader.readAsDataURL(file);

        myReader.onload = (e: any) => {
            this.imageSRC = e.target.result;
        };
    }

    public createPost() {
      if (this.editorForm.valid) {
        if (this.editorForm.dirty) {
            const postItem = { ...this.post, ...this.editorForm.value};
            console.log('postItem=', postItem);
            // console.log('this.singleMenu=', this.menu);
            // console.log('this.editorForm.value=', this.editorForm.value);
            this.blogAdminSVC.createPost(postItem);
            this.onSaveComplete();
        } else {
            this.onSaveComplete();
        }
      } else {
        console.log('Please correct the validation errors.');
      }
    }

    public cancel() {
        this.router.navigate(['/blog-admin']);
    }

    public onSaveComplete(): void {
      // Reset the form to clear the flags
      console.log('onSaveComplete');
      this.router.navigate(['/admin/blog-admin']);
    }
  }
