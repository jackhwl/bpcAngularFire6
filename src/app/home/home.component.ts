import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, switchMap, concatMap, take, concatAll } from 'rxjs/operators';
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
    this.getMenu$().subscribe(
      () => {
        this.menu = this.menuSVC.currentMenu;
        this.subMenu = this.menuSVC.currentSubMenu;
        },
      (error) => console.log(error));

    this.getMenu2$().subscribe((m) => console.log('menu2$=', m));
  }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
  }
  private getMenu2$() {
    return this.route.params.pipe(
      map((routeParam) => this.menuSVC.getNavBar$().pipe(
          take(1), // Menu[]
          concatAll(),
          filter((menu) => menu.name === routeParam.menu || menu.name === routeParam.sub),
        // this.menuSVC.navBar = Object.assign([], this.navBar);
        // this.menuSVC.updateNavBarStatus();
    )));
  }

  private getMenu$(): Observable<any> {
    return this.route.params.pipe(
      concatMap((routeParam) => this.menuSVC.navBarStatus$.pipe(
        filter((ready) => ready),
        switchMap(() => this.menuSVC.getMenuContent$(routeParam.menu, routeParam.sub)),
        map(([menuContentObj, subMenuContentObj]) =>
          this.menuSVC.updateNavBarContent(menuContentObj, subMenuContentObj)),
        take(1)
    )));
  }
}
