import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, MenuService } from '../../core/services';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    public email: string;
    public password1: string;
    constructor(private userSVC: UserService,
                private menuSVC: MenuService,
                private router: Router) {}

    public ngOnInit() {
        if (!this.menuSVC.topMenu) {
            this.menuSVC.setTopNav('admin', null);
            this.menuSVC.getMisc();
        }
    }

    public login() {
        this.userSVC.login(this.email, this.password1)
        .then(() => {
            this.userSVC.verifyUser();
            this.onSaveComplete();
        });
    }

    public signup() {
        this.router.navigate(['/admin/signup']);
    }

    public cancel() {
        this.onSaveComplete();
    }

    public onSaveComplete(): void {
        this.router.navigate(['/admin']);
    }
}
