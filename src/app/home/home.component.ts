import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, filter, take, switchMap } from 'rxjs/operators';
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
    this.route.params.subscribe((routeParam) => this.setMenu(routeParam));
  }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
  }

  private setMenu(routeParam: any): void {
   this.menuSVC.navBarStatus$.pipe(
      filter((ready) => ready),
      switchMap(() => this.menuSVC.getMenuContent$(routeParam)),
      map(([menuContentObj, subMenuContentObj]) =>
        this.menuSVC.updateNavBarContent(menuContentObj, subMenuContentObj)),
      take(1))
      .subscribe(() => {
        this.menu = this.menuSVC.currentMenu;
        this.subMenu = this.menuSVC.currentSubMenu;
      });
  }
}
