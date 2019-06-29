import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, combineLatest, of, BehaviorSubject } from 'rxjs';
import { map, filter, concatMap } from 'rxjs/operators';
import { Menu, Misc } from '../models';

@Injectable()
export class MenuService {
  public currentMenu: Menu;
  public currentSubMenu: Menu;
  public navBar: Menu[];

  public navBarStatusSubject = new BehaviorSubject<any>(false);
  public navBarStatus$ = this.navBarStatusSubject.asObservable();

  private rootMenu$: Observable<Menu[]>;
  private rootMenu2$: Observable<Menu>;
  private subMenu$: Observable<Array<{ id: string, items: Menu[] }>>;

  constructor(private db: AngularFireDatabase) {
    this.rootMenu$ = this.getRootMenu$();
    this.subMenu$ = this.getSubMenu$();
    this.rootMenu2$ = this.getRootMenu2$();
    //this.subMenu2$ = this.getSubMenu$();
  }

  public updateNavBarStatus() {
    this.navBarStatusSubject.next(true);
  }
  public updateNavBarContent(menuContentObj, subMenuContentObj) {
    this.currentMenu.content = menuContentObj.content;
    this.currentSubMenu.content = subMenuContentObj ? subMenuContentObj.content : null;
    this.currentMenu.items = Object.assign([], this.currentMenu.items
      .filter((menu) => menu.id !== this.currentSubMenu.id));
    this.currentMenu.items.push(this.currentSubMenu);
    this.navBar = Object.assign([], this.navBar
          .filter((menu) => menu.id !== this.currentMenu.id));
    this.navBar.push(this.currentMenu);
  }

  public getMenuContent$(routeMenu: string, routeSubMenu: string) {
    this.currentMenu = this.getCurrentMenuByName(routeMenu);
    this.currentSubMenu = this.getCurrentSubMenuByName(this.currentMenu, routeSubMenu);

    return combineLatest(this.getContent$(this.currentMenu), this.getContent$(this.currentSubMenu));
  }

  public getNavBar$() {
    const enabledRootMenu$ = this.rootMenu$.pipe(
      map((menus) => menus
          .filter((menu) => menu.enable)
    ));
    const enabledSubMenu$ = this.subMenu$.pipe(
      map((menus) => menus
          .map((menu) => ({
              id: menu.id,
              items: menu.items
                .filter((m) => m.enable)
          }))
    ));

    return combineLatest(enabledRootMenu$, enabledSubMenu$).pipe(
      map(([menus, submenus]) =>
              menus.map((menu) => { submenus.filter((s) => s.id === menu.id)
                            .map((s) => menu.items = s.items);
                                    return menu;
                  })
      ),
      map((ms) => { ms.filter((m) => !m.items)
                      .map((m) => m.items = []);
                    return ms; })
    );
  }
  public getNavBar2$() {
    const enabledRootMenu$ = this.rootMenu2$.pipe(
      filter((menu) => menu.enable)
    );
    const enabledSubMenu$ = this.subMenu$.pipe(
      map((menus) => menus
          .map((menu) => ({
              id: menu.id,
              items: menu.items
                .filter((m) => m.enable)
          }))
    ));

    return combineLatest(enabledRootMenu$, enabledSubMenu$).pipe(
      map(([menus, submenus]) =>
              menus.map((menu) => { submenus.filter((s) => s.id === menu.id)
                            .map((s) => menu.items = s.items);
                                    return menu;
                  })
      ),
      concatMap((ms) => { ms.filter((m) => !m.items)
                      .map((m) => m.items = []);
                          return ms; })

    );
  }

  public getMisc$() {
    return this.db.object<Misc>('misc').valueChanges();
  }

