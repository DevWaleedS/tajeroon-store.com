import React from "react";
import Collapse from "../../shared/Collapse";

const RenderPaymentsList = ({
	paymentMethods,
	paymentSelect,
	setPaymentSelect,
	error,
	is_service,
}) => {
	const paymentsData = is_service
		? paymentMethods?.data?.payment_types
				?.filter((payment) => payment?.id !== 4)
				?.map((payment) => {
					const renderPayment = ({ setItemRef, setContentRef }) => (
						<li className='payment-methods__item' ref={setItemRef}>
							<label className='payment-methods__item-header'>
								<div className='d-flex flex-row align-items-center'>
									<span className='payment-methods__item-radio input-radio'>
										<span className='input-radio__body'>
											<input
												type='radio'
												className='input-radio__input'
												name='checkout_payment_method'
												value={JSON.stringify(payment)}
												checked={
													JSON.parse(paymentSelect)?.id === Number(payment?.id)
												}
												onChange={(e) => setPaymentSelect(e.target.value)}
											/>
											<span className='input-radio__circle' />
										</span>
									</span>
									<span className='payment-methods__item-title'>
										{payment?.name}
									</span>
								</div>
								<img
									src={payment?.image}
									alt={payment?.name}
									width='40'
									height='20'
									style={{ objectFit: "contain" }}
								/>
							</label>
							<div
								className='payment-methods__item-container'
								ref={setContentRef}>
								<div className='payment-methods__item-description text-muted'></div>
							</div>
						</li>
					);

					return (
						<Collapse
							key={Number(payment?.id)}
							open={false}
							toggleClass='payment-methods__item--active'
							render={renderPayment}
						/>
					);
				})
		: paymentMethods?.data?.payment_types?.map((payment) => {
				const renderPayment = ({ setItemRef, setContentRef }) => (
					<li className='payment-methods__item' ref={setItemRef}>
						<label className='payment-methods__item-header'>
							<div className='d-flex flex-row align-items-center'>
								<span className='payment-methods__item-radio input-radio'>
									<span className='input-radio__body'>
										<input
											type='radio'
											className='input-radio__input'
											name='checkout_payment_method'
											value={JSON.stringify(payment)}
											checked={
												JSON.parse(paymentSelect)?.id === Number(payment?.id)
											}
											onChange={(e) => setPaymentSelect(e.target.value)}
										/>
										<span className='input-radio__circle' />
									</span>
								</span>
								<span className='payment-methods__item-title'>
									{payment?.name}
								</span>
							</div>
							<img
								src={payment?.image}
								alt={payment?.name}
								width='40'
								height='20'
								style={{ objectFit: "contain" }}
							/>
						</label>
						<div
							className='payment-methods__item-container'
							ref={setContentRef}>
							<div className='payment-methods__item-description text-muted'></div>
						</div>
					</li>
				);

				return (
					<Collapse
						key={Number(payment?.id)}
						open={false}
						toggleClass='payment-methods__item--active'
						render={renderPayment}
					/>
				);
		  });

	return (
		<div className='payment-methods'>
			<h6>يرجى اختيار طريقة الدفع</h6>
			<ul className='payment-methods__list'>{paymentsData}</ul>
			{error?.paymentMethod && (
				<span
					style={{ fontSize: "0.85rem", fontWeight: "500" }}
					className='text-danger'>
					{error?.paymentMethod}
				</span>
			)}
		</div>
	);
};

export default RenderPaymentsList;
