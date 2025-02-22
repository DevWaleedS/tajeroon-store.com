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
import { Cross12Svg } from "../../svg";
import { wishlistRemoveItem } from "../../store/wishlist";
import {
	getFilterAttributes,
	getOptionsId,
	getOptionsPrice,
	getOptionsStock,
} from "../../Utilities/UtilitiesFunctions";
import ProductImage from "./ShopPageWishlist/ProductImage";

// data stubs

function ShopPageWishlist(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	const [calculatedPrices, setCalculatedPrices] = useState({});
	const [optionIds, setOptionIds] = useState({});

	const { wishlist, cartAddItem, wishlistRemoveItem, cartAddItemLocal } = props;
	const breadcrumb = [
		{ title: "الرئيسية", url: `/` },
		{ title: "المفضلة", url: "" },
	];

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

	useEffect(() => {
		const newPrices = {};
		const newOptionIds = {};
		props.wishlist.forEach((item) => {
			const options = getOptions(item);
			newPrices[item.id] = getOptionsPrice(item, options);
			newOptionIds[item.id] = getOptionsId(item, options);
		});
		setCalculatedPrices(newPrices);
		setOptionIds(newOptionIds);
	}, [props.wishlist]);

	const [productOptions, setProductOptions] = useState({});
	const [productStocks, setProductStocks] = useState({});

	useEffect(() => {
		const newProductOptions = {};
		const newProductStocks = {};
		props.wishlist.forEach((item) => {
			newProductOptions[item.id] = getOptions(item);
			newProductStocks[item.id] = getOptionsStock(
				item,
				newProductOptions[item.id]
			);
		});
		setProductOptions(newProductOptions);
		setProductStocks(newProductStocks);
	}, [props.wishlist]);

	let content;
	const itemsFilterList = wishlist?.filter((item) => item?.domain === domain);
	if (itemsFilterList?.length) {
		const itemsList = itemsFilterList?.map((item) => {
			let image;
			image = <ProductImage domain={domain} item={item} />;

			const renderAddToCarButton = (props) => {
				const { run, loading } = props;

				const classes = classNames("btn btn-primary btn-sm", {
					"btn-loading": loading,
				});

				return (
					<button
						type='button'
						onClick={run}
						className={classes}
						disabled={item?.stock === "0"}>
						اضافة إلى السلة
					</button>
				);
			};

			const renderRemoveButton = ({ run, loading }) => {
				const classes = classNames("btn btn-light btn-sm btn-svg-icon", {
					"btn-loading": loading,
				});

				return (
					<button
						type='button'
						onClick={run}
						className={classes}
						aria-label='Remove'>
						<Cross12Svg />
					</button>
				);
			};

			return (
				<tr key={item?.id} className='wishlist__row'>
					<td className='wishlist__column wishlist__column--image'>{image}</td>
					<td className='wishlist__column wishlist__column--product'>
						<Link
							to={{
								pathname: `/products/${encodeURIComponent(
									item?.name
										.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
										.toLowerCase()
								)}/${item?.id}`,
							}}
							className='wishlist__product-name'>
							{item?.name}
						</Link>
						<div className='wishlist__product-rating'>
							<Rating value={Number(item?.productRating)} />
							<div className='wishlist__product-rating-legend'>{`${item?.productRatingCount} تقييم`}</div>
						</div>
					</td>
					<td className='wishlist__column wishlist__column--stock'>
						{Number(item?.stock) > 0 ? (
							<div className='badge badge-success'>
								{Number(item?.stock) === 1
									? `قطعه واحدة`
									: Number(item?.stock) === 2
									? ` قطعتين`
									: `متوفر`}
							</div>
						) : (
							<div className='badge badge-danger'>غير متوفر</div>
						)}
					</td>
					<td className='wishlist__column wishlist__column--price'>
						<Currency
							value={
								item?.discount_price > 0
									? Number(item?.discount_price)
									: Number(item?.selling_price)
							}
						/>
					</td>
					<td className='wishlist__column wishlist__column--tocart'>
						{token ? (
							<AsyncAction
								action={() =>
									cartAddItem({
										product: item,
										optionid: optionIds[item.id],
										quantity: 1,
										price: calculatedPrices[item.id],
									})
								}
								render={renderAddToCarButton}
							/>
						) : (
							<AsyncAction
								action={() =>
									cartAddItemLocal({
										product: item,
										options: productOptions[item.id],
										quantity: 1,
										domain,
										price: calculatedPrices[item.id],
										stock: productStocks[item.id],
									})
								}
								render={renderAddToCarButton}
							/>
						)}
					</td>
					<td className='wishlist__column wishlist__column--remove'>
						<AsyncAction
							action={() => wishlistRemoveItem(item.id, domain)}
							render={renderRemoveButton}
						/>
					</td>
				</tr>
			);
		});

		content = (
			<div className='block'>
				<div className='container'>
					<table className='wishlist'>
						<thead className='wishlist__head'>
							<tr className='wishlist__row'>
								<th className='wishlist__column wishlist__column--image'>
									الصورة
								</th>
								<th className='wishlist__column wishlist__column--product'>
									اسم المنتج
								</th>
								<th className='wishlist__column wishlist__column--stock'>
									حالة المخزون
								</th>
								<th className='wishlist__column wishlist__column--price'>
									السعر
								</th>
								<th
									className='wishlist__column wishlist__column--tocart'
									aria-label='اضافة إلى السلة'
								/>
								<th
									className='wishlist__column wishlist__column--remove'
									aria-label='حذف'
								/>
							</tr>
						</thead>
						<tbody className='wishlist__body'>{itemsList}</tbody>
					</table>
				</div>
			</div>
		);
	} else {
		content = (
			<div className='block block-empty'>
				<div className='container'>
					<div className='block-empty__body'>
						<div className='block-empty__message'>قائمة المفضلة فارغة!</div>
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
				<title>{`المفضلة — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<PageHeader header='المفضلة' breadcrumb={breadcrumb} />

			{content}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	wishlist: state.wishlist,
});

const mapDispatchToProps = {
	cartAddItem,
	wishlistRemoveItem,
	cartAddItemLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageWishlist);
