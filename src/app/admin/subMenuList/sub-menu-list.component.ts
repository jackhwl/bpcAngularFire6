import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuAdminService } from '../adminShared';
import { UserService } from '../../core/services';
import { Menu } from '../../core/models/menu';

@Component({
    templateUrl: './sub-menu-list.component.html'
})

export class SubMenuListComponent implements OnInit, OnDestroy {
  public listForm: FormGroup;
    public nav: Menu[];
    public subNav: Menu[];
    public selectedMenu: string = null;
    public parentId: string;
    private subscription: Subscription;
    private navSubscription: Subscription;

    constructor(private userSVC: UserService,
                private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private menuAdminSVC: MenuAdminService) {
      route.params.subscribe(() => {
        this.parentId = this.route.snapshot.params['parentId'];
        this.setSubNav();
      });
    }

    public ngOnInit() {
        this.listForm = this.fb.group({
          selectedMenu: [this.parentId]
        });
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

    public onChange(id: string) {
        this.parentId = id;
        this.reload();
    }

    public setSubNav() {
      this.subscription = this.menuAdminSVC.getSubNav(this.parentId)
        .subscribe((menus) => {
            this.subNav = menus;
            this.subNav.map((menu) => menu.parentId = this.parentId);
        });
    }

    public deleteNav(menu: Menu) {
        const confirmDelete = confirm(`Are you sure you want to delete this menu?`);
        if (confirmDelete) {
          this.menuAdminSVC.removeMenu(menu);
          this.reload();
        }
    }

    public reload(): void {
        this.router.navigate([`/admin/sub-menu-list/${this.parentId}`]);
    }

    public ngOnDestroy() {
      this.subscription.unsubscribe();
      this.navSubscription.unsubscribe();
    }
}
