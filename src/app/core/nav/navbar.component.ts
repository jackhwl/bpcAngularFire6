import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Menu } from '../models';

@Component({
  selector: 'bc-nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavComponent implements OnInit {

  constructor(
    //private authService: AuthService,
    private menuSVC: MenuService,
    private router: Router
  ) {}

  public ngOnInit() {
    console.log('nav menu=');
  }

  public getTopMenu() {
    return this.menuSVC.topMenu;
  }

  changeRoute(menu) {
    this.menuSVC.currentMenu = menu;
    this.menuSVC.currentSubMenu = null;
    this.menuSVC.getContent(menu);
    this.router.navigate(['./', menu.name.replace(/ /g, '-')]);
  }

  adminRoute() {
    this.menuSVC.currentMenu = null;
    this.menuSVC.currentSubMenu = null;
    this.router.navigate(['./admin']);
  }

  // logout() {
  //   this.menuSVC.getContent(this.menuSVC.topMenu[0]);
  //   this.menuSVC.getContent(this.menuSVC.topMenu[0].items[0]);
  //   this.authService.logout();
  // }

  changeSubRoute(menu, subMenu) {
    this.menuSVC.currentMenu = menu;
    this.menuSVC.currentSubMenu = subMenu;
    this.menuSVC.getContent(menu);
    this.menuSVC.getContent(subMenu);
    this.router.navigate([
      '/' + this.menuSVC.currentMenu.name.replace(/ /g, '-'),
      subMenu.name.replace(/ /g, '-')
    ]);
  }
}
