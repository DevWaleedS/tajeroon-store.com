import { toast } from "react-toastify";
import { WISHLIST_ADD_ITEM, WISHLIST_REMOVE_ITEM } from "./wishlistActionTypes";
const getDomain = process.env.REACT_APP_STORE_DOMAIN;

export function wishlistAddItemSuccess(product, domain) {
	if (getDomain === domain) {
		toast.success(`تم إضافة  "${product.name}"للمفضلة`, { theme: "colored" });

		return {
			type: WISHLIST_ADD_ITEM,
			product,
			domain,
		};
	} else {
		toast.error(`لايمكن إضافة  "${product.name}"للمفضلة هناك مشكلة ما!`, {
			theme: "colored",
		});
		return {
			type: "",
		};
	}
}

export function wishlistRemoveItemSuccess(productId, domain) {
	if (getDomain === domain) {
		return {
			type: WISHLIST_REMOVE_ITEM,
			productId,
		};
	} else {
		return {
			type: "",
		};
	}
}

export function wishlistAddItem(product, domain) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(wishlistAddItemSuccess(product, domain));
				resolve();
			}, 500);
		});
}

export function wishlistRemoveItem(productId, domain) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(wishlistRemoveItemSuccess(productId, domain));
				resolve();
			}, 500);
		});
}
