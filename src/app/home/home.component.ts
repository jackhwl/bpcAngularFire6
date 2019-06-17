import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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

  constructor(private menuSVC: MenuService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer) {
    route.params.subscribe(() => {
      const menuParam = this.route.snapshot.params['menu'];
      const subMenuParam = this.route.snapshot.params['sub'];

      this.navBarReadySubscription = this.menuSVC.navBarReady // .pipe(takeWhile(of(true)))
        .subscribe((navBarReady) => {
          if (navBarReady) {
            this.menuSVC.updateRoute({menuRoute: menuParam, subMenuRoute: subMenuParam});
          }
      });
      this.menuSVC.routeChange.pipe(take(1)).subscribe(() => {
        this.menu = this.menuSVC.currentMenu;
        this.subMenu = this.menuSVC.currentSubMenu;
      });
    });
  }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
  }

  public ngOnDestroy() {
    this.navBarReadySubscription.unsubscribe();
  }

}
