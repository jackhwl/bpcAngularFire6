import { Component } from '@angular/core';
import { MenuService, AuthService } from '../services';
import { Router } from '@angular/router';

@Component({
  selector: 'bc-nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavComponent {

  constructor(
    private authService: AuthService,
    private menuSVC: MenuService,
    private router: Router
  ) {}

  public getTopMenu() {
    return this.menuSVC.topMenu;
  }

  public getUser() {
    return this.authService.user$;
  }

  public changeRoute(menu) {
    this.menuSVC.currentMenu = menu;
    this.menuSVC.currentSubMenu = null;
    this.menuSVC.getContent(menu);
    this.router.navigate(['./', menu.name.replace(/ /g, '-')]);
  }

  public adminRoute() {
    this.menuSVC.currentMenu = null;
    this.menuSVC.currentSubMenu = null;
    this.router.navigate(['./admin']);
  }

  public logout() {
    this.menuSVC.getContent(this.menuSVC.topMenu[0]);
    this.menuSVC.getContent(this.menuSVC.topMenu[0].items[0]);
    this.authService.logout();
  }

  public changeSubRoute(menu, subMenu) {
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
