import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Menu, Misc } from '../../core/models';
import { MenuService } from '../../core/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable()
export class MenuAdminService {
  public content$: Observable<string>;
  public contents$: Observable<string[]>;
  public subMenu$: Observable<Menu>;

  constructor(private db: AngularFireDatabase,
              private fb: FormBuilder,
              private menuSVC: MenuService) {
    this.subMenu$ = this.db.object<Menu>('subMenu').valueChanges();
    this.content$ = this.db.object<string>('content').valueChanges();
    this.contents$ = this.db.list<string>('content').valueChanges();
  }

  public getFormInstance() {
    return this.fb.group({
      name: ['', Validators.required],
      content: '',
      order: 8,
      enable: false,
      parentId: null
    });
  }

  public getMisc() {
    return this.db.object<Misc>('misc').query.once('value');
  }

  public getNav() {
    return this.db.list<Menu>('menu', (ref) => ref.orderByChild('order')).valueChanges();
  }
  public getSubNav(parentId: string) {
    return this.db.list<Menu>(`subMenu/${parentId}/items`,
                              (ref) => ref.orderByChild('order'))
                  .valueChanges();
  }
  public getMenu(parentId: string, id: string) {
    return parentId ?
      this.db.object<Menu>(`subMenu/${parentId}/items/${id}`).query.once('value') :
      this.db.object<Menu>(`menu/${id}`).query.once('value');
  }

  public createMenu(menu: Menu) {
    return menu.parentId ? this.createSubMenu(menu) : this.createRootMenu(menu);
  }
  public editMenu(menu: Menu) {
    return menu.parentId ? this.editSubMenu(menu) : this.editRootMenu(menu);
  }
  public removeMenu(menu: Menu) {
    return menu.parentId ? this.removeSubMenu(menu) : this.removeRootMenu(menu);
  }

  public editMisc(type: string, content: string) {
    return this.db.object(`misc/${type}`)
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
          content: menu.content ? menu.content : '',
          enable: menu.enable,
          parentId: menu.parentId ? menu.parentId : null
        });
      });
    }
  }

  private createRootMenu(menu: Menu) {
    const pArray = [];
    let pMenu: Promise<Menu>;
    let pSubMenu: Promise<any>;
    let pContent: Promise<any>;
    const dbRef = this.db.list('menu');
    const newMenu = dbRef.push('');
    pMenu = newMenu.set({
      name: menu.name,
      order: menu.order,
      enable: menu.enable,
      id: newMenu.key
    });

    const newSubMenu = this.db.object(`subMenu/${newMenu.key}`);
    pSubMenu = newSubMenu.set({
      name: menu.name
    });

    pContent = this.createMenuContent(newMenu.key, menu.name, menu.content);

    pArray.push(pMenu);
    pArray.push(pSubMenu);
    pArray.push(pContent);

    return Promise.all(pArray);
  }
  private createSubMenu(menu: Menu) {
    const pArray = [];
    let pMenu: Promise<Menu>;
    let pContent: Promise<any>;
    const dbRef = this.db.list(`subMenu/${menu.parentId}/items`);
    const newMenu = dbRef.push('');
    pMenu = newMenu.set({
      name: menu.name,
      order: menu.order,
      enable: menu.enable,
      id: newMenu.key
    });

    pContent = this.createMenuContent(newMenu.key, menu.name, menu.content);

    pArray.push(pMenu);
    pArray.push(pContent);
    return Promise.all(pArray);
  }

  private editRootMenu(menu: Menu) {
    const pArray = [];

    pArray.push(this.db.object(`menu/${menu.id}`)
                       .update({
                          name: menu.name,
                          order: menu.order,
                          enable: menu.enable
                        }));

    pArray.push(this.db.object(`subMenu/${menu.id}`)
                        .update({
                          name: menu.name
                        }));

    pArray.push(this.updateMenuContent(menu.id, menu.name, menu.content));

    return Promise.all(pArray);
  }
  private editSubMenu(menu: Menu) {
    const pArray = [];
    pArray.push(this.db.object(`subMenu/${menu.parentId}/items/${menu.id}`)
                      .update({
                          name: menu.name,
                          order: menu.order,
                          enable: menu.enable
                      }));

    pArray.push(this.updateMenuContent(menu.id, menu.name, menu.content));

    return Promise.all(pArray);
  }

  private createMenuContent(key: string, name: string, content: string) {
    const contentObj = this.db.object(`content/${key}`);
    if (content) {
      return contentObj.set({name, content});
    } else {
      return contentObj.set({name});
    }
  }
  private updateMenuContent(key: string, name: string, content: string) {
    const contentObj = this.db.object(`content/${key}`);
    if (content) {
      return contentObj.update({name, content});
    } else {
      return contentObj.update({name});
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
      this.db.object(`subMenu/${deleteMenu.id}`).remove();
      this.db.object<string>(`content/${deleteMenu.id}`).remove();
    });
  }
  private removeSubMenu(deleteMenu: Menu) {
    this.db.object(`subMenu/${deleteMenu.parentId}/items/${deleteMenu.id}`).remove();
    this.db.object<string>(`content/${deleteMenu.id}`).remove();
  }
}
