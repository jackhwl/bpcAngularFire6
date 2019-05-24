import { Component, OnInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Menu, Misc } from '../core/models';
import { MenuService } from '../core/services';
// import { FirebaseObjectObservable } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { AppState } from '../core/models/app-state';
import { Observable } from 'rxjs';
import * as miscActions from './../actions/misc.actions';

@Component({
  selector: 'bc-header',
  styleUrls: [ './header.component.css' ],
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  public misc$: Observable<Misc>;
  public menu$: Observable<Menu[]>;

  constructor(private menuSVC: MenuService, private sanitizer: DomSanitizer
    // private userSVC: UserService,
  ) {
    this.misc$ = menuSVC.getMisc();
    this.menu$ = menuSVC.getMenus();
  }

  public ngOnInit() {
    //this.getMisc();
    //console.log('misc$=', this.misc$);
  }

  public getMisc() {
    //this.store.dispatch(new miscActions.LoadMiscAction());
  }

}