  public getRootMenu$(): Observable<Menu[]> {
    return this.db.list<Menu>('menu').snapshotChanges().pipe(
      map((menus) => menus.map((menu) => menu.payload.val())),
      map((menus) => menus
      // .filter((menu) => menu.enable)
          .sort((m1, m2) => m1.order > m2.order ? 1 : -1)));
  }
  public getRootMenu2$(): Observable<Menu> {
    return this.db.object<Menu>('menu').snapshotChanges().pipe(
      map((menu) => menu.payload.val()),
    );
  }
  public getSubMenu$(): Observable<Array<{ id: string; items: Menu[]; }>> {
    return this.db.list<Menu>('subMenu').snapshotChanges().pipe(
      map((menus) => menus.map((menu) => ({key: menu.key, ...menu.payload.val()}) )),
      map((menus) => menus.filter((menu) => menu.items)),
      map((menus) => menus.map((menu) =>
                      ({id: menu.key, items: Object.keys(menu.items).map((key) => menu.items[key])
                        // .filter((ma) => ma.enable)
                        .sort((m1, m2) => m1.order > m2.order ? 1 : -1)
                      })
      )),
      map((ms) => ms.filter((m) => m.items.length > 0)),
      // mergeAll()
    );
  }

  private getContent$(menu: Menu) {
    if (!menu.content) {
      return this.db.object<any>(`content/${menu.id}`).valueChanges();
    } else {
      return of({content: menu.content});
    }
  }

  private getMenuByName(menus: Menu[], menuName: string) {
    return Object.assign({},
            menus.find((menu) => menu.name
                && menu.name.toLowerCase().replace(/ /g, '-') === menuName.toLowerCase())
            || menus[0]);
  }
  private getCurrentMenuByName(routeMenu: string) {
    return this.currentMenu = this.getMenuByName(this.navBar, routeMenu);
  }
  private getCurrentSubMenuByName(currentMenu: Menu, routeSubMenu: string) {
    return this.currentSubMenu = this.getMenuByName(currentMenu.items, routeSubMenu);
  }

  // public setNavContent(routeMenu: string, routeSubMenu: string = null) {
  //   return this.navBar
  //     .filter((menu) =>
  //       menu.name.toLowerCase().replace(/ /g, '-') === routeMenu.toLowerCase())
  //     .map((menu) => {
  //       this.getContent$(menu);
  //       menu.items
  //         .filter((sm) =>
  //           sm.name.toLowerCase().replace(/ /g, '-') === routeSubMenu.toLowerCase())
  //         .map((sm) =>
  //         this.getContent$(sm))
  //     });
  //   //console.log('thisnavBar = ', this.navBar);
  //   //this.navBar = Object.assign(this.navBar, this.currentMenu);
  // }
  // public getSubMenu(parentId: string) {
  //   return this.db.object<Menu>(`subMenu/${parentId}`).snapshotChanges().pipe(
  //     map((menu) => ({key: menu.key, ...menu.payload.val()}) ),
  //     map((menu) => Object.keys(menu.items).map((key) => menu.items[key])
  //                     .filter((ma) => ma.enable)
  //                     .sort((m1, m2) => m1.order > m2.order ? 1 : -1)),
  //                   // })
  //     // menus.map((menu) => ({ key: menu.key, ...menu.payload.val() }))
  //     // map((menu) => menu.items),
  //     // filter((menu) => menu.enable)
  //     // map((ms) => ms.map((m) => ({name: m.name, items: m.items})))
  //     // map((menu) => menu.items
  //     //                             .sort((m1, m2) => m1.order > m2.order ? 1 : -1)
  //     //                           })
  //     //           )),
  //     // map((menus) => menus.map((menu) => menu.sort((a, b) => a.order > b.order ? 1 : 0)))

  //     // map((ms) => ms.map((m) => m.payload.val())),
  //     // map(m=> m.filter(m1=>m1.enable))
  //     // map((ms) => ms.filter((m) => m.items.length > 0)),
  //     // mergeAll()
  //   );
  // }

