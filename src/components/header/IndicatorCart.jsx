// react
import React, { useState, useRef } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import { Cart20Svg, Cross10Svg } from "../../svg";
import {
	cartRemoveItem,
	fetchCartData,
	cartRemoveItemLocal,
} from "../../store/cart";
import { useEffect } from "react";

function IndicatorCart(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const history = useHistory();
	const token = localStorage.getItem("token");
	const { cart, cartRemoveItem, fetchCartData, cartRemoveItemLocal } = props;

	const [open, setOpen] = useState(false);
	let dropdown;
	let totals;
	const wrapperRef = useRef(null);

	useEffect(() => {
		if (fetchCartData) fetchCartData();
	}, [fetchCartData]);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target) &&
				open
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [open]);

	const toggleDropdown = () => {
		setOpen(!open);
	};

	totals = (
		<React.Fragment>
			<tr>
				<th>السعر</th>
				<td>
					<Currency value={cart?.subtotal} />
				</td>
			</tr>
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
		</React.Fragment>
	);
	const items = cart?.items?.map((item) => {
		let options;
		let image;

		if (item?.options) {
			options = (
				<ul className='dropcart__product-options'>
					{item?.options?.map((option, index) => (
						<li key={index}>{`${
							index === 0 ? `${option}` : `/ ${option}`
						}`}</li>
					))}
				</ul>
			);
		}
		if (item?.product?.cover) {
			image = (
				<div className='product-image dropcart__product-image'>
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

		const removeButton = token ? (
			<AsyncAction
				action={() => cartRemoveItem(item?.id)}
				render={({ run, loading }) => {
					const classes = classNames(
						"dropcart__product-remove btn btn-light btn-sm btn-svg-icon",
						{
							"btn-loading": loading,
						}
					);

					return (
						<button type='button' onClick={run} className={classes}>
							<Cross10Svg />
						</button>
					);
				}}
			/>
		) : (
			<AsyncAction
				action={() => cartRemoveItemLocal(item?.id, domain)}
				render={({ run, loading }) => {
					const classes = classNames(
						"dropcart__product-remove btn btn-light btn-sm btn-svg-icon",
						{
							"btn-loading": loading,
						}
					);

					return (
						<button type='button' onClick={run} className={classes}>
							<Cross10Svg />
						</button>
					);
				}}
			/>
		);
		return (
			<div key={item?.id} className='dropcart__product'>
				{image}
				<div className='dropcart__product-info'>
					<div className='dropcart__product-name'>
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
							}>
							{item?.product?.name}
						</Link>
					</div>
					{options}
					<div className='dropcart__product-meta'>
						<span className='dropcart__product-quantity'>
							{item?.qty || item?.quantity}
						</span>
						{" × "}
						<span className='dropcart__product-price'>
							<Currency value={item?.price} />
						</span>
					</div>
				</div>
				{removeButton}
			</div>
		);
	});

	if (cart?.qty) {
		dropdown = (
			<div className='dropcart'>
				<div className='dropcart__products-list'>{items}</div>
				<div className='dropcart__totals'>
					<table>
						<tbody>
							{totals}
							<tr>
								<th>
									الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
								</th>
								<td>
									<Currency value={cart?.total} />
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className='dropcart__buttons'>
					<button
						className='btn btn-secondary'
						onClick={() => {
							history.push({
								pathname: "/cart",
								state: { is_service: cart?.is_service ?? null },
							});
							setOpen(false);
						}}>
						سلة التسوق
					</button>
					<button
						className='btn btn-primary'
						onClick={() => {
							history.push(`/checkout`);
							setOpen(false);
						}}>
						الدفع
					</button>
				</div>
			</div>
		);
	} else {
		dropdown = (
			<div className='dropcart'>
				<div className='dropcart__empty'>سلة التسوق الخاصة بك فارغة!</div>
			</div>
		);
	}

	const classes = classNames(`indicator indicator--trigger--click`, {
		"indicator--opened": open,
	});

	return (
		<div className={classes} ref={wrapperRef}>
			<button
				type='button'
				className='indicator__button'
				onClick={toggleDropdown}>
				<span className='indicator__area'>
					<Cart20Svg />
					<span className='indicator__value'>{cart?.qty || 0}</span>
				</span>
			</button>
			<div className='indicator__dropdown'>{dropdown}</div>
		</div>
	);
}

const mapStateToProps = (state) => ({
	cart: state.cart,
});

const mapDispatchToProps = {
	cartRemoveItem,
	fetchCartData,
	cartRemoveItemLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorCart);
