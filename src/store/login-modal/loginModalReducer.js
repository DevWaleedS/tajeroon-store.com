import { LOGIN_MODAL_CLOSE, LOGIN_MODAL_OPEN } from './loginModalActionTypes';

const initialState = {
    open: false,
};

export default function loginModalReducer(state = initialState, action) {
    switch (action.type) {
    case LOGIN_MODAL_OPEN:
        return {
            ...state,
            open: true,
        };
    case LOGIN_MODAL_CLOSE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}
