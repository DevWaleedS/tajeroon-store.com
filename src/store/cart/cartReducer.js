import {
	CART_SET_ITEM,
	CART_ADD_ITEM,
	CART_REMOVE_ITEM,
	CART_UPDATE_QUANTITIES,
	CART_ADD_ITEM_LOCAL,
	CART_REMOVE_ITEM_LOCAL,
	RESET_LOCAL_CART,
	AAD_LOCAL_CART_TO_DB,
	CHANGING_SHIPPING_PRICE,
	CART_UPDATE_OPTIONS_LOCAL,
} from "./cartActionTypes";

/**
 * @param {array} items
 * @param {object} product
 * @param {array} options
 * @return {number}
 */
function findItemIndex(items, product, options) {
	return items?.findIndex((item) => {
		if (
			item?.product?.id !== product?.id ||
			item?.options?.length !== options?.length
		) {
			return false;
		}

		for (let i = 0; i < options?.length; i += 1) {
			const option = options[i];
			const itemOption = item?.options?.find(
				(itemOption) => itemOption === option
			);

			if (!itemOption) {
				return false;
			}
		}

		return true;
	});
}

function calcSubtotal(items) {
	return items.reduce((subtotal, item) => subtotal + item?.sum, 0);
}

function calcQuantity(items) {
	return items.reduce((quantity, item) => quantity + item?.qty, 0);
}

function calcTotal(subtotal, shipping) {
	return Number(subtotal + shipping).toFixed(2);
}

function calcTax(subtotal) {
	return Number(subtotal * (15 / 100)).toFixed(2);
}

function addItem(state, data) {
	return {
		...state,
		items: data?.cartDetail,
		cartId: data?.id,
		qty: data?.totalCount,
		subtotal: data?.subtotal,
		tax: data?.tax,
		is_service: data?.is_service || false,
		shipping: data?.shipping_price,
		overweight: data?.overweight,
		overweight_price: data?.overweight_price,
		discount_price: data?.discount_value,
		discount_type: data?.discount_type,
		discount_total: data?.discount_total,
		total: data?.total,
		lastItemId: data?.cartDetail?.[data?.cartDetail?.length - 1]?.product?.id,
	};
}

function removeItem(state, data) {
	return {
		...state,
		items: data?.cartDetail,
		cartId: data?.id,
		qty: data?.totalCount,
		subtotal: data?.subtotal,
		tax: data?.tax,
		shipping: data?.shipping_price,
		overweight: data?.overweight,
		overweight_price: data?.overweight_price,
		discount_price: data?.discount_value,
		discount_type: data?.discount_type,
		discount_total: data?.discount_total,
		total: data?.total,
	};
}

function updateQuantities(state, quantities) {
	let needUpdate = false;

	const newItems = state?.items?.map((item) => {
		const quantity = quantities?.find(
			(x) => x?.id === item?.id && x?.qty !== item?.qty
		);
		if (!quantity) {
			return item;
		}
		needUpdate = true;
		return {
			...item,
			qty: quantity.qty,
			sum: quantity.qty * item.price,
		};
	});

	if (needUpdate) {
		const subtotal = calcSubtotal(newItems);
		const total = calcTotal(subtotal, 0);
		const tax = calcTax(subtotal);
		return {
			...state,
			items: newItems,
			cartId: null,
			qty: calcQuantity(newItems),
			subtotal: Number(subtotal - tax).toFixed(2),
			shipping: null,
			overweight: null,
			overweight_price: null,
			discount_price: null,
			discount_type: null,
			discount_total: null,
			tax,
			total,
		};
	}

	return state;
}

function updateCartOptionsLocal(state, products) {
	let needUpdate = false;

	const newItems = state?.items?.map((item) => {
		const product = products?.products?.find((x) => x?.id === item?.id);
		if (!product) {
			return item;
		}
		needUpdate = true;
		return {
			...item,
			options: product?.options,
			stock: product?.stock,
			price: product?.price,
			qty: product?.qty,
			sum: product?.qty * product?.price,
		};
	});

	if (needUpdate) {
		const subtotal = calcSubtotal(newItems);
		const total = calcTotal(subtotal, 0);
		const tax = calcTax(subtotal);
		return {
			...state,
			items: newItems,
			cartId: null,
			qty: calcQuantity(newItems),
			subtotal: Number(subtotal - tax).toFixed(2),
			shipping: null,
			overweight: null,
			overweight_price: null,
			discount_price: null,
			discount_type: null,
			discount_total: null,
			tax,
			total,
		};
	}

	return state;
}

function getData(state, data) {
	return {
		...state,
		items: data?.cartDetail || [],
		cartId: data?.id || null,
		qty: data?.totalCount || 0,
		subtotal: data?.subtotal || 0,
		tax: data?.tax || 0,
		is_service: data?.is_service || false,
		shipping: data?.shipping_price || 0,
		overweight: data?.overweight || 0,
		overweight_price: data?.overweight_price || 0,
		discount_price: data?.discount_value || null,
		discount_type: data?.discount_type || null,
		discount_total: data?.discount_total || null,
		total: data?.total || 0,
		lastItemId:
			data?.cartDetail?.[data?.cartDetail?.length - 1]?.product?.id || null,
	};
}

