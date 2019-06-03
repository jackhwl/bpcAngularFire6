import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAdminService } from '../adminShared';
import { UserService } from '../../core/services';
import { Menu } from '../../core/models';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './menu-list.component.html'
})

export class MenuListComponent implements OnInit, OnDestroy {
    public theUser: string;
    public nav: Menu[];
    private navSubscription: Subscription;

    constructor(private userSVC: UserService,
                private router: Router,
                private menuAdminSVC: MenuAdminService) {}

    public ngOnInit() {
        this.theUser = this.userSVC.loggedInUser;
        this.setNav();
    }

    public logout() {
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    public setNav() {
      this.navSubscription = this.menuAdminSVC.getNav()
        .subscribe((menu) => this.nav = menu);
    }

    public deleteNav(single: Menu) {
        const confirmDelete = confirm(`Are you sure you want to delete this menu?`);
        if (confirmDelete) {
            this.menuAdminSVC.removeMenu(single);
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
