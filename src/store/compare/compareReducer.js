import { COMPARE_ADD_ITEM, COMPARE_REMOVE_ITEM } from "./compareActionTypes";

function addItem(state, product,options, domain) {
    const itemIndex = state?.findIndex((x) => x?.id === product?.id && x?.tags?.every((value) => options?.includes(value)));
    if (itemIndex === -1) {
        return [...state, JSON?.parse(JSON.stringify(product, (product.domain = domain),(product.tags = options)))];
    }

    return state;
}

const initialState = [];

export default function compareReducer(state = initialState, action) {
    switch (action.type) {
        case COMPARE_ADD_ITEM:
            return addItem(state, action.product, action.options, action.domain);

        case COMPARE_REMOVE_ITEM:
            return state?.filter((x) => x.id !== action.productId || !x?.tags?.every((value) => action?.options?.includes(value)));

        default:
            return state;
    }
}
