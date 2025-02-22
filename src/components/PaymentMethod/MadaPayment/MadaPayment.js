import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { SendFormData } from "../../../Utilities/UtilitiesFunctions";
import { toast } from "react-toastify";
import "./MadaPayment.css";
import { Helmet } from "react-helmet-async";

const MadaPayment = () => {
	const history = useHistory();
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);

	const storeName = localStorage.getItem("store-name");
	const storeLogo = localStorage.getItem("store-logo");

	const SessionData = location.state?.data;
	const domain = location.state?.domain;
	const orderData = location.state?.orderData;
	const totalAmount = location.state.totalAmount;
	const is_service = location.state.is_service;

	const CheckoutHandel = async (SessionId) => {
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
		formData.append("SessionId", SessionId);

		const response = await SendFormData(
			`https://backend.atlbha.sa/api/cheackout/${domain}`,
			formData
		);
		if (response.data.success && response.data.data.status === 200) {
			setIsLoading(false);
			window.location.href = response.data.data.payment.Data.PaymentURL;
		}
		if (response.data.success === false) {
			const errors = response.data.message.en;
			for (const key in errors) {
				if (errors.hasOwnProperty(key)) {
					errors[key].forEach((error) => {
						toast.error(error);
					});
				}
			}
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!SessionData) {
			history.push(`checkout`);
			return;
		}
		const config = {
			countryCode: SessionData?.CountryCode,
			sessionId: SessionData?.SessionId,
			cardViewId: "card-element",
			supportedNetworks: "v,m,ae,md",
			style: {
				hideCardIcons: false,
				cardHeight: 310,
				direction: "rtl",
				input: {
					color: "black",
					fontSize: "16px",
					direction: "ltr",
					textAlign: "end",
					fontWeight: "500",
					fontFamily: "Tajawal, sans-serif",
					inputHeight: "40px",
					inputMargin: "20px",
					borderColor: "#DDD",
					borderWidth: "1px",
					borderRadius: "6px",
					boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.0)",
					placeHolder: {
						holderName: "Name on Card",
						cardNumber: "Card Number",
						expiryDate: "MM / YY",
						securityCode: "CVV",
					},
				},
				text: {
					saveCard: "Save card info for future payments.",
					addCard: "Use another card!",
					deleteAlert: {
						title: "Delete Card",
						message: "Are you sure you want to delete this card?",
						confirm: "Yes",
						cancel: "No",
					},
				},
				label: {
					display: true,
					color: "#1e2429",
					fontSize: "16px",
					fontWeight: "500",
					fontFamily: "Tajawal, sans-serif",
					text: {
						holderName: "إسم مالك البطاقة",
						cardNumber: "رقم البطاقة",
						expiryDate: "تاريخ الانتهاء",
						securityCode: "كود الأمان",
					},
				},
				error: {
					borderColor: "red",
					borderRadius: "6px",
					boxShadow: "0px 4px 6px rgba(255, 0, 0, 0.1)",
				},
			},
		};
		// eslint-disable-next-line no-undef
		myFatoorah.init(config);
	}, [SessionData, history]);

	const handleSubmit = () => {
		// eslint-disable-next-line no-undef
		myFatoorah
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
				<title>{` مدي — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>
			<div className='mada-payment-box'>
				<div className='logo-box'>
					<img src={storeLogo} alt={storeName} />
					<h3 className='block-features__title mb-4'>{storeName}</h3>
					<h2 className='payment-info-title'>معلومات الدفع</h2>
				</div>
				<div id='card-element'></div>
				<button
					className='btn btn-primary btn-md btn-block submit-checkout-btn'
					type='submit'
					disabled={isLoading}
					onClick={() => {
						handleSubmit();
					}}>
					{isLoading ? (
						<span className='btn-loading'></span>
					) : (
						`تأكيد دفع ${totalAmount} ر.س`
					)}
				</button>
			</div>
		</>
	);
};

export default MadaPayment;
