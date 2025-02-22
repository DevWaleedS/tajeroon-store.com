// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import Rating from "../shared/Rating";
import { cartAddItem, cartAddItemLocal } from "../../store/cart";
import { compareRemoveItem } from "../../store/compare";
import {
	getOptionsId,
	getOptionsPrice,
	getOptionsStock,
} from "../../Utilities/UtilitiesFunctions";

function ShopPageCompare(props) {
	const [calculatedPrices, setCalculatedPrices] = useState({});
	const [optionIds, setOptionIds] = useState({});

	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	const { products, compareRemoveItem, cartAddItem, cartAddItemLocal } = props;
	const breadcrumb = [
		{ title: "الرئيسية", url: `/` },
		{ title: "مقارنة المنتجات ", url: "" },
	];

	const getOptionsPriceProduct = (product) => {
		const filteredArray = product?.options?.filter((optionItem) => {
			const nameAr = optionItem?.name?.ar;
			const nameParts = nameAr?.split(",");
			return product?.tags?.every((option) => nameParts?.includes(option));
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

	useEffect(() => {
		const newPrices = {};
		const newOptionIds = {};
		props.products.forEach((product) => {
			const options = product?.tags;
			newPrices[product.id] = getOptionsPrice(product, options);
			newOptionIds[product.id] = getOptionsId(product, options);
		});
		setCalculatedPrices(newPrices);
		setOptionIds(newOptionIds);
	}, [props.products]);

	let content;

	if (products?.length) {
		const attributes = [];

		products.forEach((product) =>
			product?.attributes?.forEach((productAttribute) => {
				let attribute = attributes.find(
					(x) => x?.name === productAttribute?.name
				);

				if (!attribute) {
					attribute = {
						name: productAttribute?.name,
					};
					attributes.push(attribute);
				}
			})
		);

		const productInfoRow = products?.map((product, index) => {
			let image;
			image = (
				<div className='compare-table__product-image product-image'>
					<div className='product-image__body'>
						<img
							className='product-image__img'
							src={product?.cover}
							alt={product.name}
						/>
					</div>
				</div>
			);

			return (
				<td key={index}>
					<Link
						to={{
							pathname: `/products/${encodeURIComponent(
								product?.name
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}/${product?.id}`,
						}}
						className='compare-table__product-link'>
						{image}
						<div className='compare-table__product-name'>{product?.name}</div>
					</Link>
				</td>
			);
		});

		const ratingRow = products?.map((product, index) => (
			<td key={index}>
				<div className='compare-table__product-rating'>
					<Rating value={Number(product?.productRating)} />
				</div>
				<div className=' compare-table__product-rating-legend'>{`${product?.productRatingCount} تقييم`}</div>
			</td>
		));

		const availabilityRow = products?.map((product, index) => {
			let badge;

			if (Number(product?.stock) > 0) {
				badge = (
					<span className='compare-table__product-badge badge badge-success'>
						متوفر
					</span>
				);
			} else {
				badge = (
					<span className='compare-table__product-badge badge badge-danger'>
						غير متوفر
					</span>
				);
			}

			return <td key={index}>{badge}</td>;
		});

		const priceRow = products?.map((product, index) => (
			<td key={index}>
				<Currency value={Number(getOptionsPriceProduct(product))} />
			</td>
		));

		const addToCartRow = products?.map((product, index) => {
			const renderButton = ({ run, loading }) => {
				const classes = classNames("btn btn-primary mx-auto", {
					"btn-loading": loading,
				});

				return (
					<button
						type='button'
						onClick={run}
						className={classes}
						disabled={product?.stock === "0"}>
						اضافة إلى السلة
					</button>
				);
			};

			return (
				<td key={index}>
					{token ? (
						<AsyncAction
							action={() =>
								cartAddItem({
									product,
									optionid: optionIds[product.id],
									quantity: 1,
									price: calculatedPrices[product.id],
								})
							}
							render={renderButton}
						/>
					) : (
						<AsyncAction
							action={() =>
								cartAddItemLocal(
									product,
									product?.tags,
									1,
									domain,
									calculatedPrices[product.id],
									getOptionsStock(product, product?.tags)
								)
							}
							render={renderButton}
						/>
					)}
				</td>
			);
		});

		const attributeRows = attributes?.map((feature, index) => {
			const rows = products?.map((product, Productindex) => (
				<td key={Productindex}>{product?.tags?.[index]}</td>
			));

			return (
				<tr key={index}>
					<th>{feature?.name}</th>
					{rows}
				</tr>
			);
		});

		const removeRow = products?.map((product, index) => {
			const renderButton = ({ run, loading }) => {
				const classes = classNames("btn btn-secondary btn-sm mx-auto", {
					"btn-loading": loading,
				});

				return (
					<button type='button' onClick={run} className={classes}>
						حذف
					</button>
				);
			};

			return (
				<td key={index}>
					<AsyncAction
						action={() => compareRemoveItem(product?.id, product?.tags, domain)}
						render={renderButton}
					/>
				</td>
			);
		});

		content = (
			<div className='block'>
				<div className='container'>
					<div className='table-responsive'>
						<table className='compare-table'>
							<tbody>
								<tr>
									<th>المنتج</th>
									{productInfoRow}
								</tr>
								<tr>
									<th>التقييم</th>
									{ratingRow}
								</tr>
								<tr>
									<th>المخزون</th>
									{availabilityRow}
								</tr>
								<tr>
									<th>السعر</th>
									{priceRow}
								</tr>
								<tr>
									<th>اضافة إلى السلة</th>
									{addToCartRow}
								</tr>
								{attributeRows}
								<tr>
									<th aria-label='Remove' />
									{removeRow}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	} else {
		content = (
			<div className='block block-empty'>
				<div className='container'>
					<div className='block-empty__body'>
						<div className='block-empty__message'>
							لم تقم باختيار أي منتجات للمقارنة!
						</div>
						<div className='block-empty__actions'>
							<Link to={`/`} className='btn btn-primary btn-sm'>
								استمرار
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{`مقارنة المنتجات — ${localStorage.getItem(
					"store-name"
				)}`}</title>
			</Helmet>

			<PageHeader header='مقارنة المنتجات ' breadcrumb={breadcrumb} />

			{content}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	products: state.compare,
});

const mapDispatchToProps = {
	cartAddItem,
	compareRemoveItem,
	cartAddItemLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCompare);
