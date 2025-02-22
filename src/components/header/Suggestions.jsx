// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import { Cart16Svg } from "../../svg";
import { cartAddItem, cartAddItemLocal } from "../../store/cart";
import {
	getFilterAttributes,
	getOptionsId,
	getOptionsPrice,
	getOptionsStock,
} from "../../Utilities/UtilitiesFunctions";

function Suggestions(props) {
	const [optionId, setOptionId] = useState(null);
	const [calculatedPrice, setCalculatedPrice] = useState(0);
	const [productOptions, setProductOptions] = useState({});
	const [productStocks, setProductStocks] = useState({});

	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	const { context, className, products, cartAddItem, cartAddItemLocal } = props;
	const rootClasses = classNames(
		`suggestions suggestions--location--${context}`,
		className
	);

	/* using useCallback to avoid re-rendering */
	const getOptions = React.useCallback((product) => {
		const attributesName = getFilterAttributes(product?.attributes)?.map(
			(attribute) => {
				const filteredValues = attribute?.values?.filter(
					(item) => item?.value?.[1] === "1"
				);
				return filteredValues.length > 0 ? filteredValues : attribute?.values;
			}
		);
		if (attributesName?.length > 0) {
			return attributesName?.map((attribute) => attribute?.[0]?.value?.[0]);
		} else {
			return [];
		}
	}, []);

	/* using useEffect to update the calculated price and optionId when the product or attributes change */

	useEffect(() => {
		const products = props.products || [];
		products.forEach((product) => {
			const optionsPrice = getOptionsPrice(product, getOptions(product));
			const optionsId = getOptionsId(product, getOptions(product));
			// Store these values in a way that associates them with each product
			setOptionId(optionsId);
			setCalculatedPrice(optionsPrice);
		});
	}, [props.products, getOptions]);

	useEffect(() => {
		const newProductOptions = {};
		products.forEach((product) => {
			newProductOptions[product.id] = getOptions(product);
		});
		setProductOptions(newProductOptions);
	}, [products, getOptions]);

	useEffect(() => {
		const newProductStocks = {};
		products.forEach((product) => {
			newProductStocks[product.id] = getOptionsStock(
				product,
				productOptions[product.id]
			);
		});
		setProductStocks(newProductStocks);
	}, [products, productOptions]);

	const list =
		products &&
		products?.map((product) => (
			<li key={product?.id} className='suggestions__item'>
				{product.cover && (
					<div className='suggestions__item-image product-image'>
						<div className='product-image__body'>
							<img
								className='product-image__img'
								src={product.cover}
								alt={product.name}
							/>
						</div>
					</div>
				)}
				<div className='suggestions__item-info'>
					<Link
						className='suggestions__item-name'
						to={{
							pathname: `/products/${encodeURIComponent(
								product?.name
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}/${product?.id}`,
						}}>
						{product?.name}
					</Link>
				</div>
				<div className='suggestions__item-price'>
					{Number(product?.discount_price) > 0 ? (
						<React.Fragment>
							<span className='suggestions__item-price-new'>
								<Currency value={Number(product?.discount_price) || 0} />
							</span>
							<span className='suggestions__item-price-old'>
								<Currency value={Number(product?.selling_price) || 0} />
							</span>
						</React.Fragment>
					) : (
						<Currency value={Number(product?.selling_price) || 0} />
					)}
				</div>
				{context === "header" && (
					<div className='suggestions__item-actions'>
						{token ? (
							<AsyncAction
								action={() =>
									cartAddItem({
										product,
										optionid: optionId,
										quantity: 1,
										price: calculatedPrice,
									})
								}
								render={({ run, loading }) => (
									<button
										type='button'
										onClick={run}
										title='اضافة إلى السلة'
										className={classNames(
											"btn btn-primary btn-sm btn-svg-icon",
											{
												"btn-loading": loading,
											}
										)}
										disabled={product?.stock === "0"}>
										<Cart16Svg />
									</button>
								)}
							/>
						) : (
							<AsyncAction
								action={() =>
									cartAddItemLocal({
										product,
										options: productOptions,
										quantity: 1,
										domain,
										price: calculatedPrice,
										stock: productStocks[product.id],
									})
								}
								render={({ run, loading }) => (
									<button
										type='button'
										onClick={run}
										title='اضافة إلى السلة'
										className={classNames(
											"btn btn-primary btn-sm btn-svg-icon",
											{
												"btn-loading": loading,
											}
										)}
										disabled={product?.stock === "0"}>
										<Cart16Svg />
									</button>
								)}
							/>
						)}
					</div>
				)}
			</li>
		));

	return (
		<div className={rootClasses}>
			<ul className='suggestions__list'>{list}</ul>
		</div>
	);
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
	cartAddItem,
	cartAddItemLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
