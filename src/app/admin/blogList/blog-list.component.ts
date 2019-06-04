import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogAdminService } from '../adminShared';
import { UserService } from '../../core/services';
import { Blog } from '../../core/models';

@Component({
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.css']
})

export class BlogListComponent implements OnInit {
  public theUser: string;
  public menuChoice: string;
  public blogPosts: Blog[];
  public singlePost: Blog;

  constructor(private userSVC: UserService,
              private router: Router,
              private blogAdminSVC: BlogAdminService) {}

  public ngOnInit() {
    this.theUser = this.userSVC.loggedInUser;
    this.setPosts();
  }

  public logout() {
    this.userSVC.logout();
    this.router.navigate(['']);
  }

  public chooseMode(mode: string) {
      this.menuChoice = mode;
  }

  public setPosts() {
      this.blogAdminSVC.getPosts()
          .then((snapshot) => {
              const tmp: string[] = snapshot.val();
              this.blogPosts = Object.keys(tmp).map((key) => tmp[key]);
          });
  }

  public editPost(thePost: Blog) {
    this.singlePost = thePost;
    this.chooseMode('edit');
  }

  public deletePost(single: Blog) {
      const confirmDelete = confirm(`Are you sure you want to delete this post?`);
      if (confirmDelete) {
          this.blogAdminSVC.removePost(single);
          this.onSaveComplete();
      }
  }

  public onSaveComplete(): void {
    this.setPosts();
    this.chooseMode('');
    this.router.navigate(['/admin/blog-list']);
  }
}
