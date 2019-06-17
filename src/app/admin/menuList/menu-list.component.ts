import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuAdminService } from '../adminShared';
import { MenuService } from '../../core/services';
import { Menu } from '../../core/models';

@Component({
    templateUrl: './menu-list.component.html'
})

export class MenuListComponent implements OnInit, OnDestroy {
    public nav: Menu[];
    private navSubscription: Subscription;

    constructor(private router: Router,
                private menuSVC: MenuService,
                private menuAdminSVC: MenuAdminService) {}

    public ngOnInit() {
        this.setNav();
    }

    public setNav() {
      this.navSubscription = this.menuSVC.getRootMenu$()
        // .pipe(take(1))
        .subscribe((menu) => this.nav = menu);
    }

    public deleteNav(menu: Menu) {
        const confirmDelete = confirm(`Are you sure you want to delete this menu?`);
        if (confirmDelete) {
            this.menuAdminSVC.removeMenu(menu);
            this.reload();
        }
    }

    public reload(): void {
        this.router.navigate(['/admin/menu-list']);
    }

    public ngOnDestroy() {
      this.navSubscription.unsubscribe();
    }
}
