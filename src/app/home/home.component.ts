import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../core/services';
import { Menu } from '../core/models';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  public sanitizer: DomSanitizer;
  public menu: Menu;
  public subMenu: Menu;
  constructor(private menuSVC: MenuService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer) {
    route.params.subscribe(() => {
      const menuParam = this.route.snapshot.params['menu'];
      const subMenuParam = this.route.snapshot.params['sub'];

      this.menuSVC.navBarReady.subscribe((navBarReady) => {
        if (navBarReady) {
          this.menuSVC.updateRoute({menuRoute: menuParam, subMenuRoute: subMenuParam});
        }
      });
      this.menuSVC.routeChange.subscribe(() => {
        this.menu = this.menuSVC.currentMenu;
        this.subMenu = this.menuSVC.currentSubMenu;
      });
    });
  }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
  }

}
