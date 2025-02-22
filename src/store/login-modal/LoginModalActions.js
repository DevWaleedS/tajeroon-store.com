import { LOGIN_MODAL_CLOSE, LOGIN_MODAL_OPEN } from './loginModalActionTypes';

export function loginModalOpen() {
    return { type: LOGIN_MODAL_OPEN };
}

export function loginModalClose() {
    return { type: LOGIN_MODAL_CLOSE };
}