function addItemLocal(state, product, options, quantity, domain, price, stock) {
	const itemIndex = findItemIndex(state.items, product, options);

	let newItems;
	let { lastItemId } = state;

	if (itemIndex === -1) {
		lastItemId += 1;
		newItems = [
			...state.items,
			{
				id: lastItemId,
				product: JSON?.parse(JSON.stringify(product)),
				options: JSON?.parse(JSON.stringify(options)),
				price: price,
				sum: price * quantity,
				qty: quantity,
				stock: stock,
			},
		];
	} else {
		const item = state.items[itemIndex];

		newItems = [
			...state.items.slice(0, itemIndex),
			{
				...item,
				qty: item.qty + quantity,
				sum: price * (item.qty + quantity),
				options: JSON?.parse(JSON.stringify(options)),
				stock: stock,
			},
			...state.items.slice(itemIndex + 1),
		];
	}

	const subtotal = calcSubtotal(newItems);
	const total = calcTotal(subtotal, 0);
	const tax = calcTax(subtotal);

	return {
		...state,
		lastItemId,
		cartId: null,

		subtotal: Number(subtotal - tax).toFixed(2),
		tax,
		shipping: null,
		overweight: null,
		overweight_price: null,
		discount_price: null,
		discount_type: null,
		discount_total: null,
		total,
		items: newItems,
		qty: calcQuantity(newItems),
	};
}

function removeItemLocal(state, itemId) {
	const { items } = state;
	const newItems = items.filter((item) => item?.id !== itemId);

	const subtotal = calcSubtotal(newItems);
	const total = calcTotal(subtotal, 0);
	const tax = calcTax(subtotal);

	return {
		...state,
		items: newItems,
		cartId: null,
		qty: calcQuantity(newItems),
		subtotal: Number(subtotal - tax).toFixed(2),
		tax,
		discount_price: null,
		discount_type: null,
		discount_total: null,
		shipping: null,
		overweight: null,
		overweight_price: null,
		total,
	};
}

function resetLocalCart(state) {
	return {
		...state,
		lastItemId: 0,
		cartId: null,
		qty: 0,
		items: [],
		subtotal: 0,
		tax: 0,
		shipping: null,
		overweight: null,
		overweight_price: null,
		discount_price: null,
		discount_type: null,
		discount_total: null,
		total: 0,
	};
}

function addCartToDB(state, data) {
	return {
		...state,
		cartId: data?.id,
		items: data?.cartDetail,
		qty: data?.totalCount,
		subtotal: data?.subtotal,
		tax: data?.tax,
		is_service: data?.is_service || false,
		shipping: data?.shipping_price,
		overweight: data?.overweight,
		overweight_price: data?.overweight_price,
		discount_price: data?.discount_value,
		discount_type: data?.discount_type,
		discount_total: data?.discount_total,
		total: data?.total,
		lastItemId: data?.cartDetail?.[data?.cartDetail?.length - 1]?.product?.id,
	};
}

function changeShippingPricing(state, data) {
	return {
		...state,
		shipping: state?.shipping > 0 ? data?.shipping_price : 0,
		total:
			state?.subtotal +
			state?.tax +
			state?.overweight_price +
			(state?.shipping > 0 ? data?.shipping_price : 0) +
			(state?.discount_total || 0),
	};
}

const initialState = {
	lastItemId: 0,
	cartId: null,
	qty: 0,
	items: [],
	subtotal: 0,
	tax: 0,
	is_service: false,
	discount_price: null,
	discount_type: null,
	discount_total: null,
	shipping: null,
	overweight: null,
	overweight_price: null,
	total: 0,
};

export default function cartReducer(state = initialState, action) {
	switch (action.type) {
		case CART_SET_ITEM:
			return getData(state, action.data);

		case CART_ADD_ITEM:
			return addItem(state, action.data);

		case CART_REMOVE_ITEM:
			return removeItem(state, action.data);

		case CART_UPDATE_QUANTITIES:
			return updateQuantities(state, action.quantities);

		case CART_ADD_ITEM_LOCAL:
			return addItemLocal(
				state,
				action.product,
				action.options,
				action.quantity,
				action.domain,
				action.price,
				action.stock
			);

		case CART_REMOVE_ITEM_LOCAL:
			return removeItemLocal(state, action.itemId, action.domain);

		case RESET_LOCAL_CART:
			return resetLocalCart(state);

		case AAD_LOCAL_CART_TO_DB:
			return addCartToDB(state, action.data);

		case CHANGING_SHIPPING_PRICE:
			return changeShippingPricing(state, action);

		case CART_UPDATE_OPTIONS_LOCAL:
			return updateCartOptionsLocal(state, action);

		default:
			return state;
	}
}
