import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

import { Blog } from '../core/models';

@Component({
    selector: 'blog-detail',
    templateUrl: './blog-detail.component.html'
})

export class BlogDetailComponent implements OnInit {
  public singlePost: Blog;
  public postTitle: string;
  public sanitizer: DomSanitizer;

  constructor(private db: AngularFireDatabase,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer) {
    route.params.subscribe(() => {
      this.postTitle = this.route.snapshot.params['title'].replace(/-/g, ' ');
      this.getSingle(this.postTitle);
    });
  }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
  }

  private getSingle(blogTitle: string) {
    this.db.list<Blog>('blogPosts', (ref) =>
        ref.orderByChild('title').equalTo(blogTitle)).query.once('value')
        .then((snapshot) => {
            const tmp = snapshot.val();
            const transform = Object.keys(tmp).map((key) => tmp[key]);
            const title = transform[0].title;
            const content = transform[0].content;
            const imgTitle = transform[0].imgTitle;
            const img = transform[0].img;
            const ontop = transform[0].ontop;
            const author = transform[0].author;
            const enable = transform[0].enable;
            const order = transform[0].order;
            const createDate = transform[0].createDate;
            const modifiedDate = transform[0].modifiedDate;

            this.singlePost = {
              title, content, imgTitle, img, ontop, author,
              order, enable, createDate, modifiedDate
            };
        });
  }
}
