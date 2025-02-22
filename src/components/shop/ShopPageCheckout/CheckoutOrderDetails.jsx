import React from "react";
import AsyncAction from "../../shared/AsyncAction";
import classNames from "classnames";
import { Cross12Svg } from "../../../svg";
import RenderCart from "./RenderCart";
import RenderCouponInput from "./RenderCouponInput";
import RenderPaymentsList from "./RenderPaymentsList";
import RenderShippingList from "./RenderShippingList";

const CheckoutOrderDetails = ({
	removeAllICartItems,
	setShowCoupon,
	setCouponError,
	showCoupon,
	coupon,
	setCoupon,
	handleCoupon,
	loadingCoupon,
	couponError,
	paymentMethods,
	setPaymentSelect,
	error,
	shippingType,
	shippingSelect,
	setShippingSelect,
	changeShippingPrice,
	SelectShippingTypeFunc,
	defaultAddress,
	setDefaultAddress,
	setShipping,
	daysDefinition,
	btnLoading,
	handleCheckout,
	cart,
	paymentSelect,
}) => {
	const otherShippingSelect = shippingType?.data.shipping_company.find(
		(item) => item.id === Number(shippingSelect)
	);

	return (
		<div className='card mb-0'>
			<div className='card-body'>
				<div className='d-flex justify-content-between '>
					<h3 className='card-title'>تفاصيل الطلب</h3>
					<div>
						{
							<AsyncAction
								action={() => removeAllICartItems()}
								render={({ run, loading }) => {
									const classes = classNames(
										"btn btn-light btn-sm btn-svg-icon",
										{
											"btn-loading": loading,
										}
									);

									return (
										<button type='button' onClick={run} className={classes}>
											<Cross12Svg />
										</button>
									);
								}}
							/>
						}
					</div>
				</div>

				<RenderCart
					cart={cart}
					paymentSelect={paymentSelect}
					otherShippingSelect={otherShippingSelect}
				/>

				<RenderCouponInput
					setShowCoupon={setShowCoupon}
					setCouponError={setCouponError}
					showCoupon={showCoupon}
					coupon={coupon}
					setCoupon={setCoupon}
					handleCoupon={handleCoupon}
					loadingCoupon={loadingCoupon}
					couponError={couponError}
				/>

				{paymentMethods?.data?.payment_types?.length > 0 ? (
					<RenderPaymentsList
						is_service={cart?.is_service}
						paymentMethods={paymentMethods}
						paymentSelect={paymentSelect}
						setPaymentSelect={setPaymentSelect}
						error={error}
					/>
				) : null}

				{shippingType?.data?.shipping_company?.length === 0 ||
				cart?.is_service ? null : (
					<RenderShippingList
						paymentSelect={paymentSelect}
						shippingType={shippingType}
						shippingSelect={shippingSelect}
						setShippingSelect={setShippingSelect}
						changeShippingPrice={changeShippingPrice}
						SelectShippingTypeFunc={SelectShippingTypeFunc}
						error={error}
						defaultAddress={defaultAddress}
						setDefaultAddress={setDefaultAddress}
						setShipping={setShipping}
						daysDefinition={daysDefinition}
					/>
				)}

				<button
					disabled={btnLoading}
					type='submit'
					onClick={() => {
						handleCheckout();
					}}
					className='btn btn-primary btn-xl btn-block'>
					{btnLoading ? <span className='btn-loading'></span> : "تأكيد الطلب"}
				</button>
			</div>
		</div>
	);
};

export default CheckoutOrderDetails;
