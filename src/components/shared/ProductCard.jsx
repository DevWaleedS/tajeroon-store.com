// react
import React, { useState, useEffect } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// application
import AsyncAction from "./AsyncAction";
import Currency from "./Currency";
import Rating from "./Rating";
import { cartAddItem, cartAddItemLocal } from "../../store/cart";
import { Compare16Svg, Quickview16Svg, Wishlist16Svg } from "../../svg";
import { compareAddItem } from "../../store/compare";
import { quickviewOpen } from "../../store/quickview";
import { wishlistAddItem } from "../../store/wishlist";
import {
	getOptionsId,
	getOptionsPrice,
	getOptionsStock,
} from "../../Utilities/UtilitiesFunctions";

function ProductCard(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const history = useHistory();
	const token = localStorage.getItem("token");
	const {
		product,
		layout,
		quickviewOpen,
		cartAddItem,
		wishlistAddItem,
		compareAddItem,
		cartAddItemLocal,
	} = props;
	const [attributes, setAttributes] = useState([]);
	const [optionId, setOptionId] = useState(null);
	const [calculatedPrice, setCalculatedPrice] = useState(0);
	const [productOptions, setProductOptions] = useState({});
	const [productStocks, setProductStocks] = useState({});

	useEffect(() => {
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

		setAttributes(filteredAttributes);
	}, []);

	useEffect(() => {
		const options = getOptions(product);
		setProductOptions(options);
		setProductStocks(getOptionsStock(product, options));
		setCalculatedPrice(getOptionsPrice(product, options));
		setOptionId(getOptionsId(product, options));
	}, [product]);

	let badges = [];
	let image;
	let price;
	let features;

	if (Number(product?.stock) === 0) {
		badges.push(
			<div key='sale' className='product-card__badge product-card__badge--sale'>
				غير متوفر
			</div>
		);
	}
	if (Number(product?.stock) === 1) {
		badges.push(
			<div key='new' className='product-card__badge product-card__badge--new'>
				آخر قطعة
			</div>
		);
	}

	const containerClasses = classNames("product-card", {
		"product-card--layout--grid product-card--size--sm": layout === "grid-sm",
		"product-card--layout--grid product-card--size--nl": layout === "grid-nl",
		"product-card--layout--grid product-card--size--lg": layout === "grid-lg",
		"product-card--layout--list": layout === "list",
		"product-card--layout--horizontal": layout === "horizontal",
	});

	badges = badges?.length ? (
		<div className='product-card__badges-list'>{badges}</div>
	) : null;

	if (product?.cover) {
		image = (
			<div className='product-card__image product-image'>
				<h3
					onClick={() =>
						history.push({
							pathname: `/products/${encodeURIComponent(
								product.name
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}/${product?.id}`,
						})
					}
					className='product-image__body'>
					<img
						className='product-image__img'
						src={product?.cover}
						alt={product?.name}
					/>
				</h3>
			</div>
		);
	}

	if (Number(product?.discount_price) > 0) {
		price = (
			<div className='product-card__prices'>
				<span className='product-card__new-price'>
					<Currency value={Number(product?.discount_price) || 0} />
				</span>
				<span className='product-card__old-price'>
					<Currency value={Number(product?.selling_price) || 0} />
				</span>
			</div>
		);
	} else {
		price = (
			<div className='product-card__prices'>
				<Currency value={Number(product?.selling_price) || 0} />
			</div>
		);
	}

	if (attributes && attributes?.length) {
		features = (
			<ul className='product-card__features-list'>
				{attributes?.map((attribute, index) => (
					<li key={index}>{`${attribute?.name} : ${attribute?.values
						?.map((x) => x?.value?.[0])
						?.join(" , ")}`}</li>
				))}
			</ul>
		);
	}

	/* using useCallback to avoid re-rendering */
	const getOptions = React.useCallback(() => {
		const attributesName = attributes?.map((attribute) => {
			const filteredValues = attribute?.values?.filter(
				(item) => item?.value?.[1] === "1"
			);
			return filteredValues.length > 0 ? filteredValues : attribute?.values;
		});
		if (attributesName?.length > 0) {
			return attributesName?.map((attribute) => attribute?.[0]?.value?.[0]);
		} else {
			return [];
		}
	}, [attributes]);

	/* using useEffect to update the calculated price and optionId when the product or attributes change */

	useEffect(() => {
		const optionsPrice = getOptionsPrice(product, getOptions());
		setCalculatedPrice(optionsPrice);

		const optionsId = getOptionsId(product, getOptions());
		setOptionId(optionsId);
	}, [product, getOptions]);

	return (
		<div className={containerClasses}>
			<AsyncAction
				action={() => quickviewOpen(product?.id)}
				render={({ run, loading }) => (
					<button
						type='button'
						onClick={run}
						className={classNames("product-card__quickview", {
							"product-card__quickview--preload": loading,
						})}>
						<Quickview16Svg />
					</button>
				)}
			/>
			{badges}
			{image}
			<div className='product-card__info'>
				<div className='product-card__name'>
					<h3
						onClick={() =>
							history.push({
								pathname: `/products/${encodeURIComponent(
									product.name
										.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
										.toLowerCase()
								)}/${product?.id}`,
							})
						}>
						{product.name}
					</h3>
					<div className='buttons'>
						<AsyncAction
							action={() => wishlistAddItem(product, domain)}
							render={({ run, loading }) => (
								<button
									type='button'
									onClick={run}
									className={classNames(
										"btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist",
										{
											"btn-loading": loading,
										}
									)}>
									<Wishlist16Svg />
								</button>
							)}
						/>
						<AsyncAction
							action={() => compareAddItem(product, getOptions(), domain)}
							render={({ run, loading }) => (
								<button
									type='button'
									onClick={run}
									className={classNames(
										"btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__compare",
										{
											"btn-loading": loading,
										}
									)}>
									<Compare16Svg />
								</button>
							)}
						/>
					</div>
				</div>
				<div className='product-card__rating'>
					<Rating value={Number(product?.productRating)} />
					<div className=' product-card__rating-legend'>{`${product?.productRatingCount} تقييم`}</div>
				</div>
				{features}
			</div>
			<div className='product-card__actions'>
				<div className='product-card__availability'>
					المخزون:
					{Number(product?.stock) === 0 ? (
						<span className='text-danger'>غير متوفر</span>
					) : Number(product?.stock) === 1 ? (
						<span className='text-success'>قطعه واحدة</span>
					) : Number(product?.stock) === 2 ? (
						<span className='text-success'>قطعتين</span>
					) : Number(product?.stock) === 3 ? (
						<span className='text-success'>ثلاث قطع</span>
					) : (
						<span className='text-success'>متوفر</span>
					)}
				</div>
				{price}
				<span className='tax-text'>السعر شامل الضريبة</span>
				<div className='product-card__buttons'>
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
								<React.Fragment>
									<button
										type='button'
										onClick={run}
										className={classNames(
											"btn btn-primary product-card__addtocart",
											{
												"btn-loading": loading,
											}
										)}
										disabled={product?.stock === "0"}>
										اضافة إلى السلة
									</button>
								</React.Fragment>
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
									stock: productStocks,
								})
							}
							render={({ run, loading }) => (
								<React.Fragment>
									<button
										type='button'
										onClick={run}
										className={classNames(
											"btn btn-primary product-card__addtocart",
											{
												"btn-loading": loading,
											}
										)}
										disabled={product?.stock === "0"}>
										اضافة إلى السلة
									</button>
								</React.Fragment>
							)}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

ProductCard.propTypes = {
	/**
	 * product object
	 */
	product: PropTypes.object.isRequired,
	/**
	 * product card layout
	 * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
	 */
	layout: PropTypes.oneOf([
		"grid-sm",
		"grid-nl",
		"grid-lg",
		"list",
		"horizontal",
	]),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
	cartAddItem,
	wishlistAddItem,
	compareAddItem,
	quickviewOpen,
	cartAddItemLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
