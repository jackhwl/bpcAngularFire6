import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MenuService, AuthService } from '../services';
import { Menu } from '../models';

@Component({
  selector: 'bc-nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavComponent implements OnInit {
  public showNav: boolean = false;
  public navBar: Menu[];
  constructor( private authService: AuthService,
               private menuSVC: MenuService,
               private router: Router
  ) {}

  public ngOnInit(): void {
    this.menuSVC.getNavBar$()
      .pipe(take(1))
      .subscribe((menus) => {
        this.navBar = menus;
        this.menuSVC.navBar = Object.assign([], this.navBar);
        this.menuSVC.updateNavBarStatus();
      },
      (error) => console.log(error));
  }

  public getUser() {
    return this.authService.user$;
  }

  public changeRoute(menu: Menu) {
    this.router.navigate(['./', menu.name.replace(/ /g, '-')]);
  }

  public changeSubRoute(menu: Menu, subMenu: Menu) {
    this.router.navigate(['/', menu.name.replace(/ /g, '-'), subMenu.name.replace(/ /g, '-')]);
  }

  public adminRoute() {
    //this.menuSVC.currentMenu = null;
    //this.menuSVC.currentSubMenu = null;
    this.router.navigate(['./admin']);
  }

  public logout() {
    this.authService.logout();
    // this.userSVC.logout();
  }

}
