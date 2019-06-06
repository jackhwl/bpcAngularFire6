import { Injectable } from '@angular/core';
import { Menu, Misc } from '../models';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

@Injectable()
export class MenuService {
  // public topMenu1: Observable<Menu[]>;
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
    // this.topMenu1 = db.list<Menu>('menu').valueChanges();
    this.misc$ = db.object<Misc>('misc').valueChanges();
    // //console.log('this.misc$=', this.misc$);
    // // this.content$ = this.db.doc<string>('content').valueChanges();
    // // this.subMenu$ = this.db.doc<Menu>('subMenu').valueChanges();
    //  this.menu$ = this.db.collection<Menu>('menu').valueChanges();
    //  //console.log('this.menu$=', this.menu$);
  }
  public getNav(routeMenu: string, routeSubMenu: string = null) {
    // const b1$ = this.db.list('menu', {query: {orderByChild: 'order'}})
    // const nav$ = this.db.list('menu').map(keys => keys.map(key => key));

    const sub$ = this.db.list<Menu>('subMenu').valueChanges();
    sub$.pipe(map((subMenuKeys) => subMenuKeys),
          filter<Menu>((subMenuKey) => subMenuKey.name.toLowerCase() === 'join us'),
          // .map( subMenu => ({id: subMenu.id, name: subMenu.name, items: subMenu.items})))
          map((subMenu) => subMenu.items),
          switchMap((items) =>
            // this.db.list('menu', { query: { orderByChild: 'order' } })
            this.db.list<Menu>('menu', (ref) => ref.orderByChild('order')).valueChanges()
                // this.blog$ = this.db.list<Blog>('blogPosts',
    //         (ref) => ref.orderByChild('order')).valueChanges();
            // .filter(menu => menu.map(key=>key.enable))
            .pipe(map((menu) => menu.map((key) => ({ name: key.name, item: items })))))
          //do(console.log)
      );
      //                 //.map( key => key.map(a=>a))

      // const nav$ = this.db.list('menu')
      //             .map(keys => keys
      //                 .map(key => key));
      //let result;
      // forkJoin([sub$, nav$]).subscribe(results=> {
      //     results[0].items = results[1];
      //     this.result = results[0];

      // })
      // console.log(this.result);
      // , items: subNav$
      //             .filter(nav=> nav.id === menu.id)
      //             .map(item=>item.items)}))
      //             // this.menu$
      // .map(keys => keys
      //     .map(key => ({name: key.name, id: key.id, items:

      // this.db.list('subMenu')
      // .map(subMenuKeys => subMenuKeys
      //     .filter(subMenuKey => subMenuKey.name.toLowerCase() === key.name.toLowerCase())
      //     .map( subMenu => ({name: key.name, items: subMenu.items})


    sub$.subscribe();
    //b$.subscribe();
  }

  public setTopNav(routeMenu: string, routeSubMenu: string = null) {
    if (!this.topMenu) {
      // const dbRef = this.db.list('menu', { query: { orderByChild: 'order' } })
      //  .$ref;
      return this.db.list<Menu>('menu').query.once('value').then((snapshot) => {
        const tmp: string[] = [];
        snapshot.forEach(function(childSnapshot) {
          const item = childSnapshot.val();
          if (item.enable) { tmp.push(childSnapshot.val()); }
        });
        this.topMenu = Object.keys(tmp).map(key => tmp[key]).filter((m) => m.enable);
        if (routeMenu && routeMenu.toLowerCase() === 'admin') {
          this.topMenu.forEach(m => {
            this.getSubNav(m, null, false);
          });
        } else {
          if (routeMenu &&
            routeMenu.toLowerCase() === 'home' &&
            this.topMenu[0].name.toLowerCase() !== 'home'
          ) {
            routeMenu = this.topMenu[0].name.toLowerCase();
          }
          this.topMenu.forEach((m) => {
            if (routeMenu &&
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
        //this.topMenu1 = of(this.topMenu);
      });
    } else {
      return Promise.resolve();
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
