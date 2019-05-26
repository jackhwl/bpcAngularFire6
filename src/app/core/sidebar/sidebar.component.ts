import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from '../models';
import { BlogService } from '../services';

@Component({
  selector: 'side-bar',
  templateUrl: './sidebar.component.html'
})

export class SideBarComponent implements OnInit {
  public hightlights: Blog[];
  public blogs: Blog[];

  constructor(private blogSVC: BlogService, private router: Router) {}

  public ngOnInit() {
    this.setBlogs();
  }

  public getBlogs() {
    return this.blogSVC.getBlogs();
  }

  public setBlogs() {
    this.blogSVC.setBlogs().then(() => {
      this.blogs = this.blogSVC.getBlogs();
      this.hightlights = this.blogSVC.getHightlights();
    });
  }

  public changeRoute(blog) {
    this.router.navigate(['./blog', blog.title.replace(/ /g, '-')]);
  }

}
