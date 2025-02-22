import {
	UPDATE_PRICE,
	UPDATE_STOCK,
	UPDATE_OPTION_ID,
	UPDATE_DISCOUNT_PRICE,
} from "./productActionTypes";

const initialState = {
	price: 0,
	discount_price: 0,
	stock: 0,
	optionId: null,
};

function changePrice(state, data) {
	return {
		...state,
		price: data?.price,
	};
}

function changeDiscountPrice(state, data) {
	return {
		...state,
		discount_price: data?.discount_price,
	};
}

function changeStock(state, data) {
	return {
		...state,
		stock: data?.stock,
	};
}

function changeOptionId(state, data) {
	return {
		...state,
		optionId: data?.id,
	};
}

export default function productReducer(state = initialState, action) {
	switch (action.type) {
		case UPDATE_PRICE:
			return changePrice(state, action);
		case UPDATE_DISCOUNT_PRICE:
			return changeDiscountPrice(state, action);
		case UPDATE_STOCK:
			return changeStock(state, action);
		case UPDATE_OPTION_ID:
			return changeOptionId(state, action);
		default:
			return state;
	}
}
