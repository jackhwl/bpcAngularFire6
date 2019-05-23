import { Misc } from '../core/models';

export const LOAD_MISC = 'LOAD_MISC';
export const LOAD_MISC_SUCCESS = 'LOAD_MISC_SUCCESS';
export const LOAD_MISC_FAILURE = 'LOAD_MISC_FAILURE';

export class LoadMiscAction {
    readonly type = LOAD_MISC;
    constructor() {}
}

export class LoadMiscSuccessAction {
    readonly type = LOAD_MISC_SUCCESS;
    constructor(public payload: Misc) {}
}

export class LoadMiscFailAction {
    readonly type = LOAD_MISC_FAILURE;
    constructor(public payload: any) {}
}

export type Action = LoadMiscAction | LoadMiscSuccessAction | LoadMiscFailAction
