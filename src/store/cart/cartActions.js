import axios from "axios";
import { toast } from "react-toastify";

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
import { findMatchingSubArray } from "../../Utilities/UtilitiesFunctions";

export function cartUpdateQuantitiesSuccess(quantities, domain) {
	if (domain) {
		return {
			type: CART_UPDATE_QUANTITIES,
			quantities,
		};
	}
}

export function cartAddItemSuccess(
	product,
	options = [],
	quantity = 1,
	domain,
	price,
	stock,
	is_service
) {
	if (domain) {
		toast.success(`منتج "${product.name}" تمت اضافته للسلة !`, {
			theme: "colored",
		});

		return {
			type: CART_ADD_ITEM_LOCAL,
			product,
			options,
			quantity,
			domain,
			price,
			stock,
			is_service,
		};
	} else {
		toast.error(`لايمكن إضافتة  "${product.name}"للسلة هناك مشكلة ما!`, {
			theme: "colored",
		});
		return {
			type: "",
		};
	}
}

export function cartAddItemLocal({
	product,
	options = [],
	quantity = 1,
	domain,
	price,
	stock,
	is_service,
}) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(
					cartAddItemSuccess(
						product,
						options,
						quantity,
						domain,
						price,
						stock,
						is_service
					)
				);
				resolve();
			}, 500);
		});
}

export function cartRemoveItemLocal(itemId, domain) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(cartRemoveItemSuccess(itemId, domain));
				resolve();
			}, 500);
		});
}

export function cartUpdateQuantities(quantities, domain) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(cartUpdateQuantitiesSuccess(quantities, domain));
				resolve();
			}, 500);
		});
}

export function cartRemoveItemSuccess(itemId, domain) {
	if (domain) {
		return {
			type: CART_REMOVE_ITEM_LOCAL,
			itemId,
		};
	} else {
		return {
			type: "",
		};
	}
}

export function cartAddItem({
	product,
	is_service,
	optionid = null,
	serviceOption = null,
	quantity = 1,
	price,
	period,
	hours,
}) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	let formData = new FormData();
	const token = localStorage.getItem("token");
	formData.append("data[0][id]", product?.id);
	formData.append("data[0][price]", price);
	if (is_service) {
		formData.append("data[0][period]", period);
		formData.append("data[0][hours]", hours);
		formData.append("is_service", is_service);

		if (serviceOption !== null) {
			serviceOption.forEach((item, idx) => {
				formData.append(`data[0]value[${idx}]`, item);
			});
		}
	}
	formData.append("data[0][qty]", quantity);

	if (optionid !== null && !is_service) {
		formData.append("data[0][option_id]", optionid);
	}

	let resultData = null;
	return async function (dispatch) {
		try {
			const response = await axios.post(
				`https://backend.atlbha.sa/api/addCart/${store_domain}`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);
			if (
				response?.data?.success === true &&
				response?.data?.message?.en === "Cart Added successfully"
			) {
				toast.success(`تم إضافة  "${product?.name}" للسلة `, {
					theme: "colored",
				});
				resultData = response?.data?.data;
			} else {
				toast.error(response?.data?.message?.ar, { theme: "colored" });
			}
		} catch (err) {
			toast.error(err, { theme: "colored" });
		}
		dispatch({
			type: CART_ADD_ITEM,
			data: resultData,
		});
	};
}

export function cartRemoveItem(itemId) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	let resultData = null;
	return async function (dispatch) {
		try {
			const response = await axios.get(
				`https://backend.atlbha.sa/api/deleteCart/${store_domain}/${itemId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);
			if (response?.data?.success === true) {
				resultData = response?.data?.data;
			}
		} catch (err) {
			toast.error(err, { theme: "colored" });
		}
		dispatch({
			type: CART_REMOVE_ITEM,
			data: resultData,
		});
	};
}

export function fetchCartData() {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	let resultData = null;
	return async function (dispatch) {
		try {
			const response =
				token &&
				(await axios.get(
					`https://backend.atlbha.sa/api/cartShow/${store_domain}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
							store_domain: store_domain,
						},
					}
				));
			resultData = response?.data?.data?.cart;
		} catch (err) {
			toast.error(err, { theme: "colored" });
		}
		dispatch({
			type: CART_SET_ITEM,
			data: resultData,
		});
	};
}

export function resetCartLocal() {
	return {
		type: RESET_LOCAL_CART,
	};
}

