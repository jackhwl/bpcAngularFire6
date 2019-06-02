import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Menu } from '../../core/models/menu';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable()
export class MenuAdminService {
  public content$: Observable<string>;
  public contents$: Observable<string[]>;
  public subMenu$: Observable<Menu>;

  constructor(private db: AngularFireDatabase, private fb: FormBuilder) {
    this.subMenu$ = this.db.object<Menu>('subMenu').valueChanges();
    this.content$ = this.db.object<string>('content').valueChanges();
    this.contents$ = this.db.list<string>('content').valueChanges();
  }

  public getFormInstance() {
    return this.fb.group({
      name: ['', Validators.required],
      content: '',
      order: 8,
      enable: 'false'
    });
  }

  public getNav() {
    return this.db.list<Menu>('menu', (ref) => ref.orderByChild('order')).valueChanges();
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
    if (menu.parentId) {
      console.log('edit sub menu');
      this.editSubMenu(menu.parentId, menu);
    } else {
      console.log('edit root menu');
      this.editRootMenu(menu);
    }
  }

  public removeMenu(menu: Menu) {
    if (menu.parentId) {
      console.log('delete sub menu');
      this.removeSubMenu(menu.parentId, menu);
    } else {
      console.log('delete root menu');
      this.removeRootMenu(menu);
    }
  }
  // created: FireBase.ServerValue.TIMESTAMP

  public getSubNav(parentId: string) {
    return this.db.list<Menu>(`subMenu/${parentId}/items`,
                              (ref) => ref.orderByChild('order'))
                  .valueChanges();
  }

  public createSubMenu(parentId: string, menu: Menu) {
    let pMenu: Promise<Menu>;
    let pContent: Promise<any>;
    const dbRef = this.db.list(`subMenu/${parentId}/items`);
    const newMenu = dbRef.push('');
    pMenu = newMenu.set({
      name: menu.name,
      order: menu.order,
      enable: menu.enable,
      id: newMenu.key
    });

    const content = this.db.object(`content/${newMenu.key}`);
    if (menu.content) {
      pContent = content.set({
        name: menu.name,
        content: menu.content
      });
    } else {
      pContent = content.set({
        name: menu.name
      });
    }
    return Promise.all([pMenu, pContent]);
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
        menu.content = contents ? contents.content : null;
        form.setValue({
          name: menu.name,
          order: menu.order,
          content: menu.content,
          enable: menu.enable
        });
      });
    }
  }

  private editRootMenu(menu: Menu) {
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

  private editSubMenu(parentId: string, menu: Menu) {
    this.db.object(`subMenu/${parentId}/items/${menu.id}`)
      .update({
          name: menu.name,
          order: menu.order,
          enable: menu.enable
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

  private removeRootMenu(deleteMenu: Menu) {
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

  private removeSubMenu(parentId: string, deleteMenu: Menu) {
    this.db.object(`subMenu/${parentId}/items/${deleteMenu.id}`).remove();
    this.db.object<string>(`content/${deleteMenu.id}`).remove();
  }


}
