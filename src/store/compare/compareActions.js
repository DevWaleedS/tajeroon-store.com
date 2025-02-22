import { toast } from "react-toastify";
import { COMPARE_ADD_ITEM, COMPARE_REMOVE_ITEM } from "./compareActionTypes";
const getDomain = process.env.REACT_APP_STORE_DOMAIN;

export function compareAddItemSuccess(product, options, domain) {
	if (getDomain === domain) {
		toast.success(`تم إضافة  "${product.name}"للمقارنة`, { theme: "colored" });

		return {
			type: COMPARE_ADD_ITEM,
			product,
			options,
			domain,
		};
	} else {
		toast.error(`لايمكن إضافة  "${product.name}"للمقارنة هناك مشكلة ما!`, {
			theme: "colored",
		});
		return {
			type: "",
		};
	}
}

export function compareRemoveItemSuccess(productId, options, domain) {
	if (getDomain === domain) {
		return {
			type: COMPARE_REMOVE_ITEM,
			productId,
			options,
		};
	} else {
		return {
			type: "",
		};
	}
}

export function compareAddItem(product, options, domain) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(compareAddItemSuccess(product, options, domain));
				resolve();
			}, 500);
		});
}

export function compareRemoveItem(productId, options, domain) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(compareRemoveItemSuccess(productId, options, domain));
				resolve();
			}, 500);
		});
}
