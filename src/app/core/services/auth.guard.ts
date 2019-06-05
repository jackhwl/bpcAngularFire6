import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService ) { }

    public canActivate(): Observable<boolean> {
        return this.authService.user$
            .pipe(map((user) => {
                if (user && user.uid) {
                    // console.log('user is logged in');
                    return true;
                } else {
                    // console.log('user not logged in');
                    this.router.navigate(['/admin/login']);
                    return false;
                }
            }));
    }
}
