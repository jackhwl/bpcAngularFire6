import * as miscActions from './../actions/misc.actions';

export function miscReducer(state = [], action: miscActions.Action) {
    switch (action.type) {
        case miscActions.LOAD_MISC_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}
