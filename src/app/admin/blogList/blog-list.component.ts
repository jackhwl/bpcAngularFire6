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
  public blogPosts: Blog[];

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

  public setPosts() {
      this.blogAdminSVC.getPosts()
          .then((snapshot) => {
              const tmp: string[] = snapshot.val();
              this.blogPosts = Object.keys(tmp).map((key) => tmp[key]);
          });
  }

  public delete(single: Blog) {
      const confirmDelete = confirm(`Are you sure you want to delete this post?`);
      if (confirmDelete) {
          this.blogAdminSVC.removePost(single);
          this.reload();
      }
  }

  public reload(): void {
    this.router.navigate(['/admin/blog-list']);
  }
}
