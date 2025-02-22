import React from "react";
import ShopServicesCart from "./ShopServicesCart";
import ShopPageCart from "./ShopPageCart";
import { useLocation } from "react-router-dom";

const ShopCart = () => {
	const location = useLocation();
	const is_service = location?.state?.is_service;

	return <>{is_service ? <ShopServicesCart /> : <ShopPageCart />}</>;
};

export default ShopCart;
