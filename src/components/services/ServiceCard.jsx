// react
import React, { useState, useEffect } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import Rating from "../shared/Rating";
import { cartAddItem, cartAddItemLocal } from "../../store/cart";
import { Compare16Svg, Quickview16Svg, Wishlist16Svg } from "../../svg";
import { compareAddItem } from "../../store/compare";
import { quickviewOpen } from "../../store/quickview";
import { wishlistAddItem } from "../../store/wishlist";

function ServiceCard(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const history = useHistory();
	const token = localStorage.getItem("token");
	const {
		service,
		layout,
		quickviewOpen,
		cartAddItem,
		wishlistAddItem,
		compareAddItem,
		cartAddItemLocal,
	} = props;
	const containerClasses = classNames("product-card", {
		"product-card--layout--grid product-card--size--sm": layout === "grid-sm",
		"product-card--layout--grid product-card--size--nl": layout === "grid-nl",
		"product-card--layout--grid product-card--size--lg": layout === "grid-lg",
		"product-card--layout--list": layout === "list",
		"product-card--layout--horizontal": layout === "horizontal",
	});
	const [attributes, setAttributes] = useState([]);

	useEffect(() => {
		const optionValues = service?.attributes?.map((option) => option?.name);

		const filteredAttributes = service?.attributes?.map((attribute) => {
			const filteredValues = attribute?.values?.filter((value) =>
				optionValues?.some((optionValue) =>
					optionValue?.includes(value?.value?.[0])
				)
			);
			return { ...attribute, values: filteredValues };
		});

		setAttributes(filteredAttributes);
	}, []);

	let image;
	let price;
	let features;

	if (service?.cover) {
		image = (
			<div className='product-card__image product-image'>
				<h3
					onClick={() =>
						history.push({
							pathname: `/services/${service?.id}/${encodeURIComponent(
								service.name
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}`,
						})
					}
					className='product-image__body'>
					<img
						className='product-image__img'
						src={service?.cover}
						alt={service?.name}
					/>
				</h3>
			</div>
		);
	}

	if (Number(service?.discount_price) > 0) {
		price = (
			<div className='product-card__prices'>
				<span className='product-card__new-price'>
					<Currency value={Number(service?.discount_price) || 0} />
				</span>
				<span className='product-card__old-price'>
					<Currency value={Number(service?.selling_price) || 0} />
				</span>
			</div>
		);
	} else {
		price = (
			<div className='product-card__prices'>
				<Currency value={Number(service?.selling_price) || 0} />
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

	const getOptions = () => {
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
	};

	// handle period by days
	const handlePeriodByDays = (period, hours) => {
		const numPeriod = Number(period);
		const numHours = Number(hours);

		if (numPeriod === 1) return <span className='text-success'>يوم واحد</span>;
		if (numPeriod === 1 && numHours === 1)
			return <span className='text-success'>يوم و ساعة</span>;

		if (numPeriod === 2) return <span className='text-success'>يومين</span>;
		if (numPeriod === 2 && numHours === 2)
			return <span className='text-success'>يومين و ساعتين</span>;
		if (numPeriod >= 3 && numPeriod <= 10)
			return <span className='text-success'>{period} أيام</span>;

		if (numPeriod >= 3 && numPeriod <= 10 && numHours >= 3 && numHours <= 10)
			return (
				<span className='text-success'>
					{" "}
					ساعات {hours} و {period} أيام
				</span>
			);

		return period && !hours ? (
			<span className='text-success'>{period} يوم</span>
		) : !period && hours ? (
			<span className='text-success'>{hours} ساعة</span>
		) : (
			<span className='text-success'>
				{" "}
				ساعة {hours} و {period} يوم
			</span>
		);
	};

	// handle period by hours
	const handlePeriodByHours = (hours) => {
		const numPeriod = Number(hours);
		if (numPeriod === 1)
			return <span className='text-success'>ساعة واحدة</span>;
		if (numPeriod === 2) return <span className='text-success'>ساعتين</span>;
		if (numPeriod >= 3 && numPeriod <= 10)
			return <span className='text-success'>{hours} ساعات</span>;
		return <span className='text-success'>{hours} ساعة</span>;
	};

	return (
		<div className={containerClasses}>
			<AsyncAction
				action={() => quickviewOpen(service?.id)}
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

			{image}
			<div className='product-card__info'>
				<div className='product-card__name'>
					<h3
						onClick={() =>
							history.push({
								pathname: `/services/${service?.id}/${encodeURIComponent(
									service.name
										.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
										.toLowerCase()
								)}`,
							})
						}>
						{service.name}
					</h3>
					<div className='buttons'>
						<AsyncAction
							action={() => wishlistAddItem(service, domain)}
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
							action={() => compareAddItem(service, getOptions(), domain)}
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
					<Rating value={Number(service?.productRating)} />
					<div className=' product-card__rating-legend'>{`${service?.productRatingCount} تقييم`}</div>
				</div>
				{features}
			</div>
			<div className='product-card__actions'>
				{service?.period && service?.hours ? (
					<div className='product__availability'>
						مدة التنفيذ : {handlePeriodByDays(service?.period)}
						<span className='text-success'> و </span>
						{handlePeriodByHours(service?.hours)}
					</div>
				) : service?.period && !service?.hours ? (
					<div className='product__availability'>
						مدة التنفيذ : {handlePeriodByDays(service?.period)}
					</div>
				) : !service?.period && service?.hours ? (
					<div className='product__availability'>
						مدة التنفيذ : {handlePeriodByHours(service?.hours)}
					</div>
				) : null}

				{price}
				<span className='tax-text'>السعر شامل الضريبة</span>
				<div className='product-card__buttons'>
					{token ? (
						<AsyncAction
							action={() =>
								cartAddItem({
									product: service,
									is_service: Number(service?.is_service),
									period: service?.period,
									hours: service?.hours,
									price:
										service?.discount_price > 0
											? service?.discount_price
											: service?.selling_price,
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
										)}>
										اضافة إلى السلة
									</button>
								</React.Fragment>
							)}
						/>
					) : (
						<AsyncAction
							action={() =>
								cartAddItemLocal({
									product: service,
									is_service: Number(service?.is_service),
									domain,
									price:
										service?.discount_price > 0
											? service?.discount_price
											: service?.selling_price,
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
										)}>
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

ServiceCard.propTypes = {
	/**
	 * product object
	 */
	service: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ServiceCard);
