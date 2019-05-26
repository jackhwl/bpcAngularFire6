import { Injectable } from '@angular/core';
import { Menu, Misc } from '../models';
// import * as firebase from 'firebase';

// import { AngularFire } from 'angularfire2';
// import { AngularFire } from 'angularfire2';
// // for auth
// import {AngularFireAuthModule} from 'angularfire2/auth';
// // for database
// tslint:disable-next-line: max-line-length
// import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

// import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@Injectable()
export class MenuService {
  public topMenu: Menu[];
  public subMenu: Menu[];
  public currentMenu: Menu;
  public currentSubMenu: Menu;
  public content$: Observable<string>;
  public misc$: Observable<Misc>;
  public subMenu$: Observable<Menu>;
  public menu$: Observable<Menu[]>;
  public result: any;

  constructor(private db: AngularFireDatabase) {
    // this.misc$ = this.db.object('misc').valueChanges();
    this.content$ = this.db.object<string>('content').valueChanges();
    this.subMenu$ = this.db.object<Menu>('subMenu').valueChanges();
    this.menu$ = db.list<Menu>('menu').valueChanges();
    this.misc$ = db.object<Misc>('misc').valueChanges();
    // //console.log('this.misc$=', this.misc$);
    // // this.content$ = this.db.doc<string>('content').valueChanges();
    // // this.subMenu$ = this.db.doc<Menu>('subMenu').valueChanges();
    //  this.menu$ = this.db.collection<Menu>('menu').valueChanges();
    //  //console.log('this.menu$=', this.menu$);
  }
  // public getNav(routeMenu: string, routeSubMenu: string = null) {
  //   // const b1$ = this.db.list('menu', {query: {orderByChild: 'order'}})
  //   // const nav$ = this.db.list('menu').map(keys => keys.map(key => key));

  //   const sub$ = this.db.list<Menu>('subMenu').valueChanges();
  //   sub$.pipe(map((subMenuKeys) => subMenuKeys
  //         .filter((subMenuKey) => subMenuKey.name.toLowerCase() === 'join us')
  //         //.map( subMenu => ({id: subMenu.id, name: subMenu.name, items: subMenu.items})))
  //         .map(subMenu => subMenu.items)
  //     )
  //     .switchMap(items =>
  //       this.db
  //         .list('menu', { query: { orderByChild: 'order' } })
  //         //.filter(menu => menu.map(key=>key.enable))
  //         .map(menu => menu.map(key => ({ name: key.name, item: items })))
  //     ))
  //     //                 //.map( key => key.map(a=>a))

  //     // const nav$ = this.db.list('menu')
  //     //             .map(keys => keys
  //     //                 .map(key => key));
  //     //let result;
  //     // forkJoin([sub$, nav$]).subscribe(results=> {
  //     //     results[0].items = results[1];
  //     //     this.result = results[0];

  //     // })
  //     // console.log(this.result);
  //     // , items: subNav$
  //     //             .filter(nav=> nav.id === menu.id)
  //     //             .map(item=>item.items)}))
  //     //             // this.menu$
  //     // .map(keys => keys
  //     //     .map(key => ({name: key.name, id: key.id, items:

  //     // this.db.list('subMenu')
  //     // .map(subMenuKeys => subMenuKeys
  //     //     .filter(subMenuKey => subMenuKey.name.toLowerCase() === key.name.toLowerCase())
  //     //     .map( subMenu => ({name: key.name, items: subMenu.items})
  //     .do(console.log);

  //   sub$.subscribe();
  //   //b$.subscribe();
  // }

