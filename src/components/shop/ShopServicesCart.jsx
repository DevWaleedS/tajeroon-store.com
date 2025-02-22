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
import {
	cartRemoveItem,
	cartUpdateQuantities,
	cartRemoveItemLocal,
	UpdateCartQuantities,
	updateOptions,
	updateOptionsLocal,
} from "../../store/cart";
import { Cross12Svg } from "../../svg";

function ShopPageCart(props) {
	const { cart } = props;
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		// Initialize cart items when the cart loads or changes
		if (cart?.items) {
			const initialItemStates = cart.items.map((item) => ({
				id: item.id,
				period: Number(item.period),
				price: Number(item.price),
				discountPrice: Number(item.discount_price || 0),
				selectedOptions: item?.options,
			}));
			setCartItems(initialItemStates);
		}
	}, [cart?.items]);

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

	const renderItems = () => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;
		const { cart, cartRemoveItem, cartRemoveItemLocal, token } = props;

		return cart?.items?.map((item) => {
			let image;
			let options;
			const itemState = cartItems.find((state) => state.id === item.id);
			if (item?.product?.cover) {
				image = (
					<div className='product-image service-image'>
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

			if (item?.options) {
				options = (
					<ul
						className='dropcart__product-options flex-column align-items-start '
						style={{ listStyle: "disc", color: "#1dbbbe" }}>
						{item?.options?.map((option, index) => (
							<li key={index}>{option}</li>
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

					{itemState?.period && itemState?.hours ? (
						<td
							className='cart-table__column cart-table__column--quantity'
							data-title='مدة التنفيذ '>
							{handlePeriodByDays(itemState.period)}
							<span className='text-success'> و </span>
							{handlePeriodByHours(itemState?.hours)}
						</td>
					) : itemState?.period && !itemState?.hours ? (
						<td
							className='cart-table__column cart-table__column--quantity'
							data-title='مدة التنفيذ '>
							{handlePeriodByDays(itemState.period)}
						</td>
					) : !itemState?.period && itemState?.hours ? (
						<td
							className='cart-table__column cart-table__column--quantity'
							data-title='مدة التنفيذ '>
							{handlePeriodByHours(itemState?.hours)}
						</td>
					) : (
						<td
							className='cart-table__column cart-table__column--quantity'
							data-title='مدة التنفيذ '>
							<span className='text-success'>لا توجد مدة محددة </span>
						</td>
					)}

					<td
						className='cart-table__column cart-table__column--total'
						data-title='الإجمالي'>
						<Currency value={itemState ? itemState.price : item.price} />
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

					{cart?.discount_type !== null ? (
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
					) : null}
				</tbody>
			</React.Fragment>
		);
	};

	const renderCart = () => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;
		const { cart, UpdateCartQuantities, cartUpdateQuantities } = props;

		/*	const updateCartButton = localStorage?.getItem("token") ? (
			<AsyncAction
				render={({ run }) => {
					const classes = classNames("btn btn-primary cart__update-button");

					return (
						<button
							type='button'
							onClick={() => {
								UpdateCartQuantities(0);
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
				action={() => cartUpdateQuantities(0, domain)}
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
		);*/

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
									اسم الخدمة
								</th>

								<th className='cart-table__column cart-table__column--quantity'>
									مدة التنفيذ
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
							{/*		{updateCartButton}*/}
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

			<PageHeader header='سلة التسوق' breadcrumb={breadcrumb} />

			{content}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	cart: state.cart,
	price: state.product.price,
	discount_price: state.product.discount_price,
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
