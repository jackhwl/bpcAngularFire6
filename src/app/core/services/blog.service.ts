import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from '../models';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()

export class BlogService {
  public hightlights: Blog[];
  public blogs: Blog[];
  //private blog$: Observable<Blog[]>;

  constructor(private db: AngularFireDatabase ) {
    // this.blog$ = this.db.list<Blog>('blogPosts',
    //         (ref) => ref.orderByChild('order')).valueChanges();
  }

  public getBlogs() {
    return this.blogs;
  }
  public getHightlights() {
    return this.hightlights;
  }

  public setBlog() {
    if (!this.blogs) {
        // let dbRef = this.menu$.$ref.orderByChild('order');
        const dbRef = this.db.list<Blog>('blogPosts').query.once('value');
                      //(ref) => ref.orderByChild('order')).valueChanges();
        // .filter(subMenuKey => subMenuKey.name.toLowerCase() === 'join us').$ref;
        return dbRef //.once('value')
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
    }
}
  // getPosts() {
  //   let dbRef = firebase.database().ref('blogPosts/');
  //   dbRef.once('value')
  //       .then((snapshot) => {
  //           let tmp: string[] = snapshot.val();
  //           this.blogPosts = Object.keys(tmp).map(key => tmp[key])
  //       });
  // }

}
