// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import InputNumber from "../shared/InputNumber";
import PageHeader from "../shared/PageHeader";
import {
	cartRemoveItem,
	cartUpdateQuantities,
	cartRemoveItemLocal,
	UpdateCartQuantities,
	updateOptions,
	updateOptionsLocal,
} from "../../store/cart";
import { Cross12Svg } from "../../svg";

// data stubs

import OptionsModal from "../shared/OptionsModal";
import { findMatchingSubArray } from "../../Utilities/UtilitiesFunctions";

function ShopPageCart(props) {
	const { cart, price, discount_price, stock } = props;

	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const [quantities, setQuantities] = useState([]);
	const [selectedValues, setSelectedValues] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [newPrice, setNewPrice] = useState(price);
	const [newDiscountPrice, setNewDiscountPrice] = useState(discount_price);
	const [newStock, setNewStock] = useState(stock);

	const getItemQuantity = (item) => {
		const quantity = quantities?.find((x) => x?.id === item?.id);
		return quantity ? Number(quantity?.qty) : Number(item?.qty);
	};

	const optionNames = (item, options) => {
		const optionNames = item?.product?.options?.map((option) => option);
		const matchingSubArray = findMatchingSubArray(optionNames, options);
		return matchingSubArray?.id;
	};

	const handleChangeQuantity = (item, quantity) => {
		setQuantities(() => {
			const stateQuantity = quantities?.find((x) => x?.id === item?.id);
			if (!stateQuantity) {
				quantities?.push({
					id: item?.id,
					qty: quantity > +item?.stock ? +item?.stock : quantity,
					options: optionNames(item, item?.options),
					product: item?.product,
					price: optionNames(item, item?.options)
						? item?.price
						: Number(item?.product?.discount_price) > 0
						? Number(item?.product?.discount_price)
						: Number(item?.product?.selling_price),
				});
			} else {
				if (quantity > +item?.stock) {
					stateQuantity.qty = +item?.stock;
				} else {
					stateQuantity.qty = quantity;
				}
			}
			return [...quantities];
		});
	};

	const handleChangeOptions = (e, index, item) => {
		setSelectedValues((prevSelectedValues) => {
			const updatedSelectedValues = prevSelectedValues?.map((stateOptions) => {
				if (stateOptions?.id === item?.id) {
					const updatedOptions = [...stateOptions?.options];
					updatedOptions[index] = e.target.value;

					return {
						...stateOptions,
						options: updatedOptions,
					};
				}

				return stateOptions;
			});
			return updatedSelectedValues;
		});
	};

	const handleChangeQuantityOptions = (item, quantity) => {
		setSelectedValues((prevSelectedValues) => {
			const updatedValues = prevSelectedValues?.map((stateProduct) => {
				if (stateProduct?.id === item?.id) {
					return {
						...stateProduct,
						qty: quantity,
					};
				}
				return stateProduct;
			});
			return updatedValues;
		});
	};

	const openOptionSModal = (item) => {
		setOpenModal(true);
		setModalData(item);
		setSelectedValues([...selectedValues, item]);
	};

	const colseOptionModal = () => {
		setOpenModal(false);
		setModalData(null);
		setSelectedValues([]);
	};

	const cartNeedUpdate = () => {
		const { cart } = props;
		return (
			quantities?.filter((x) => {
				const item = cart?.items?.find((item) => item?.id === x?.id);
				return item && Number(item?.qty) !== Number(x?.qty);
			})?.length > 0
		);
	};

	const cartNeedUpdateOptions = () => {
		const { updateOptions, updateOptionsLocal } = props;
		const token = localStorage.getItem("token");
		const updatedItems = cart?.items?.map((item) => {
			const product = selectedValues?.find((x) => x?.id === item?.id);
			return {
				...item,
				qty: product ? product?.qty : item?.qty,
				options: product ? product?.options : item?.options,
				price: product
					? newDiscountPrice > 0
						? newDiscountPrice
						: newPrice
					: item?.price,
				stock: product ? newStock : item?.stock,
				sum:
					(product ? product?.qty : item?.qty) *
					(product
						? newDiscountPrice > 0
							? newDiscountPrice
							: newPrice
						: item?.price),
			};
		});
		token
			? updateOptions(updatedItems)
			: updateOptionsLocal(updatedItems, domain);
		colseOptionModal();
	};

	useEffect(() => {
		setNewPrice(price);
		setNewDiscountPrice(discount_price);
		setNewStock(stock);
	}, [price, discount_price, stock]);

	const renderItems = () => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;
		const token = localStorage.getItem("token");
		const { cart, cartRemoveItem, cartRemoveItemLocal } = props;

		return cart?.items?.map((item) => {
			let image;
			let options;

			if (item?.product?.cover) {
				image = (
					<div className='product-image'>
						<Link
							to={
								cart?.is_service
									? `/services/${item?.product?.id}/${encodeURIComponent(
											item?.product?.name
												.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
												.toLowerCase()
									  )}`
									: `/products/${encodeURIComponent(
											item?.product?.name
												.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
												.toLowerCase()
									  )}/${item?.product?.id}`
							}
							className='product-image__body'>
							<img
								className='product-image__img'
								src={item?.product?.cover}
								alt={item?.product?.name}
							/>
						</Link>
					</div>
				);
			}

			if (item?.product?.attributes?.length > 0) {
			}
			if (item?.options?.length > 0) {
				options = (
					<ul className='cart-table__options'>
						{item.options.map((option, index) => (
							<li key={index} onClick={() => openOptionSModal(item)}>{`${
								index === 0 ? `${option}` : `/ ${option}`
							}`}</li>
						))}
					</ul>
				);
			}

			const removeButton = token ? (
				<AsyncAction
					action={() => cartRemoveItem(item?.id)}
					render={({ run, loading }) => {
						const classes = classNames("btn btn-light btn-sm btn-svg-icon", {
							"btn-loading": loading,
						});

						return (
							<button type='button' onClick={run} className={classes}>
								<Cross12Svg />
							</button>
						);
					}}
				/>
			) : (
				<AsyncAction
					action={() => cartRemoveItemLocal(item?.id, domain)}
					render={({ run, loading }) => {
						const classes = classNames("btn btn-light btn-sm btn-svg-icon", {
							"btn-loading": loading,
						});

						return (
							<button type='button' onClick={run} className={classes}>
								<Cross12Svg />
							</button>
						);
					}}
				/>
			);

			return (
				<tr key={item.id} className='cart-table__row'>
					<td className='cart-table__column cart-table__column--image'>
						{image}
					</td>
					<td className='cart-table__column cart-table__column--product'>
						<Link
							to={
								cart?.is_service
									? `/services/${item?.product?.id}/${encodeURIComponent(
											item?.product?.name
												.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
												.toLowerCase()
									  )}`
									: `/products/${encodeURIComponent(
											item?.product?.name
												.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
												.toLowerCase()
									  )}/${item?.product?.id}`
							}
							className='cart-table__product-name'>
							{item?.product?.name}
						</Link>
						{options}
					</td>
					<td
						className='cart-table__column cart-table__column--price'
						data-title='السعر'>
						<Currency value={item?.price} />
					</td>

					<td
						className='cart-table__column cart-table__column--quantity'
						data-title='الكمية'>
						<InputNumber
							onChange={(quantity) => {
								handleChangeQuantity(item, quantity);
								if (quantity > +item?.stock) {
									toast.error(
										`الكمية المتوفرة ${
											+item?.stock === 1
												? "قطعة واحدة "
												: +item?.stock === 2
												? " قطعتين "
												: ` ${+item?.stock} قطع`
										} فقط `,
										{ theme: "colored" }
									);
								}
							}}
							value={getItemQuantity(item)}
							min={1}
						/>
					</td>

					<td
						className='cart-table__column cart-table__column--total'
						data-title='الإجمالي'>
						<Currency value={item?.sum} />
					</td>
					<td className='cart-table__column cart-table__column--remove'>
						{removeButton}
					</td>
				</tr>
			);
		});
	};

	const renderTotals = () => {
		const { cart } = props;
		return (
			<React.Fragment>
				<thead className='cart__totals-header'>
					<tr>
						<th>السعر</th>
						<td>
							<Currency value={cart?.subtotal} />
						</td>
					</tr>
				</thead>
				<tbody className='cart__totals-body'>
					<tr>
						<th>الضريبة</th>
						<td>
							<Currency value={cart?.tax} />
						</td>
					</tr>
					{cart?.overweight_price !== null && cart?.overweight_price !== 0 && (
						<tr>
							<th>قيمة الوزن الزائد ({cart?.overweight} kg)</th>
							<td>
								<Currency value={cart?.overweight_price} />
							</td>
						</tr>
					)}
					{cart?.shipping > 0 && (
						<tr>
							<th>الشحن</th>
							<td>
								<Currency value={cart?.shipping} />
							</td>
						</tr>
					)}
					{cart?.discount_type !== null && (
						<tr>
							<th>
								الخصم{" "}
								{cart?.discount_type === "fixed" ? null : (
									<span style={{ fontSize: "0.85rem", color: "#7e7e7e" }}>
										({cart?.discount_price}%)
									</span>
								)}
							</th>
							<td>
								<Currency value={cart?.discount_total} />
							</td>
						</tr>
					)}
				</tbody>
			</React.Fragment>
		);
	};

	const renderCart = () => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;
		const { cart, UpdateCartQuantities, cartUpdateQuantities } = props;

		const updateCartButton = localStorage?.getItem("token") ? (
			<AsyncAction
				render={({ run }) => {
					const classes = classNames("btn btn-primary cart__update-button");

					return (
						<button
							type='button'
							onClick={() => {
								UpdateCartQuantities(quantities);
							}}
							className={`${classes} ${
								!localStorage?.getItem("btn_loading") === "true"
									? "btn-loading"
									: ""
							}`}
							disabled={!cartNeedUpdate()}>
							تحديث سلة التسوق
						</button>
					);
				}}
			/>
		) : (
			<AsyncAction
				action={() => cartUpdateQuantities(quantities, domain)}
				render={({ run, loading }) => {
					const classes = classNames("btn btn-primary cart__update-button", {
						"btn-loading": loading,
					});

					return (
						<button
							type='button'
							onClick={run}
							className={classes}
							disabled={!cartNeedUpdate() || loading}>
							تحديث سلة التسوق
						</button>
					);
				}}
			/>
		);

		return (
			<div className='cart block'>
				<div className='container'>
					<table className='cart__table cart-table'>
						<thead className='cart-table__head'>
							<tr className='cart-table__row'>
								<th className='cart-table__column cart-table__column--image'>
									الصورة
								</th>
								<th className='cart-table__column cart-table__column--product'>
									اسم المنتج
								</th>

								<th className='cart-table__column cart-table__column--price'>
									السعر
								</th>

								<th className='cart-table__column cart-table__column--quantity'>
									الكمية
								</th>

								<th className='cart-table__column cart-table__column--total'>
									الإجمالي
								</th>
								<th
									className='cart-table__column cart-table__column--remove'
									aria-label='Remove'
								/>
							</tr>
						</thead>
						<tbody className='cart-table__body'>{renderItems()}</tbody>
					</table>
					<div className='cart__actions'>
						<div className='cart__buttons'>
							<Link to={``} className='btn btn-secondray'>
								الاستمرار في التسوق
							</Link>
							{updateCartButton}
						</div>
					</div>

					<div className='row justify-content-end pt-md-5 pt-4'>
						<div className='col-12 col-md-7 col-lg-6 col-xl-5'>
							<div className='card'>
								<div className='card-body'>
									<h3 className='card-title'>إجمالي السلة</h3>
									<table className='cart__totals'>
										{renderTotals()}
										<tfoot className='cart__totals-footer'>
											<tr>
												<th>
													الإجمالي{" "}
													<span className='tax-text'>(شامل الضريبة)</span>
												</th>
												<td>
													<Currency value={cart?.total} />
												</td>
											</tr>
										</tfoot>
									</table>
									<Link
										to={`/checkout`}
										className='btn btn-primary btn-xl btn-block cart__checkout-button'>
										الاستمرار الى الدفع
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const breadcrumb = [
		{ title: "الرئيسية", url: `` },
		{ title: "سلة التسوق", url: "/cart" },
	];
	let content;

	if (cart?.qty) {
		content = renderCart();
	} else {
		content = (
			<div className='block block-empty'>
				<div className='container'>
					<div className='block-empty__body'>
						<div className='block-empty__message'>
							سلة التسوق الخاصة بك فارغة!
						</div>
						<div className='block-empty__actions'>
							<Link to={``} className='btn btn-primary btn-sm'>
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
				<title>{`سلة التسوق — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>
			<OptionsModal
				modalData={modalData}
				price={price}
				discount_price={discount_price}
				stock={stock}
				selectedValues={selectedValues}
				openModal={openModal}
				colseOptionModal={colseOptionModal}
				newStock={newStock}
				handleChangeOptions={handleChangeOptions}
				cartNeedUpdateOptions={cartNeedUpdateOptions}
				handleChangeQuantityOptions={handleChangeQuantityOptions}
				getItemQuantity={getItemQuantity}
			/>
			<PageHeader header='سلة التسوق' breadcrumb={breadcrumb} />

			{content}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	cart: state.cart,
	price: state.product.price,
	discount_price: state.product.discount_price,
	stock: state.product.stock,
	optionId: state.product.optionId,
});

const mapDispatchToProps = {
	cartRemoveItem,
	cartUpdateQuantities,
	cartRemoveItemLocal,
	UpdateCartQuantities,
	updateOptions,
	updateOptionsLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCart);
