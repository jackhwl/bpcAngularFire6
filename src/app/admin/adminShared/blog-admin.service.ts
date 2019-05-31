import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Blog } from '../../core/models';

@Injectable()

export class BlogAdminService {
    constructor(private db: AngularFireDatabase) {}

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

    public getEditorModules() {
      const modules = {
          toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],

              [{ header: 1 }, { header: 2 }],               // custom button values
              [{ list: 'ordered'}, { list: 'bullet' }],
              [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
              [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
              [{ direction: 'rtl' }],                         // text direction

              [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],

              ['clean'],                                         // remove formatting button
              ['link', 'image', 'video'],
              ['showHtml'] // https://codepen.io/anon/pen/ZyEjrQ
          ]
      };
      return modules;
  }
}
