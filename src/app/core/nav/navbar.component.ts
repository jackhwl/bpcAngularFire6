import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MenuService, AuthService } from '../services';
import { Menu } from '../models';

@Component({
  selector: 'bc-nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavComponent implements OnInit {
  @Output() public onNavbarReady: EventEmitter<string> = new EventEmitter();
  public showNav: boolean = false;
  public navBar: Menu[];
  constructor(
    private authService: AuthService,
    private menuSVC: MenuService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.menuSVC.getNavBar$()
      .pipe(take(1))
      .subscribe((menus) => {
        this.navBar = menus;
        this.menuSVC.navBar = this.navBar;
        this.onNavbarReady.emit('navbar ready');
        this.menuSVC.updateNavBar(true);
      });
  }

  public getUser() {
    return this.authService.user$;
  }

  public changeRoute(menu) {
    // this.showNav = false;
    // this.menuSVC.currentMenu = menu;
    // this.menuSVC.currentSubMenu = null;
    // this.menuSVC.getContent(menu);
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
    this.showNav = false;
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
