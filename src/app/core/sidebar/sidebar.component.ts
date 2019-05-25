import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from '../models';
import { Observable } from 'rxjs';
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
    this.blogSVC.setBlog().then(this.setBlogs.bind(this));
  }

  public setBlogs() {
    this.blogs = this.blogSVC.getBlogs();
    this.hightlights = this.blogSVC.getHightlights();
  }

  public changeRoute(blog) {
    this.router.navigate(['./blog', blog.title.replace(/ /g, '-')]);
  }

}