  // public setTopNav(routeMenu: string, routeSubMenu: string = null) {
  //   if (!this.topMenu) {
  //     // const dbRef = this.db.list('menu', { query: { orderByChild: 'order' } })
  //     //  .$ref;
  //     return this.db.list<Menu>('menu').query.once('value').then((snapshot) => {
  //       const tmp: string[] = [];
  //       snapshot.forEach(function(childSnapshot) {
  //         const item = childSnapshot.val();
  //         if (item.enable) { tmp.push(childSnapshot.val()); }
  //       });
  //       this.topMenu = Object.keys(tmp).map((key) => tmp[key]).filter((m) => m.enable);
  //       console.log('aaa=', this.topMenu);
  //       if (routeMenu && routeMenu.toLowerCase() === 'admin') {
  //         this.topMenu.forEach((m) => {
  //           this.getSubNav(m, null, false);
  //         });
  //       } else {
  //         if (routeMenu &&
  //           routeMenu.toLowerCase() === 'home' &&
  //           this.topMenu[0].name.toLowerCase() !== 'home'
  //         ) {
  //           routeMenu = this.topMenu[0].name.toLowerCase();
  //         }
  //         this.topMenu.forEach((m) => {
  //           if (routeMenu &&
  //             m.name.toLowerCase() ===
  //             routeMenu.toLowerCase().replace(/-/g, ' ')
  //           ) {
  //             this.currentMenu = m;
  //             this.getSubNav(m, routeSubMenu, true);
  //           } else {
  //             this.getSubNav(m, routeSubMenu, false);
  //           }
  //         });
  //       }
  //       // this.topMenu1 = of(this.topMenu);
  //     });
  //   } else {
  //     return Promise.resolve();
  //   }
  // }
  // public getNav(routeMenu: string, routeSubMenu: string = null) {
  //   // const b1$ = this.db.list('menu', {query: {orderByChild: 'order'}})
  //   // const nav$ = this.db.list('menu').map(keys => keys.map(key => key));

  //   const sub$ = this.db.list<Menu>('subMenu').valueChanges();
  //   sub$.pipe(map((subMenuKeys) => subMenuKeys),
  //         filter<Menu>((subMenuKey) => subMenuKey.name.toLowerCase() === 'join us'),
  //         // .map( subMenu => ({id: subMenu.id, name: subMenu.name, items: subMenu.items})))
  //         map((subMenu) => subMenu.items),
  //         switchMap((items) =>
  //           // this.db.list('menu', { query: { orderByChild: 'order' } })
  //           this.db.list<Menu>('menu', (ref) => ref.orderByChild('order')).valueChanges()
  //               // this.blog$ = this.db.list<Blog>('blogPosts',
  //   //         (ref) => ref.orderByChild('order')).valueChanges();
  //           // .filter(menu => menu.map(key=>key.enable))
  //           .pipe(map((menu) => menu.map((key) => ({ name: key.name, item: items })))))
  //         // do(console.log)
  //     );
  //     //                 //.map( key => key.map(a=>a))

  //     // const nav$ = this.db.list('menu')
  //     //             .map(keys => keys
  //     //                 .map(key => key));
  //     // let result;
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

  //   sub$.subscribe();
  //   // b$.subscribe();
  // }

  // public getSubNav(
  //   menu: Menu,
  //   routeSubMenu: string = null,
  //   withContent: boolean = true
  // ) {
  //   if (!menu.items) {
  //     const dbRef = this.db.object<Menu>(`subMenu/${menu.id}/items`).query.once('value');
  //     dbRef.then((snapshot) => {
  //       const tmp: string[] = [];
  //       snapshot.forEach(function(childSnapshot) {
  //         const item = childSnapshot.val();
  //         if (item.enable) { tmp.push(childSnapshot.val()); }
  //       });
  //       menu.items = Object.keys(tmp).map((key) => tmp[key]);
  //       this.subMenu = menu.items;
  //       if (withContent) {
  //         this.currentSubMenu = routeSubMenu
  //           ? this.subMenu.find(
  //               (m) =>
  //                 m.name.toLowerCase() ===
  //                 routeSubMenu.toLowerCase().replace(/-/g, ' ')
  //             )
  //           : this.subMenu[0];
  //         this.getContent(this.currentSubMenu ? this.currentSubMenu : menu);
  //       }
  //     });
  //   } else {
  //     this.subMenu = menu.items;
  //   }
  // }

  // public getContent(menu: Menu) {
  //   if (menu && !menu.content) {
  //     // const contentRef = this.content$.$ref.child(menu.id);
  //     const contentRef = this.db.object<string>(`content/${menu.id}`).query.once('value');
  //     // this.db.object<string>('content').query.once('value')
  //     // contentRef.once('value').
  //     contentRef.then((snapshot) => {
  //       const contents = snapshot.val();
  //       menu.content = contents.content;
  //     });
  //   }
  // }

  // public getMenus() {
  //   // this.setTopNav('home');
  //   // return Observable.of(this.topMenu);
  //   return this.menu$;
  // }

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
