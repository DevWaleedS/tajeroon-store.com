import { UPDATE_PRICE, UPDATE_STOCK, UPDATE_OPTION_ID, UPDATE_DISCOUNT_PRICE } from './productActionTypes';

export function updateStock(stock) {
    return {
        type: UPDATE_STOCK,
        stock: stock,
    };
}

export function updatePrice(price) {
    return {
        type: UPDATE_PRICE,
        price: price,
    };
}

export function updateDiscountPrice(discount_price) {
    return {
        type: UPDATE_DISCOUNT_PRICE,
        discount_price: discount_price,
    };
}

export function updateOptionId(id) {
    return {
        type: UPDATE_OPTION_ID,
        id: id,
    };
}
