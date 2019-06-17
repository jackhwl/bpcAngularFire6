import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Blog } from '../models';

@Injectable()

export class BlogService {
  public hightlights: Blog[];
  public blogs: Blog[];

  constructor(private db: AngularFireDatabase ) {}

  public setBlogs() {
    if (!this.blogs) {
      const dbRef = this.db.list<Blog>('blogPosts').query.once('value');
      return dbRef
        .then((snapshot) => {
          const tmp: string[] = [];
          const ontop: string[] = [];
          snapshot.forEach(function(childSnapshot){
            const item = childSnapshot.val();
            if (item.enable) {
              if (item.ontop) {
                ontop.push(childSnapshot.val());
              } else {
                tmp.push(childSnapshot.val());
              }
            }
          });
          this.hightlights = Object.keys(ontop).map((key) => ontop[key]);
          this.blogs = Object.keys(tmp).map((key) => tmp[key]);
        });
    } else {
      return Promise.resolve();
    }
  }
}
