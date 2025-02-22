// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import { cartAddItem, cartAddItemLocal } from "../../store/cart";
import { compareAddItem } from "../../store/compare";
import { Wishlist16Svg, Compare16Svg } from "../../svg";
import { wishlistAddItem } from "../../store/wishlist";

import { ServicesOptions } from ".";
import Rating from "../shared/Rating";
import Currency from "../shared/Currency";
import AsyncAction from "../shared/AsyncAction";
import ProductGallery from "../shared/ProductGallery";

function Service(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const {
		product,
		layout,
		wishlistAddItem,
		compareAddItem,
		cartAddItem,
		cartAddItemLocal,
		token,
	} = props;
	const [images, setImages] = useState([]);
	const [imageIndex, setImageIndex] = useState(0);
	const [selectedValues, setSelectedValues] = useState([]);
	const [attributes, setAttributes] = useState([]);
	const [totalPeriod, setTotalPeriod] = useState(Number(product.period));
	const [totalHours, setTotalHours] = useState(Number(product.hours));
	const [totalPrice, setTotalPrice] = useState(Number(product.selling_price));
	const [totalDiscountPrice, setTotalDiscountPrice] = useState(
		Number(product.discount_price)
	);

	useEffect(() => {
		if (product?.attributes) {
			const filteredAttributes = product.attributes.filter(
				(attribute) => attribute?.values?.length > 0
			);
			setAttributes(filteredAttributes);
		}
	}, [product?.attributes]);

	useEffect(() => {
		let newTotalPeriod = Number(product.period);
		let newTotalPrice = Number(product.selling_price);
		let newTotalHours = Number(product.hours);
		let newTotalDiscountPrice = Number(product.discount_price);

		selectedValues.forEach((value) => {
			newTotalPeriod += Number(value.value?.[1]);
			newTotalHours += Number(value.value?.[2]);
			newTotalPrice += Number(value.value?.[3]);
			if (newTotalDiscountPrice > 0) {
				newTotalDiscountPrice += Number(value.value?.[4] || value.value?.[3]);
			}
		});

		setTotalPeriod(newTotalPeriod);
		setTotalHours(newTotalHours);
		setTotalPrice(newTotalPrice);
		setTotalDiscountPrice(newTotalDiscountPrice);
	}, [selectedValues, product]);

	const handleChangeOptions = (item, attributeIndex) => {
		setSelectedValues((prevSelectedValues) => {
			const newSelectedValues = prevSelectedValues.filter(
				(val) => val.attributeIndex !== attributeIndex
			);

			if (
				!prevSelectedValues.some(
					(val) => val.id === item.id && val.attributeIndex === attributeIndex
				)
			) {
				newSelectedValues.push({ ...item, attributeIndex });
			}

			// store selected values in localStorage
			setSelectedValues(newSelectedValues);

			return newSelectedValues;
		});
	};

	// handle period by days
	const handlePeriodByDays = (period) => {
		const numPeriod = Number(period);

		if (numPeriod === 1) return <span className='text-success'>يوم واحد</span>;
		if (numPeriod === 2) return <span className='text-success'>يومين</span>;
		if (numPeriod >= 3 && numPeriod <= 10)
			return <span className='text-success'>{period} أيام</span>;
		return <span className='text-success'>{period} يوم</span>;
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

	const prices =
		totalDiscountPrice > 0 ? (
			<React.Fragment>
				<span className='product__new-price'>
					<Currency value={totalDiscountPrice} />
				</span>{" "}
				<span className='product__old-price'>
					<Currency value={totalPrice} />
				</span>
			</React.Fragment>
		) : (
			<Currency value={totalPrice} />
		);

	const coverArray = [{ id: 1, image: product?.cover }];

	return (
		<div className={`product product--layout--${layout}`}>
			<div className='product__content'>
				<ProductGallery
					productName={product?.name}
					layout={layout}
					cover={coverArray}
					images={product?.images}
					optionsImage={images}
					imageIndex={imageIndex}
				/>

				<div className='product__info'>
					<div className='product__wishlist-compare'>
						<AsyncAction
							action={() => wishlistAddItem(product, domain)}
							render={({ run, loading }) => (
								<button
									type='button'
									data-toggle='tooltip'
									data-placement='right'
									title='المفضلة'
									onClick={run}
									className={classNames("btn btn-sm btn-light btn-svg-icon", {
										"btn-loading": loading,
									})}>
									<Wishlist16Svg />
								</button>
							)}
						/>
						<AsyncAction
							action={() => compareAddItem(product, selectedValues, domain)}
							render={({ run, loading }) => (
								<button
									type='button'
									data-toggle='tooltip'
									data-placement='right'
									title='مقارنة'
									onClick={run}
									className={classNames("btn btn-sm btn-light btn-svg-icon", {
										"btn-loading": loading,
									})}>
									<Compare16Svg />
								</button>
							)}
						/>
					</div>
					<h1 className='product__name'>{product?.name}</h1>
					<div className='product__rating'>
						<div className='product__rating-stars'>
							<Rating value={Number(product?.productRating)} />
						</div>
						<div className='product__rating-legend'>
							<span>{`${product?.productRatingCount} تقييم`}</span>
						</div>
					</div>
					<div className='product__description'>
						{product?.short_description}
					</div>

					{totalPeriod && totalHours ? (
						<ul className='product__meta'>
							<li className='product__meta-availability'>
								مدة التنفيذ : {handlePeriodByDays(totalPeriod, totalHours)}
								<span className='text-success'> و </span>
								{handlePeriodByHours(totalHours)}
							</li>
						</ul>
					) : totalPeriod && !totalHours ? (
						<ul className='product__meta'>
							<li className='product__meta-availability'>
								مدة التنفيذ : {handlePeriodByDays(totalPeriod)}
							</li>
						</ul>
					) : !totalPeriod && totalHours ? (
						<ul className='product__meta'>
							<li className='product__meta-availability'>
								مدة التنفيذ : {handlePeriodByHours(totalPeriod, totalHours)}
							</li>
						</ul>
					) : null}
				</div>

				<div className='product__sidebar'>
					{totalPeriod && totalHours ? (
						<div className='product__availability'>
							مدة التنفيذ : {handlePeriodByDays(totalPeriod, totalHours)}
							<span className='text-success'> و </span>
							{handlePeriodByHours(totalHours)}
						</div>
					) : totalPeriod && !totalHours ? (
						<div className='product__availability'>
							مدة التنفيذ : {handlePeriodByDays(totalPeriod)}
						</div>
					) : !totalPeriod && totalHours ? (
						<div className='product__availability'>
							مدة التنفيذ : {handlePeriodByHours(totalHours)}
						</div>
					) : null}

					<div className='product__prices'>
						{prices} <span className='tax-text'>السعر شامل الضريبة</span>
					</div>

					{product?.product_has_options === 1 ? (
						<ServicesOptions
							product={product}
							attributes={attributes}
							selectedValues={selectedValues}
							setSelectedValues={setSelectedValues}
							updateSelectOptions={handleChangeOptions}
						/>
					) : null}

					<form className='product__options'>
						<div className='form-group product__option'>
							<div className='product__actions'>
								<div className='product__actions-item product__actions-item--addtocart'>
									{token ? (
										<AsyncAction
											action={() =>
												cartAddItem({
													product,
													is_service: Number(product?.is_service),
													period: totalPeriod,
													hours: totalHours,
													serviceOption: selectedValues.map(
														(option) => option.id
													),
													price:
														totalDiscountPrice > 0
															? totalDiscountPrice
															: totalPrice,
												})
											}
											render={({ run, loading }) => (
												<button
													type='button'
													onClick={run}
													className={classNames("btn btn-primary btn-lg", {
														"btn-loading": loading,
													})}>
													اضافة إلى السلة
												</button>
											)}
										/>
									) : (
										<AsyncAction
											action={() =>
												cartAddItemLocal({
													product,
													selectedValues,
													is_service: Number(product?.is_service),
													serviceOption: selectedValues.map(
														(option) => option.id
													),
													domain,
													price:
														totalDiscountPrice > 0
															? totalDiscountPrice
															: totalPrice,
													period: totalPeriod,
												})
											}
											render={({ run, loading }) => (
												<button
													type='button'
													onClick={run}
													className={classNames("btn btn-primary btn-lg", {
														"btn-loading": loading,
													})}>
													اضافة إلى السلة
												</button>
											)}
										/>
									)}
								</div>
								<div className='product__actions-item product__actions-item--wishlist'>
									<AsyncAction
										action={() => wishlistAddItem(product, domain)}
										render={({ run, loading }) => (
											<button
												type='button'
												data-toggle='tooltip'
												title='المفضلة'
												onClick={run}
												className={classNames(
													"btn btn-secondary btn-svg-icon btn-lg",
													{
														"btn-loading": loading,
													}
												)}>
												<Wishlist16Svg fill='#ffff' />
											</button>
										)}
									/>
								</div>
								<div className='product__actions-item product__actions-item--compare'>
									<AsyncAction
										action={() =>
											compareAddItem(product, selectedValues, domain)
										}
										render={({ run, loading }) => (
											<button
												type='button'
												data-toggle='tooltip'
												title='مقارنة'
												onClick={run}
												className={classNames(
													"btn btn-secondary btn-svg-icon btn-lg",
													{
														"btn-loading": loading,
													}
												)}>
												<Compare16Svg fill='#ffff' />
											</button>
										)}
									/>
								</div>
							</div>
						</div>
					</form>
				</div>

				<div className='product__footer'>
					{product?.SEOdescription?.length !== 0 && (
						<div className='product__tags tags'>
							<label
								htmlFor='product-quantity'
								className='product__option-label'>
								كلمات مفتاحية
							</label>
							<div className='tags__list'>
								{product?.SEOdescription?.map(
									(keyWord, index) =>
										keyWord !== "" && <span key={index}>{keyWord}</span>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

Service.propTypes = {
	product: PropTypes.object.isRequired,
	layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
};

Service.defaultProps = {
	layout: "standard",
};

const mapStateToProps = (state) => ({
	price: state.product.price,
	discount_price: state.product.discount_price,
	stock: state.product.stock,
	optionId: state.product.optionId,
});

const mapDispatchToProps = {
	cartAddItem,
	wishlistAddItem,
	compareAddItem,
	cartAddItemLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