export function addLocalCartToDB(cartData) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	let formData = new FormData();
	const token = localStorage.getItem("token");
	for (let i = 0; i < cartData?.items?.length; i++) {
		formData.append([`data[${i}][id]`], cartData?.items[i]?.product?.id);
		formData.append([`data[${i}][price]`], cartData?.items[i]?.price);
		formData.append([`data[${i}][qty]`], cartData?.items[i]?.qty);
		formData.append([`data[${i}][is_service]`], cartData?.items[i]?.is_service);
		const optionNames = cartData?.items[i]?.product?.options?.map(
			(option) => option
		);
		if (optionNames?.length > 0) {
			const matchingSubArray = findMatchingSubArray(
				optionNames,
				cartData?.items[i]?.options
			);
			formData.append([`data[${i}][option_id]`], Number(matchingSubArray?.id));
		}
	}
	let resultData = null;
	return async function (dispatch) {
		try {
			const response = await axios.post(
				`https://backend.atlbha.sa/api/addCart/${store_domain}`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);
			if (response?.data?.success === true) {
				resultData = response?.data?.data;
			}
		} catch (err) {
			toast.error(err, { theme: "colored" });
		}
		dispatch({
			type: AAD_LOCAL_CART_TO_DB,
			data: resultData,
		});
	};
}

export function UpdateCartQuantities(cartData) {
	console.log(cartData);
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	localStorage.setItem("btn_loading", false);
	let formData = new FormData();
	const token = localStorage.getItem("token");
	for (let i = 0; i < cartData?.length; i++) {
		formData.append([`data[${i}][id]`], cartData?.[i]?.product?.id);
		formData.append([`data[${i}][price]`], cartData?.[i]?.price);
		formData.append([`data[${i}][qty]`], cartData?.[i]?.qty);
		formData.append([`data[${i}][item]`], Number(cartData?.[i]?.id));
		formData.append([`data[${i}][is_service]`], cartData?.[i]?.is_service);
		if (cartData?.[i]?.options) {
			formData.append([`data[${i}][option_id]`], cartData?.[i]?.options);
		}
	}
	let resultData = null;
	return async function (dispatch) {
		try {
			localStorage.setItem("btn_loading", true);
			const response = await axios.post(
				`https://backend.atlbha.sa/api/addCart/${store_domain}`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);
			if (response?.data?.success === true) {
				resultData = response?.data?.data;
				toast.success("تم تحديث السلة بنجاح", { theme: "colored" });
				localStorage.setItem("btn_loading", false);
			}
		} catch (err) {
			toast.error(err, { theme: "colored" });
			localStorage.setItem("btn_loading", false);
		}
		dispatch({
			type: AAD_LOCAL_CART_TO_DB,
			data: resultData,
		});
	};
}

export function changeShippingPrice(shipping_price) {
	return {
		type: CHANGING_SHIPPING_PRICE,
		shipping_price: shipping_price,
	};
}

export function updateOptionsLocal(products, domain) {
	// sending request to server, timeout is used as a stub
	return (dispatch) =>
		new Promise((resolve) => {
			setTimeout(() => {
				dispatch(updateOptionsLocalSuccess(products, domain));
				resolve();
			}, 500);
		});
}

export function updateOptionsLocalSuccess(products, domain) {
	if (domain) {
		return {
			type: CART_UPDATE_OPTIONS_LOCAL,
			products,
		};
	}
}

export function updateOptions(products) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	localStorage.setItem("btn_loading", false);
	let formData = new FormData();
	const token = localStorage.getItem("token");
	for (let i = 0; i < products?.length; i++) {
		formData.append([`data[${i}][id]`], Number(products?.[i]?.product?.id));
		formData.append([`data[${i}][price]`], Number(products?.[i]?.price));
		formData.append([`data[${i}][qty]`], Number(products?.[i]?.qty));
		formData.append([`data[${i}][item]`], Number(products?.[i]?.id));

		const optionNames = products?.[i]?.product?.options?.map(
			(option) => option
		);
		if (optionNames?.length > 0) {
			const matchingSubArray = findMatchingSubArray(
				optionNames,
				products?.[i]?.options
			);
			formData.append([`data[${i}][option_id]`], Number(matchingSubArray?.id));
		}
	}
	let resultData = null;
	return async function (dispatch) {
		try {
			localStorage.setItem("btn_loading", true);
			const response = await axios.post(
				`https://backend.atlbha.sa/api/addCart/${store_domain}`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);
			if (response?.data?.success === true) {
				resultData = response?.data?.data;
				toast.success("تم تحديث السلة بنجاح", { theme: "colored" });
				localStorage.setItem("btn_loading", false);
			}
		} catch (err) {
			toast.error(err, { theme: "colored" });
			localStorage.setItem("btn_loading", false);
		}
		dispatch({
			type: AAD_LOCAL_CART_TO_DB,
			data: resultData,
		});
	};
}
