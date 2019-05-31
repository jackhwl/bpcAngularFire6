import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { BlogAdminService, QuillService } from '../adminShared';
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
                private quillSVC: QuillService,
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

    public getPosts() {
        this.db.list('blogPosts').query.once('value')
            .then((snapshot) => {
                const tmp: string[] = snapshot.val();
                this.blogPosts = Object.keys(tmp).map((key) => tmp[key]);
            });
    }

    public editPost(thePost: Blog) {
      console.log('singlePost1=', this.singlePost);
      this.singlePost = thePost;
      this.chooseMode('edit');
      console.log('singlePost2=', this.singlePost);
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
      this.chooseMode('');
      this.formDisplay = true;
      this.router.navigate(['/admin/blog-admin']);
    }
}