  public setTopNav(routeMenu: string, routeSubMenu: string = null) {
    if (!this.topMenu) {
      // const dbRef = this.db.list('menu', { query: { orderByChild: 'order' } })
      //  .$ref;
      this.db.list<Menu>('menu').query.once('value').then((snapshot) => {
        const tmp: string[] = [];
        snapshot.forEach(function(childSnapshot) {
          const item = childSnapshot.val();
          if (item.enable) { tmp.push(childSnapshot.val()); }
        });
        this.topMenu = Object.keys(tmp).map(key => tmp[key]);
        console.log(routeMenu);
        if (routeMenu.toLowerCase() === 'admin') {
          this.topMenu.forEach(m => {
            this.getSubNav(m, null, false);
          });
        } else {
          if (
            routeMenu.toLowerCase() === 'home' &&
            this.topMenu[0].name.toLowerCase() !== 'home'
          ) {
            routeMenu = this.topMenu[0].name.toLowerCase();
          }
          this.topMenu.forEach(m => {
            if (
              m.name.toLowerCase() ===
              routeMenu.toLowerCase().replace(/-/g, ' ')
            ) {
              this.currentMenu = m;
              this.getSubNav(m, routeSubMenu, true);
            } else {
              this.getSubNav(m, routeSubMenu, false);
            }
          });
        }
      });
    }
  }

  public getSubNav(
    menu: Menu,
    routeSubMenu: string = null,
    withContent: boolean = true
  ) {
    if (!menu.items) {
      const dbRef = this.db.object<Menu>(`subMenu/${menu.id}/items`).query.once('value');
      dbRef.then(snapshot => {
        let tmp: string[] = [];
        snapshot.forEach(function(childSnapshot) {
          let item = childSnapshot.val();
          if (item.enable) tmp.push(childSnapshot.val());
        });
        menu.items = Object.keys(tmp).map(key => tmp[key]);
        this.subMenu = menu.items;
        if (withContent) {
          this.currentSubMenu = routeSubMenu
            ? this.subMenu.find(
                m =>
                  m.name.toLowerCase() ===
                  routeSubMenu.toLowerCase().replace(/-/g, ' ')
              )
            : this.subMenu[0];
          this.getContent(this.currentSubMenu ? this.currentSubMenu : menu);
        }
      });
    } else {
      this.subMenu = menu.items;
    }
  }

  public getContent(menu: Menu) {
    if (menu && !menu.content) {
      //const contentRef = this.content$.$ref.child(menu.id);
      const contentRef = this.db.object<string>(`content/${menu.id}`).query.once('value');
      //this.db.object<string>('content').query.once('value')
      //contentRef.once('value').
      contentRef.then((snapshot) => {
        const contents = snapshot.val();
        menu.content = contents.content;
        console.log('aaa=', menu);
      });
    }
  }

  public getMisc() {
    return this.misc$;
  }

  public getMenus() {
    // this.setTopNav('home');
    // return Observable.of(this.topMenu);
    return this.menu$;
  }

  // getTopNav(routeMenu: string, routeSubMenu: string = null){
  //     // if (!this.topMenu) {
  //         // let dbRef = this.menu$.$ref.orderByChild('order');
  //         let dbRef = this.db.list('menu', {query: {orderByChild: 'order'}}).$ref;
  //         dbRef.once('value')
  //             .then((snapshot) => {
  //                 let tmp: string[] = [];
  //                 snapshot.forEach(function(childSnapshot){
  //                     let item = childSnapshot.val();
  //                     if (item.enable) tmp.push(childSnapshot.val());
  //                 })
  //                 this.menu$ = Observable.of(Object.keys(tmp).map(key => tmp[key]));
  //                 //console.log(routeMenu);
  //                 if (routeMenu.toLowerCase() === 'admin') {
  //                     this.topMenu.forEach(m => {
  //                         this.getSubNav(m, null, false);
  //                     });
  //                 } else {
  //                     if (routeMenu.toLowerCase() === 'home' && this.topMenu[0].name.toLowerCase() !== 'home') routeMenu = this.topMenu[0].name.toLowerCase();
  //                     this.topMenu.forEach(m => {
  //                         if (m.name.toLowerCase() === routeMenu.toLowerCase().replace(/-/g, ' ')) {
  //                             this.currentMenu = m;
  //                             this.getSubNav(m, routeSubMenu, true);
  //                         } else {
  //                             this.getSubNav(m, routeSubMenu, false);
  //                         }
  //                     });
  //                 }
  //         });
  //     //}
  // }
}
