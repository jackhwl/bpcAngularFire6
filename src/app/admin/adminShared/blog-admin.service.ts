import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Blog } from '../../core/models';

@Injectable()

export class BlogAdminService {
    constructor(private db: AngularFireDatabase, private fb: FormBuilder) {}

    public getFormInstance() {
        return this.fb.group({
            title: ['', Validators.required],
            author: '',
            imgurl: '',
            content: ['', Validators.required],
            enable: false,
            ontop: false,
            order: 100
        });
    }

    public getPosts() {
        return this.db.list<Blog>('blogPosts').query.once('value');
    }
    public getPost(id: string) {
        return this.db.object<Blog>(`blogPosts/${id}`).query.once('value');
    }
    public setForm(singlePost: Blog, form: FormGroup) {
        form.setValue({
            title: singlePost.title,
            author: singlePost.author ? singlePost.author : '',
            imgurl: singlePost.imgurl ? singlePost.imgurl : '',
            content: singlePost.content,
            enable: (singlePost.enable === undefined || singlePost.enable === null)
                    ? true : singlePost.enable,
            ontop: (singlePost.ontop === undefined || singlePost.ontop === null)
                    ? false : singlePost.ontop,
            order: singlePost.order ? singlePost.order : 100
        });
    }

    public createPost(post: Blog) {
        if (post.img) {
        //   let storageRef = firebase.storage().ref();
        //   storageRef.child(`images/${post.imgTitle}`).putString(post.img, 'base64')
        //       .then((snapshot) => {
        //           let url = snapshot.metadata.downloadURLs[0];
        //           let dbRef = firebase.database().ref('blogPosts/');
        //           let newPost = dbRef.push();
        //           newPost.set ({
        //               title: post.title,
        //               author: post.author,
        //               imgurl: post.imgurl,
        //               content: post.content,
        //               order: post.order,
        //               enable: post.enable,
        //               ontop: post.ontop,
        //               createDate: new Date(),
        //               modifiedDate: new Date(),
        //               imgTitle: post.imgTitle,
        //               img: url,
        //               id: newPost.key
        //           });
        //       })
        //       .catch((error) => {
        //           alert(`failed upload: ${error}`);
        //       });
        } else {
            const dbRef = this.db.list('blogPosts');
            const newPost = dbRef.push('');
            newPost.set ({
              title: post.title,
              author: post.author,
              imgurl: post.imgurl,
              content: post.content,
              order: post.order,
              enable: post.enable,
              ontop: post.ontop,
              imgTitle: null,
              img: null,
              createDate: new Date(),
              modifiedDate: new Date(),
              id: newPost.key
          });
        }
    }

    public editPost(update: Blog) {
        this.db.object(`blogPosts/${update.id}`)
            .update({
                title: update.title,
                author: update.author,
                imgurl: update.imgurl,
                content: update.content,
                order: update.order,
                enable: update.enable,
                ontop: update.ontop,
                modifiedDate: new Date(),
            });
    }

    public removePost(deletePost: Blog) {
        this.db.object(`blogPosts/${deletePost.id}`).remove();
    }

}
