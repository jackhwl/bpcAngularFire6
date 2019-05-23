import { Injectable } from '@angular/core';
import { MenuService } from '../core/services';
import { Effect, Actions } from '@ngrx/effects';
import * as miscActions from './../actions/misc.actions';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/map';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class MiscEffects {

    @Effect()
    public loadMisc$ = this.actions$
        .ofType(miscActions.LOAD_MISC)
        .switchMap(() => this.menuSVC.getMisc()
            .map((misc) => new miscActions.LoadMiscSuccessAction(misc))
            .catch((error) => of(new miscActions.LoadMiscFailAction(error)))
        );

    constructor(private menuSVC: MenuService, private actions$: Actions) { }
}
