import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
    public user$: Observable<firebase.User>;

    constructor(private router: Router, private afAuth: AngularFireAuth ) {
        this.user$ = this.afAuth.authState;
    }

    public login(loginEmail: string, loginPassword: string){
        const vm = this;
        this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function() {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          vm.afAuth.auth.signInWithEmailAndPassword(loginEmail, loginPassword)
          .catch(function(error) {
              alert('${error.message} Unable to login. Try Again!');
          });

          // return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .catch(function(error) {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          console.error(error);
        });
    }

    public logout() {
        this.afAuth.auth.signOut().then(function(){
            console.log('Logged Out');
            // this.router.navigate(['/home']);
        }, function(error) {
            alert('${error.message} Unabled to logout. Try again!');
        });
    }
}
