import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, concat, of } from 'rxjs';
import { take, takeUntil, skipUntil } from 'rxjs/operators';
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
    route.params.subscribe(() => {
      const menuParam = this.route.snapshot.params['menu'];
      const subMenuParam = this.route.snapshot.params['sub'];

      this.navBarReadySubscription = this.menuSVC.navBarReady // .pipe(takeWhile(of(true)))
        .subscribe((navBarReady) => {
          if (navBarReady) {
            this.menuSVC.getMenuContent$({menuRoute: menuParam, subMenuRoute: subMenuParam})
                    .subscribe(([menuContentObj, subMenuContentObj]) =>
                        this.menuSVC.updateRoute(menuContentObj, subMenuContentObj));
            // this.menuSVC.updateRoute0({menuRoute: menuParam, subMenuRoute: subMenuParam});
          }
      });
      this.navSubscription = this.menuSVC.routeChange.subscribe(() => {
        this.menu = this.menuSVC.currentMenu;
        this.subMenu = this.menuSVC.currentSubMenu;
      });
      // this.menuSVC.getMenuContent$({menuRoute: menuParam, subMenuRoute: subMenuParam})
      //   .subscribe(([menuContentObj, subMenuContentObj]) =>
      //     this.menuSVC.updateRoute(menuContentObj, subMenuContentObj));
      // concat(this.menuSVC.getNavBar$().pipe(take(1)),
      //     this.menuSVC.getMenuContent$({menuRoute: menuParam, subMenuRoute: subMenuParam}),
      //     this.menuSVC.routeChange)
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
