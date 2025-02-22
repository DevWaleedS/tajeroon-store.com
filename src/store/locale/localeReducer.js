import { LOCALE_CHANGE } from './localeActionTypes';

const initialState = 'ar';

export default function localeReducer(state = initialState, action) {
    if (action.type === LOCALE_CHANGE) {
        return action.locale;
    }

    return state;
}
