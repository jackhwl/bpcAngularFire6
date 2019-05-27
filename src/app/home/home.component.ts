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
  public currentMenu: Menu;
  public currentSubMenu: Menu;
  constructor(private menuSVC: MenuService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer) {}

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
    const menuParam = this.route.snapshot.params['menu'];
    const submenuParam = this.route.snapshot.params['sub'];
    console.log('home menu=', menuParam);

    this.menuSVC.setTopNav(menuParam, submenuParam).then(() => {
      this.currentMenu = this.menuSVC.currentMenu;
      this.currentSubMenu = this.menuSVC.currentSubMenu;
    });
    this.menuSVC.getNav(menuParam, submenuParam);
    this.menuSVC.getMisc();
  }

}
