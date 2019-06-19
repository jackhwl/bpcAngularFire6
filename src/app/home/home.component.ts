import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, concat, of, forkJoin } from 'rxjs';
import { map, take, takeUntil, concatMap, skipUntil, concatAll } from 'rxjs/operators';
import { MenuService } from '../core/services';
import { Menu } from '../core/models';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {
  public sanitizer: DomSanitizer;
  public menu: Menu;
  public subMenu: Menu;
  private navBarReadySubscription: Subscription;
  private navSubscription: Subscription;

  constructor(private menuSVC: MenuService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer) {
    // concat(this.menuSVC.navBarReady,
    //   route.params.pipe(
    //     concatMap((routeParam) =>
    //       this.menuSVC.getMenuContent$({menuRoute: routeParam.menu, subMenuRoute: routeParam.sub})),
    //     map(([menuContentObj, subMenuContentObj]) =>
    //       this.menuSVC.updateNavBarContent(menuContentObj, subMenuContentObj))
    // ))
    // .subscribe();

    // this.navSubscription = this.menuSVC.navBarContent.subscribe({complete: () => {
    //   this.menu = this.menuSVC.currentMenu;
    //   this.subMenu = this.menuSVC.currentSubMenu;
    // }});
    // route.params.subscribe((routeParam) =>
    //   //concat(this.menuSVC.navBarReady,
    //     this.menuSVC.getMenuContent$(routeParam)
    //       .pipe(
    //          takeUntil(this.menuSVC.navBarReady),
    //         //map(([menuContentObj, subMenuContentObj]) =>
    //         map((menuContentObj) =>
    //         console.log('menuContentObj=', menuContentObj)
    //         //this.menuSVC.updateNavBarContent(menuContentObj, subMenuContentObj)))
    //         //.subscribe((ab) => console.log('ab=', ab))
    //         ))
    //         .subscribe((ab) => console.log('ab=', ab))
    // );

    route.params.subscribe((routeParam) => {
      const menuParam = routeParam.menu;
      const subMenuParam = routeParam.sub;

      // this.menuSVC.getMenuContent$({menuRoute: menuParam, subMenuRoute: subMenuParam})
      //   .pipe(takeUntil(this.menuSVC.navBarReady))
      //   .subscribe(([menuContentObj, subMenuContentObj]) =>
      //         this.menuSVC.updateNavBarContent(menuContentObj, subMenuContentObj));

      this.navBarReadySubscription = this.menuSVC.navBarReady
        .subscribe({complete: () =>
            this.menuSVC.getMenuContent$({menuRoute: menuParam, subMenuRoute: subMenuParam})
                    .subscribe(([menuContentObj, subMenuContentObj]) =>
                        this.menuSVC.updateNavBarContent(menuContentObj, subMenuContentObj))
        });
      this.navSubscription = this.menuSVC.navBarContent.subscribe({complete: () => {
        this.menu = this.menuSVC.currentMenu;
        this.subMenu = this.menuSVC.currentSubMenu;
      }});
      // this.menuSVC.getMenuContent$({menuRoute: menuParam, subMenuRoute: subMenuParam})
      //   .subscribe(([menuContentObj, subMenuContentObj]) =>
      //     this.menuSVC.updateRoute(menuContentObj, subMenuContentObj));
      // concat(this.menuSVC.getNavBar$().pipe(take(1)),
      //     this.menuSVC.getMenuContent$({menuRoute: menuParam, subMenuRoute: subMenuParam}),
      //     this.menuSVC.navBarContent)
      // .subscribe((ab) => console.log('ab=', ab));
    });
  }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
  }

  public ngOnDestroy() {
    this.navBarReadySubscription.unsubscribe();
    this.navSubscription.unsubscribe();
  }

}
