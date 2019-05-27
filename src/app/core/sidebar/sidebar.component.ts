import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Blog } from '../models';
import { MenuService, BlogService } from '../services';

@Component({
  selector: 'side-bar',
  templateUrl: './sidebar.component.html'
})

export class SideBarComponent implements OnInit {
  public hightlights: Blog[];
  public blogs: Blog[];

  constructor(private menuSVC: MenuService,
              private blogSVC: BlogService,
              private route: ActivatedRoute,
              private router: Router) {
    route.params.subscribe(() => {
      console.log('sidebar menu=', this.route.snapshot.params['menu']);
      this.menuSVC.setTopNav(this.route.snapshot.params['menu'], this.route.snapshot.params['sub']);
    });
  }

  public ngOnInit() {
    this.setBlogs();
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
