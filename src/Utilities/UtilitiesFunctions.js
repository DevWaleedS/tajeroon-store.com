import axios from "axios";
import { toast } from "react-toastify";

// :: => Send Form Data
export const SendFormData = async (url, formData) => {
	const token = localStorage.getItem("token");
	const headers = {
		"Content-Type": "multipart/form-data",
		Authorization: `Bearer ${token}`,
	};
	try {
		const response = await axios.post(url, formData, { headers });
		return response;
	} catch (error) {
		const errors = error?.response?.data?.errors;
		if (errors) {
			Object.entries(errors).forEach(([key, message]) => {
				toast.error(message[0], { theme: "colored" });
			});
		}
		toast.error(error?.response?.data?.message || "An error occurred", {
			theme: "colored",
		});
		return null;
	}
};

// :: => Find Matching SubArray
export const findMatchingSubArray = (nestedArray, array) => {
	for (let i = 0; i < nestedArray?.length; i++) {
		const subArray = nestedArray[i];
		const subArrayValue = subArray?.name?.ar;

		if (array?.every((value) => subArrayValue?.includes(value))) {
			return {
				id: subArray?.id,
				price: subArray?.price,
				discount_price: subArray?.discount_price,
				quantity: subArray?.quantity,
			};
		}
	}

	return null;
};

// :: => Remove Duplicates
export const removeDuplicates = (arr) => {
	const unique = arr?.filter((obj, index) => {
		return (
			index ===
			arr?.findIndex((o) => obj?.region?.name_en === o?.region?.name_en)
		);
	});
	return unique;
};

// :: => Get City From Province
export const getCityFromProvinceFunc = (cities, shipping) => {
	const cityFromProvince =
		cities?.filter((obj) => obj?.region?.name_en === shipping?.district) || [];
	return cityFromProvince;
};

// :: => Translate City Name
export const translateCityNameFunc = (cities, addressCity) => {
	const unique = cities?.filter((obj) => obj?.name_en === addressCity);
	return unique?.[0]?.name || addressCity;
};

// :: => Get Filter Attributes
export const getFilterAttributes = (product) => {
	const optionValues = product?.options?.map((option) =>
		Object?.values(option?.name)?.[0]?.split(",")
	);
	const filteredAttributes = product?.attributes?.map((attribute) => {
		const filteredValues = attribute?.values?.filter((value) =>
			optionValues?.some((optionValue) =>
				optionValue?.includes(value?.value?.[0])
			)
		);
		return { ...attribute, values: filteredValues };
	});

	return filteredAttributes;
};

// :: => Get Options By Id
export const getOptionsId = (product, array) => {
	const filteredArray = product?.options?.filter((optionItem) => {
		const nameAr = optionItem?.name?.ar;
		const nameParts = nameAr?.split(",");
		return array?.every((option) => nameParts?.includes(option));
	});
	if (filteredArray?.length > 0) {
		return Number(filteredArray?.[0]?.id);
	} else {
		return null;
	}
};

// :: => Get Options By Price
export const getOptionsPrice = (product, array) => {
	const filteredArray = product?.options?.filter((optionItem) => {
		const nameAr = optionItem?.name?.ar;
		const nameParts = nameAr?.split(",");
		return array?.every((option) => nameParts?.includes(option));
	});
	if (filteredArray?.length > 0) {
		return Number(filteredArray?.[0]?.discount_price) > 0
			? Number(filteredArray?.[0]?.discount_price)
			: Number(filteredArray?.[0]?.price);
	} else {
		return Number(product?.discount_price) > 0
			? Number(product?.discount_price)
			: Number(product?.selling_price);
	}
};

// :: => Get Options By Stock
export const getOptionsStock = (product, array) => {
	const filteredArray = product?.options?.filter((optionItem) => {
		const nameAr = optionItem?.name?.ar;
		const nameParts = nameAr?.split(",");
		return array?.every((option) => nameParts?.includes(option));
	});
	if (filteredArray?.length > 0) {
		return Number(filteredArray?.[0]?.quantity);
	} else {
		return Number(product?.stock);
	}
};
