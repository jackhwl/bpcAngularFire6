import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAdminService } from '../adminShared';
import { UserService } from '../../core/services';
import { Menu } from '../../core/models';

@Component({
    templateUrl: './menu-admin.component.html',
    styleUrls: ['./menu-admin.component.css']
})

export class MenuAdminComponent implements OnInit {
    public theUser: string;
    public menuChoice: string;
    public nav: Menu[];
    public singleMenu: Menu;

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
      this.menuAdminSVC.getNav()
        .subscribe((menu) => this.nav = menu);
    }

    public deleteNav(single: Menu) {
        const confirmDelete = confirm(`Are you sure you want to delete this menu?`);
        if (confirmDelete) {
            this.menuAdminSVC.removeMenu(single);
            this.onSaveComplete();
        }
    }

    public onSaveComplete(): void {
        this.setNav();
        this.router.navigate(['/admin/menu-admin']);
    }
}
