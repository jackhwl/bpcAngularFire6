import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Menu } from '../../core/models/menu';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable()
export class MenuAdminService {
  public content$: Observable<string>;
  public contents$: Observable<string[]>;
  public subMenu$: Observable<Menu>;
  public toolbar: any;

  constructor(private db: AngularFireDatabase) {
    this.subMenu$ = this.db.object<Menu>('subMenu').valueChanges();
    this.content$ = this.db.object<string>('content').valueChanges();
    this.contents$ = this.db.list<string>('content').valueChanges();
    this.toolbar = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
      ['link', 'image', 'video'],
      ['showHtml'] // https://codepen.io/anon/pen/ZyEjrQ
    ];
  }

  public getNav() {
    return this.db.list<Menu>('menu', (ref) => ref.orderByChild('order')).valueChanges();
    // ).query.once('value').then((snapshot) => {
    //   const tmp: string[] = [];
    //   snapshot.forEach(function(childSnapshot) {
    //     const item = childSnapshot.val();
    //     if (item.enable) { tmp.push(childSnapshot.val()); }
    //   });
    //   this.topMenu = Object.keys(tmp).map(key => tmp[key]);
    // });
    // const dbRef = firebase.database().ref('menu/').orderByChild('order');
    // // dbRef.on('value', (snapshot) => {
    // //     let tmp: string[] = snapshot.val();
    // //     this.nav = Object.keys(tmp).map(key => tmp[key])
    // // });
    // dbRef.once('value')
    //     .then((snapshot) => {
    //         // let tmp: string[] = snapshot.val();
    //         // console.log(tmp);
    //         // this.nav = Object.keys(tmp).map(key => tmp[key])
    //         const tmp: string[] = [];
    //         snapshot.forEach(function(childSnapshot) {
    //             tmp.push(childSnapshot.val());
    //         });
    //         this.nav = Object.keys(tmp).map((key) => tmp[key]);
    // });
    // // let key = this.nav[0].id;
    // // let homeRef = dbRef.child(key);
    // // homeRef.once('value')
    // //     .then((snap) => {
    // //         let tmp: string[] = snap.val();
    // //         this.subNav = Object.keys(tmp).map(key => tmp[key])
    // //     });

  }

  public createMenu(menu: Menu) {
    const dbRef = this.db.list('menu');
    const newMenu = dbRef.push('');
    newMenu.set({
      name: menu.name,
      order: menu.order,
      enable: menu.enable,
      id: newMenu.key
    });

    const newSubMenu = this.db.object(`subMenu/${newMenu.key}`);
    newSubMenu.set({
      name: menu.name
    });

    const content = this.db.object(`content/${newMenu.key}`);
    if (menu.content) {
      content.set({
        name: menu.name,
        content: menu.content
      });
    } else {
      content.set({
        name: menu.name
      });
    }
  }

  public editMenu(menu: Menu) {
    this.db.object(`menu/${menu.id}`)
      .update({
          name: menu.name,
          order: menu.order,
          enable: menu.enable
      });

    this.db.object(`subMenu/${menu.id}`)
      .update({
        name: menu.name
      });

    const content = this.db.object(`content/${menu.id}`);
    if (menu.content) {
      content.update({
        name: menu.name,
        content: menu.content
      });
    } else {
      content.update({
        name: menu.name
      });
    }
  }

  // created: FireBase.ServerValue.TIMESTAMP

  public removeMenu(deleteMenu: Menu) {
    this.db.object(`menu/${deleteMenu.id}`).remove();
    const subMenuChildRef = this.db.list(`subMenu/${deleteMenu.id}/items`).query;
    subMenuChildRef.once('value').then((snapshot) => {
      const tmp: string[] = [];
      snapshot.forEach(function(childSnapshot) {
        tmp.push(childSnapshot.val());
      });
      const menuItems = Object.keys(tmp).map((key) => tmp[key]);
      menuItems.forEach((m) => this.db.object<string>(`content/${m.id}`).remove());
    });
  }

  public createSubMenu(parentId: string, menu: Menu) {
    // let dbRef = this.db
    //   .object('subMenu/')
    //   .$ref.child(parentId)
    //   .child('items');
    // let newMenu = dbRef.push();
    // newMenu.set({
    //   name: menu.name,
    //   order: menu.order,
    //   enable: menu.enable,
    //   id: newMenu.key
    // });

    // let contentRef = this.db.object('content/').$ref;
    // let content = contentRef.child(newMenu.key);
    // content.update({
    //   name: menu.name,
    //   content: menu.content
    // });
  }

  public editSubMenu(parentId: string, menu: Menu) {
    // let dbRef = this.subMenu$.$ref
    //   .child(parentId)
    //   .child('items')
    //   .child(menu.id)
    //   //let dbRef = firebase.database().ref('menu/').child(menu.id)
    //   .update(
    //     {
    //       name: menu.name,
    //       order: menu.order,
    //       enable: menu.enable
    //     },
    //     function(err) {
    //       if (err) {
    //         console.error('error:', err);
    //       }
    //     }
    //   );

    // // let subMenuRef = firebase.database().ref('subMenu/');
    // // let newSubMenu = subMenuRef.child(menu.id);
    // // newSubMenu.update ({
    // //     name: menu.name,
    // // });

    // let contentRef = this.db.object('content/').$ref.child(menu.id);
    // //let content = contentRef.child(menu.id);
    // if (menu.content) {
    //   contentRef.update({
    //     name: menu.name,
    //     content: menu.content
    //   });
    // } else {
    //   contentRef.update({
    //     name: menu.name
    //   });
    // }

    // // var updates = {};
    // // updates['menu/' + menu.id] = {name: menu.name,order: menu.order};
    // // updates['subMenu/' + menu.id] = {name: menu.name};
    // // updates['content/' + menu.id] = {name: menu.name};

    // // firebase.database().ref().update(updates);

    // //alert('menu updated');
  }

  public removeSubMenu(parentId: string, deleteMenu: Menu) {
    // let subMenuRef = this.db
    //   .object('subMenu/')
    //   .$ref.child(parentId)
    //   .child('items')
    //   .child(deleteMenu.id)
    //   .remove();
    // let contentRef = this.contents$.remove(deleteMenu.id);
  }

  public editMisc(type: string, content: string) {
    this.db.object(`misc/${type}`)
    .update({
        content
      });
  }

  public setForm(menu: Menu, form: FormGroup) {
    if (menu && !menu.content) {
      this.db.object<string>(`content/${menu.id}`).query
      .once('value').then((snapshot) => {
        const contents = snapshot.val();
        menu.content = contents.content;
        form.setValue({
          name: menu.name,
          order: menu.order,
          content: menu.content,
          enable: menu.enable
        });
      });
    }
  }

  public getEditorModules() {
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button
        ['link', 'image', 'video'],
        ['showHtml'] // https://codepen.io/anon/pen/ZyEjrQ
      ]
    };
    return modules;
  }
}
