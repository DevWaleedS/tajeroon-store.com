import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { SendFormData } from "../../../Utilities/UtilitiesFunctions";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const ApplePay = () => {
	const history = useHistory();
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);

	const storeName = localStorage.getItem("store-name");
	const storeLogo = localStorage.getItem("store-logo");

	const sessionData = location.state?.data;
	const domain = location.state?.domain;
	const orderData = location.state?.orderData;
	const totalAmount = location.state?.totalAmount;
	const is_service = location.state?.is_service;

	const CheckoutHandel = async (sessionId) => {
		let formData = new FormData();
		setIsLoading(true);

		if (!is_service) {
			formData.append("shippingAddress_id", orderData.shippingAddress_id);
			formData.append("district", orderData.district);
			formData.append("city", orderData.city);
			formData.append("street_address", orderData.street_address);
			formData.append("postal_code", orderData.postal_code);
			formData.append("shippingtype_id", orderData.shippingtype_id);
			formData.append("description", orderData.description);
			formData.append("default_address", orderData.default_address);
		}
		formData.append("paymentype_id", orderData.paymentype_id);
		formData.append("cod", orderData.cod);
		formData.append("SessionId", sessionId);

		try {
			const response = await SendFormData(
				`https://backend.atlbha.sa/api/cheackout/${domain}`,
				formData
			);
			if (response.data.success && response.data.data.status === 200) {
				window.location.href = response.data.data.payment.Data.PaymentURL;
			} else {
				const errors = response.data.message.en;
				for (const key in errors) {
					if (errors.hasOwnProperty(key)) {
						errors[key].forEach((error) => {
							toast.error(error);
						});
					}
				}
			}
		} catch (error) {
			toast.error("An error occurred during the checkout process.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!sessionData) {
			history.push(`checkout`);
			return;
		}

		const config = {
			currencyCode: "SAR",
			callback: payment,
			amount: totalAmount,
			cardViewId: "card-element",
			sessionId: sessionData?.SessionId,
			countryCode: sessionData?.CountryCode,

			style: {
				frameHeight: 51,
				button: {
					height: "35px",
					text: `Pay with`,
					borderRadius: "8px",
				},
			},
		};

		// eslint-disable-next-line no-undef
		myFatoorahAP.init(config);
	}, [sessionData, history]);

	const payment = () => {
		// eslint-disable-next-line no-undef
		myFatoorahAP
			.submit()
			.then((response) => {
				const { sessionId } = response;
				if (sessionId) {
					CheckoutHandel(sessionId);
				}
			})
			.catch((error) => {
				toast.error(error);
			});
	};

	return (
		<>
			<Helmet>
				<title>{`apple pay — ${storeName}`}</title>
			</Helmet>
			<div className='mada-payment-box'>
				<div className='logo-box'>
					<img src={storeLogo} alt={storeName} />
					<h3 className='block-features__title mb-4'>{storeName}</h3>
					<h2 className='payment-info-title'>الدفع باستخدام apple pay</h2>
				</div>
				<div id='card-element'></div>
			</div>
		</>
	);
};

export default ApplePay;
