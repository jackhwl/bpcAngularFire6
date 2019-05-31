import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { BlogAdminService } from '../adminShared/blog-admin.service';
import { UserService } from '../../core/services';
import { Blog } from '../../core/models';

@Component({
    templateUrl: './blog-admin.component.html',
    styleUrls: ['./blog-admin.component.css']
})

export class BlogAdminComponent implements OnInit {
  public editorForm: FormGroup;
  public theUser: string;
  public menuChoice: string;
  public blogPosts: Blog[];
  public formDisplay: boolean = true;
  public singlePost: Blog;
  public editorStyle = {
    height: '400px',
    // width: '90vw',
    backgroundColor: '#fff'
  };
  public modules: any;
  public txtArea: HTMLTextAreaElement;

    constructor(private db: AngularFireDatabase,
                private userSVC: UserService,
                private router: Router,
                private blogAdminSVC: BlogAdminService,
                private fb: FormBuilder) {}

    public logout() {
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    public chooseMode(mode: string) {
        this.menuChoice = mode;
    }

    public ngOnInit() {
      this.editorForm = this.fb.group({
        title: ['', Validators.required],
        imgurl: '',
        author: '',
        order: 100,
        enable: false,
        ontop: false,
        content: ['', Validators.required],
      });
      this.modules = this.blogAdminSVC.getEditorModules();
      this.theUser = this.userSVC.loggedInUser;
      this.getPosts();
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

    public getPosts() {
        this.db.list('blogPosts').query.once('value')
            .then((snapshot) => {
                const tmp: string[] = snapshot.val();
                this.blogPosts = Object.keys(tmp).map((key) => tmp[key]);
            });
    }

    public editPost(thePost: Blog) {
        this.singlePost = thePost;
        // this.blogAdminSVC.setForm(this.singlePost, this.editorForm);
        // let imgurl = document.querySelector('.ql-showHtml');
        this.editorForm.setValue({
          title: thePost.title,
          author: thePost.author ? thePost.author : '',
          imgurl: thePost.imgurl ? thePost.imgurl : '',
          content: thePost.content,
          enable: (thePost.enable === undefined || thePost.enable === null) ? true : thePost.enable,
          ontop: (thePost.ontop === undefined || thePost.ontop === null) ? false : thePost.ontop,
          order: thePost.order ? thePost.order : 100
        });
        this.formDisplay = false;
    }

    public cancelEdit() {
        this.formDisplay = true;
    }

    public updatePost() {
      if (this.editorForm.valid) {
        if (this.editorForm.dirty) {
            const postItem = { ...this.singlePost, ...this.editorForm.value};
            this.blogAdminSVC.editPost(postItem);
            this.formDisplay = true;
        }
        this.onSaveComplete();
      } else {
          console.log('Please correct the validation errors.');
      }
        // this.blogAdminSVC.editPost(single);
        // this.formDisplay = true;
    }

    public deletePost(single: Blog) {
        const verify = confirm(`Are you sure you want to delete this post?`);
        if (verify === true) {
            this.blogAdminSVC.removePost(single);
            this.onSaveComplete();
        } else {
            alert('Nothing deleted!');
        }
    }

    public onSaveComplete(): void {
      // Reset the form to clear the flags
      this.editorForm.reset();
      this.getPosts();
      this.router.navigate(['/admin/blog-admin']);
    }
}
