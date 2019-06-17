import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    public email: string;
    public password1: string;
    constructor(private userSVC: UserService, private router: Router) {}

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
