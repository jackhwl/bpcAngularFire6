import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../core/services';
import { Menu } from '../core/models';
import { take } from 'rxjs/operators';

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
              private domSanitizer: DomSanitizer) {
      route.params.subscribe(() => {
        const menuParam = this.route.snapshot.params['menu'];
        const submenuParam = this.route.snapshot.params['sub'];

        // this.menuSVC.setNavContent(menuParam, submenuParam).pipe(.take(1).subscribe((menu) => {
        //   this.currentMenu = this.menuSVC.currentMenu;
        //   this.currentSubMenu = this.menuSVC.currentSubMenu;
        //   // console.log(this.currentMenu);
        //   // console.log('this.currentMenu.items=', this.currentMenu.items);
        //   // if (submenuParam && !this.currentSubMenu) {
        //   //   this.currentSubMenu = this.currentMenu.items.find((m) => m.name === submenuParam);
        //   // }
        // });
        // this.menuSVC.getNav(menuParam, submenuParam);
      });
  }

  public ngOnInit() {
    //this.menuSVC.setNavBar(null, null);
    this.sanitizer = this.domSanitizer;
    this.menuSVC.getMisc();
  }

}
