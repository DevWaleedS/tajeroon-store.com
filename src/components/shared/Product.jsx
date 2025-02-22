// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import AsyncAction from "./AsyncAction";
import Currency from "./Currency";
import InputNumber from "./InputNumber";
import ProductGallery from "./ProductGallery";
import Rating from "./Rating";
import { cartAddItem, cartAddItemLocal } from "../../store/cart";
import { compareAddItem } from "../../store/compare";
import { Wishlist16Svg, Compare16Svg } from "../../svg";
import { wishlistAddItem } from "../../store/wishlist";
import { toast } from "react-toastify";
import ProductOtions from "./ProductOtions";

function Product(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const {
		product,
		layout,
		wishlistAddItem,
		compareAddItem,
		cartAddItem,
		cartAddItemLocal,
		token,
		price,
		discount_price,
		stock,
		optionId,
	} = props;
	let prices;
	const [quantity, setQuantity] = useState(1);
	const [images, setImages] = useState([]);
	const [imageIndex, setImageIndex] = useState(0);
	const [selectedValues, setSelectedValues] = useState([]);
	const [newOptionId, setNewOptionId] = useState(null);
	const [newPrice, setNewPrice] = useState(null);
	const [newDiscountPrice, setNewDiscountPrice] = useState(null);
	const [newStock, setNewStock] = useState(null);
	const [attributes, setAttributes] = useState([]);

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

		if (selectedValues?.length === 0) {
			setSelectedValues(getOptions());
		}
	}, [attributes, selectedValues?.length]);

	useEffect(() => {
		if (product?.product_has_options === 0 || !product?.product_has_options) {
			setNewOptionId(null);
			setNewPrice(Number(product?.selling_price));
			setNewDiscountPrice(Number(product?.discount_price));
			setNewStock(Number(product?.stock));
		} else {
			setNewOptionId(optionId);
			setNewPrice(Number(price));
			setNewDiscountPrice(Number(discount_price));
			setNewStock(stock);
		}
	}, [
		product,
		product?.product_has_options,
		optionId,
		price,
		discount_price,
		stock,
	]);

	const handleChangeQuantity = (productStock, quantity) => {
		if (Number(quantity) > Number(+productStock)) {
			setQuantity(Number(+productStock));
		} else {
			setQuantity(Number(quantity));
		}
	};

	const handleChangeOptions = (e, index) => {
		const { value } = e.target;
		setSelectedValues((prevSelectedValues) => {
			const updatedValues = [...prevSelectedValues];
			updatedValues[index] = value;
			return updatedValues;
		});
	};

	useEffect(() => {
		const attributesResult = attributes?.filter(
			(attribute) => attribute?.type === "نص و صورة"
		);
		if (attributesResult?.length !== 0) {
			const result = attributesResult?.[0]?.values?.map((item) => ({
				id: item?.id,
				image: item?.value?.[2],
			}));
			setImages(result);
		} else {
			setImages([]);
		}
	}, [attributes]);

	if (newDiscountPrice > 0) {
		prices = (
			<React.Fragment>
				<span className='product__new-price'>
					<Currency value={newDiscountPrice || 0} />
				</span>{" "}
				<span className='product__old-price'>
					<Currency value={newPrice || 0} />
				</span>
			</React.Fragment>
		);
	} else {
		prices = <Currency value={newPrice || 0} />;
	}

	let coverArray = [
		{
			id: 1,
			image: product?.cover,
		},
	];

	useEffect(() => {
		if (quantity > newStock) {
			setQuantity(1);
		} else {
			setQuantity(quantity);
		}
	}, [quantity, newStock]);

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

					<ul className='product__meta'>
						<li className='product__meta-availability'>
							المخزون:
							{Number(newStock) > 0 ? (
								<span className='text-success'>
									{Number(newStock) === 1
										? `قطعة واحدة`
										: Number(newStock) === 2
										? `قطعتين`
										: `متوفر`}
								</span>
							) : (
								<span className='text-danger'>غير متوفر</span>
							)}
						</li>
					</ul>
				</div>

				<div className='product__sidebar'>
					<div className='product__availability'>
						المخزون:
						{Number(newStock) > 0 ? (
							<span className='text-success'>
								{Number(newStock) === 1
									? `قطعة واحدة`
									: Number(newStock) === 2
									? `قطعتين`
									: `متوفر`}
							</span>
						) : (
							<span className='text-danger'>غير متوفر</span>
						)}
					</div>

					<div className='product__prices'>
						{prices} <span className='tax-text'>السعر شامل الضريبة</span>
					</div>

					{product?.product_has_options === 1 && (
						<ProductOtions
							product={product}
							attributes={attributes}
							selectedValues={selectedValues}
							setImageIndex={setImageIndex}
							updateSelectOptions={handleChangeOptions}
						/>
					)}

					<form className='product__options'>
						<div className='form-group product__option'>
							<label
								htmlFor='product-quantity'
								className='product__option-label'>
								الكمية
							</label>
							<div className='product__actions'>
								<div className='product__actions-item'>
									<InputNumber
										id='product-quantity'
										aria-label='Quantity'
										className='product__quantity'
										size='lg'
										min={1}
										value={quantity}
										disabled={Number(newStock) === "0"}
										onChange={(quantity) => {
											handleChangeQuantity(Number(newStock), quantity);

											if (quantity > +Number(newStock)) {
												toast.error(
													`الكمية المتوفرة ${
														+Number(newStock) === 1
															? "قطعة واحدة "
															: +Number(newStock) === 2
															? " قطعتين "
															: ` ${+Number(newStock)} قطع`
													} فقط`,
													{ theme: "colored" }
												);
											}
										}}
									/>
								</div>
								<div className='product__actions-item product__actions-item--addtocart'>
									{token ? (
										<AsyncAction
											action={() =>
												cartAddItem({
													product,
													optionid: newOptionId,
													quantity,
													price:
														newDiscountPrice > 0 ? newDiscountPrice : newPrice,
												})
											}
											render={({ run, loading }) => (
												<button
													type='button'
													onClick={run}
													disabled={!quantity || newStock === "0"}
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
													options: selectedValues,
													quantity,
													domain,
													price:
														newDiscountPrice > 0 ? newDiscountPrice : newPrice,
													stock: newStock,
												})
											}
											render={({ run, loading }) => (
												<button
													type='button'
													onClick={run}
													disabled={!quantity || newStock === "0"}
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

Product.propTypes = {
	/** product object */
	product: PropTypes.object.isRequired,
	/** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
	layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
};

Product.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Product);
