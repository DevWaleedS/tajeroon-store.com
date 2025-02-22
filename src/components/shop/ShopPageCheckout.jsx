// react
import React, { useEffect, useState } from "react";

// third-party
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";

// application
import PageHeader from "../shared/PageHeader";
import { Check9x7Svg } from "../../svg";

// data stubs
import { loginModalOpen } from "../../store/login-modal";
import { changeShippingPrice, fetchCartData } from "../../store/cart";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import SelectAddress from "../account/SelectAddress";
import {
	getCityFromProvinceFunc,
	removeDuplicates,
} from "../../Utilities/UtilitiesFunctions";
import CheckoutOrderDetails from "./ShopPageCheckout/CheckoutOrderDetails";

function ShopPageCheckout(props) {
	const { cart, openLoginModal, changeShippingPrice, fetchCartData } = props;

	const history = useHistory();
	const token = localStorage.getItem("token");
	let storeId = localStorage.getItem("storeId");
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const { fetchedData, loading, reload, setReload } = useFetch(
		cart?.is_service
			? null
			: `https://backend.atlbha.sa/api/OrderAddress?domain=${store_domain}`
	);
	const { fetchedData: paymentMethods } = useFetch(
		`https://backend.atlbha.sa/api/paymentmethods/${store_domain}`
	);
	const { fetchedData: shippingType } = useFetch(
		cart?.is_service
			? null
			: `https://backend.atlbha.sa/api/shippingcompany/${store_domain}`
	);

	const [addAddress, setAddAddress] = useState(false);
	const [cities, setCities] = useState(null);
	const [citiesLoading, setCitiesLoading] = useState(false);
	const [addAddressClicked, setAddAddressClicked] = useState(false);
	const [defaultAddressDisabled, setDefaultAddressDisabled] = useState(true);
	const [emptyAddresses, setEmptyAddresses] = useState(false);
	const [selectedAddressId, setSelectedAddressId] = useState(null);
	const [paymentSelect, setPaymentSelect] = useState(null);
	const [shippingSelect, setShippingSelect] = useState(null);
	const [btnLoading, setBtnLoading] = useState(false);
	const [showCoupon, setShowCoupon] = useState(false);
	const [loadingCoupon, setLoadingCoupon] = useState(false);
	const [coupon, setCoupon] = useState(null);
	const [couponError, setCouponError] = useState(null);
	const [shipping, setShipping] = useState({
		id: null,
		district: "",
		city: "",
		address: "",
		postCode: "",
		notes: "",
		defaultAddress: true,
	});

	// handle errors
	const [error, setError] = useState({
		district: "",
		city: "",
		address: "",
		postCode: "",
		notes: "",
		paymentMethod: "",
		shippingType: "",
	});

	const resetError = () => {
		setError({
			district: "",
			city: "",
			address: "",
			postCode: "",
			notes: "",
			paymentMethod: "",
			shippingType: "",
		});
	};
	/* ------------------------ */

	// handle re-calculation cart base on shipping company id
	const SelectShippingTypeFunc = async (shippingTypeId) => {
		try {
			const response = await axios.get(
				`https://backend.atlbha.sa/api/shippingCalculation/${storeId}/${shippingTypeId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);

			if (response.status !== 200) {
				throw new Error("Network response was not ok");
			}

			if (response.data.success && response.data.data.status === 200) {
				fetchCartData();
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	};

	useEffect(() => {
		if (!cart?.is_service) {
			const shippingTypeId = shippingSelect ? +shippingSelect : 5;
			SelectShippingTypeFunc(shippingTypeId);
		}
	}, [shippingSelect, cart?.is_service]);

	// if shippingType array is empty set other shipping compony as a default shipping company
	useEffect(() => {
		if (shippingType?.data?.shipping_company?.length === 1) {
			setShippingSelect(5);
		}
	}, [shippingType?.data?.shipping_company?.length]);

	// get city based shipping company
	useEffect(() => {
		if (!cart?.is_service) {
			const fetchDataCities = async () => {
				try {
					setCitiesLoading(true);
					const { data: response } = await axios.get(
						`https://backend.atlbha.sa/api/selector/shippingcities/${shippingSelect}`
					);
					if (response) {
						setCities(response?.data?.cities);
						setCitiesLoading(false);
					}
				} catch (error) {
					console.error(error.message);
					setCitiesLoading(false);
				}
			};

			fetchDataCities();
		}
	}, [shippingSelect, cart?.is_service]);

	useEffect(() => {
		setEmptyAddresses(
			fetchedData?.data?.orderAddress?.length === 0 ? true : false
		);
	}, [fetchedData?.data?.orderAddress?.length]);

	const defaultAddress = fetchedData?.data?.orderAddress?.filter(
		(address) => address?.default_address === 1
	)[0];

	// handle default address
	const setDefaultAddress = (defaultAddress) => {
		setShipping({
			id: defaultAddress?.id || null,
			district: defaultAddress?.district || "",
			city: defaultAddress?.city || "",
			address: defaultAddress?.street_address || "",
			postCode: defaultAddress?.postal_code || "",
			defaultAddress: defaultAddress?.default_address === 1 ? true : false,
		});
		setAddAddress(true);
		setSelectedAddressId(defaultAddress?.id || null);
		setAddAddressClicked(false);
		setShippingSelect(defaultAddress?.shippingtype_id?.id || 1);
	};

	// to handle default address
	useEffect(() => {
		if (defaultAddress && loading) {
			setDefaultAddress(defaultAddress);
		} else {
			setAddAddress(false);
		}
	}, [fetchedData?.data?.orderAddress]);

	useEffect(() => {
		if (addAddress && !defaultAddressDisabled) {
			setShipping({
				id: null,
				district: "",
				city: "",
				address: "",
				postCode: "",
				defaultAddress: false,
			});
			setSelectedAddressId(null);
			setDefaultAddressDisabled(!defaultAddressDisabled);
		} else {
			setDefaultAddressDisabled(defaultAddressDisabled);
		}
	}, [addAddress, defaultAddressDisabled]);

	useEffect(() => {
		const getSelectedAddress = () =>
			fetchedData?.data?.orderAddress?.filter(
				(address) => address?.id === selectedAddressId
			);
		if (selectedAddressId !== null) {
			setShipping({
				id: getSelectedAddress()?.[0]?.id,
				district: getSelectedAddress()?.[0]?.district,
				city: getSelectedAddress()?.[0]?.city,
				address: getSelectedAddress()?.[0]?.street_address,
				postCode: getSelectedAddress()?.[0]?.postal_code,
				defaultAddress:
					getSelectedAddress()?.[0]?.default_address === 1 ? true : false,
			});
			setAddAddress(true);
			setAddAddressClicked(false);
			setShippingSelect(getSelectedAddress()?.[0]?.shippingtype_id?.id || 1);
		}
	}, [selectedAddressId]);

	const shipping_price = shippingType?.data?.shipping_company?.filter(
		(company) => Number(company?.id) === Number(shippingSelect)
	)?.[0]?.price;

	useEffect(() => {
		if (shipping_price) {
			changeShippingPrice(Number(shipping_price));
		}
	}, [shipping_price]);

	if (cart?.items?.length < 1) {
		return <Redirect to='cart' />;
	}

	const breadcrumb = [
		{ title: "الرئيسية", url: `/` },
		{ title: "سلة التسوق", url: `/cart` },
		{ title: "الدفع", url: "" },
	];
	// -------------------------------------------------------------------------------- //

	// Helper to handle API calls
	const postFormData = async (url, formData, token = "") => {
		const headers = {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		};

		try {
			const response = await axios.post(url, formData, { headers });
			return response;
		} catch (error) {
			Object.entries(error?.response?.data?.errors)?.forEach(
				([key, message]) => {
					toast.error(message[0], { theme: "colored" });
				}
			);

			toast.error(error?.response?.data?.message, { theme: "colored" });
			return null;
		}
	};

	// handle create custom card view
	const handleCustomCardViewToPay = async () => {
		try {
			resetError();
			setBtnLoading(true);
			const response = await axios.post(
				`https://backend.atlbha.sa/api/initiateSession`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);

			if (response.status !== 200) {
				throw new Error("Network response was not ok");
			}

			if (response.status === 200 && response.data.data.status === 200) {
				// check if user not set address

				if (cart?.is_service) {
					history.push({
						pathname:
							JSON.parse(paymentSelect)?.id === 1
								? `/madaPayment`
								: `/applePay`,
						state: {
							totalAmount: cart?.total,
							domain: store_domain,
							data: response.data.data.respone.Data,
							is_service: cart?.is_service,
							orderData: {
								paymentype_id: JSON.parse(paymentSelect)?.id || "",
								cod: JSON.parse(paymentSelect)?.id === 4 ? 1 : 0, // if payment type is COD
							},
						},
					});
				} else if (shipping?.city && shipping?.district && shipping?.address) {
					history.push({
						pathname:
							JSON.parse(paymentSelect)?.id === 1
								? `/madaPayment`
								: `/applePay`,
						state: {
							totalAmount: cart?.total,
							domain: store_domain,
							data: response.data.data.respone.Data,
							orderData: {
								shippingAddress_id: shipping?.id,
								district: shipping?.district,
								city: shipping?.city,
								street_address: shipping?.address,
								postal_code: shipping?.postCode,
								paymentype_id: JSON.parse(paymentSelect)?.id || "",
								shippingtype_id: shippingSelect,
								cod: JSON.parse(paymentSelect)?.id === 4 ? 1 : 0, // if payment type is COD
								description: shipping?.notes || "",
								default_address: shipping?.defaultAddress ? 1 : 0,
							},
						},
					});
				} else {
					toast.error("أدخل العنوان أولاً", { theme: "colored" });
					setBtnLoading(false);
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	};

	// Handle check out
	const handleCheckout = async () => {
		// if payment gateway id mada navigate user into mada checkout page
		if (
			JSON.parse(paymentSelect)?.id === 1 ||
			JSON.parse(paymentSelect)?.id === 2
		) {
			handleCustomCardViewToPay();
		} else {
			resetError();
			setBtnLoading(true);

			let formData = new FormData();

			formData.append("paymentype_id", JSON.parse(paymentSelect)?.id || "");
			if (!cart?.is_service) {
				formData.append("shippingtype_id", shippingSelect);
				formData.append("shippingAddress_id", shipping?.id);
				formData.append("district", shipping?.district);
				formData.append("city", shipping?.city);
				formData.append("street_address", shipping?.address);
				formData.append("postal_code", shipping?.postCode);
				if (shipping?.notes) {
					formData.append("description", shipping?.notes || "");
				}
				formData.append("default_address", shipping?.defaultAddress ? 1 : 0);
			}
			formData.append("cod", JSON.parse(paymentSelect)?.id === 4 ? 1 : 0);

			// make the main request...
			const response = await postFormData(
				`https://backend.atlbha.sa/api/cheackout/${store_domain}`,
				formData,
				localStorage.getItem("token")
			);

			if (
				response &&
				response.data.success &&
				response.data.data.status === 200
			) {
				processCheckoutResponse(response, paymentSelect, store_domain);
				fetchCartData();
			} else {
				handleCheckoutError(response);
			}
		}
	};

	// Process successful checkout response
	const processCheckoutResponse = (response, paymentSelect, domain) => {
		if (
			response?.data?.message?.en === "order send successfully" &&
			response?.data?.data?.payment?.IsSuccess === true &&
			response?.data?.data?.payment?.Message === "Invoice Created Successfully!"
		) {
			window.location.href = response?.data?.data?.payment?.Data?.PaymentURL;
		} else if (response?.data?.message?.en === "order send successfully") {
			// To handle madfu login
			if (JSON.parse(paymentSelect)?.id === 5) {
				handleMadfuLogin(domain, response);
			} else {
				toast.success(response?.data?.message?.ar, { theme: "colored" });
				history.push({ pathname: `checkout/success` });
			}
		} else {
			setBtnLoading(false);
			toast.error(response?.data?.message?.ar, { theme: "colored" });
		}
	};

	// Handle errors during checkout
	const handleCheckoutError = (response) => {
		setBtnLoading(false);
		setError({
			district: response?.data?.message?.en?.district?.[0] || "",
			city: response?.data?.message?.en?.city?.[0] || "",
			address: response?.data?.message?.en?.street_address?.[0] || "",
			postCode: response?.data?.message?.en?.postal_code?.[0] || "",
			notes: response?.data?.message?.en?.description?.[0] || "",
			paymentMethod: response?.data?.message?.en?.paymentype_id?.[0] || "",
			shippingType: response?.data?.message?.en?.shippingtype_id?.[0] || "",
		});

		if (typeof response?.data?.message?.en === "object") {
			Object.entries(response?.data?.message?.en)?.forEach(([key, message]) => {
				toast.error(message[0], { theme: "colored" });
			});
		} else {
			toast.error(response?.data?.message?.ar, { theme: "colored" });
		}
	};

	// Madfu login and further processing
	const handleMadfuLogin = async (domain, checkOutResponse) => {
		const formData = new FormData();
		formData.append("uuid", domain);
		formData.append("store_id", localStorage.getItem("storeId"));

		const response = await postFormData(
			`https://backend.atlbha.sa/api/madfu/login`,
			formData,
			localStorage.getItem("token")
		);
		if (
			response &&
			response.data.success &&
			response.data.data.status === 200
		) {
			handleCreateMadfuOrder(response.data.data.data.token, checkOutResponse);
		} else {
			setBtnLoading(false);
			toast.error(response?.data?.message?.ar, { theme: "colored" });
		}
	};

	// Create an order after Madfu login
	const handleCreateMadfuOrder = async (token, checkOutResponse) => {
		try {
			// Create or retrieve guestOrderData, orderInfo, and orderDetails here or pass from somewhere
			const guestOrderData = {
				CustomerMobile:
					checkOutResponse?.data?.data?.order?.user?.phonenumber.startsWith(
						"+966"
					)
						? checkOutResponse?.data?.data?.order?.user?.phonenumber.slice(4)
						: checkOutResponse?.data?.data?.order?.user?.phonenumber.startsWith(
								"00966"
						  )
						? checkOutResponse?.data?.data?.order?.user?.phonenumber.slice(5)
						: checkOutResponse?.data?.data?.order?.user?.phonenumber,
				CustomerName:
					checkOutResponse?.data?.data?.order?.user?.name +
					" " +
					checkOutResponse?.data?.data?.order?.user?.lastname,
			};

			const orderDetails = cart?.items?.map((item) => ({
				productName: item?.product?.name,
				SKU: item?.product?.id,
				productImage: item?.product?.cover,
				count: parseInt(item.qty),
				totalAmount: item?.sum,
			}));

			const orderInfo = {
				Taxes: cart?.tax,
				ActualValue: cart?.total,
				Amount: cart?.total,
				MerchantReference: checkOutResponse?.data?.data?.order?.order_number,
			};

			// data that send  to api...
			const formData = new FormData();
			formData.append("token", token);
			formData.append("guest_order_data", JSON.stringify(guestOrderData));
			formData.append("order", JSON.stringify(orderInfo));
			formData.append("order_details", JSON.stringify(orderDetails));
			formData.append("url", `https://${store_domain}/checkout`);

			const response = await postFormData(
				`https://backend.atlbha.sa/api/madfu/create-order`,
				formData,
				token
			);

			if (
				response &&
				response.data.success &&
				response.data.data.status === 200
			) {
				window.location.href = response.data.data.data.checkoutLink;
			} else {
				setBtnLoading(true);
				toast.error(response?.data?.message?.ar, { theme: "colored" });
			}
		} catch (error) {
			console.error("Error creating order", error?.message);
		} finally {
			setBtnLoading(false);
		}
	};

	/** =====================================================================================  **/
	const getCityFromProvince = getCityFromProvinceFunc(cities, shipping);

	const changeDefaultAddress = (id) => {
		axios
			.get(`https://backend.atlbha.sa/api/setDefaultAddress/${id}`, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					store_domain: store_domain,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setReload(!reload);
				} else {
					setReload(!reload);
				}
			});
	};

	// TO HANDLE NAME OF DAYS
	const daysDefinition = (time) => {
		let timeValue = Number(time);

		if (timeValue === 0) {
			return "";
		}
		if (timeValue === 1) {
			return "يوم واحد";
		} else if (timeValue === 2) {
			return "يومين";
		} else if (timeValue <= 10 && timeValue >= 3) {
			return `${timeValue} أيام`;
		} else {
			return `${timeValue} يوم`;
		}
	};

	// handle apply discount coupon
	const handleCoupon = () => {
		setLoadingCoupon(true);
		let formData = new FormData();
		formData.append("code", coupon);
		axios
			.post(
				`https://backend.atlbha.sa/api/applyCoupon/${store_domain}/${cart?.cartId}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						store_domain: store_domain,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					if (
						res?.data?.message?.en === "The coupon is invalid" ||
						res?.data?.message?.en === "The coupon is already used"
					) {
						toast.error(res?.data?.message?.ar, { theme: "colored" });
						setCouponError(res?.data?.message?.ar);
						setLoadingCoupon(false);
					} else {
						setCoupon("");
						toast.success(res?.data?.message?.ar, { theme: "colored" });
						fetchCartData();
						setLoadingCoupon(false);
						setCouponError("");
					}
				} else {
					toast.error(res?.data?.message?.en?.code?.[0], { theme: "colored" });
					setCouponError(res?.data?.message?.ar);
					setLoadingCoupon(false);
				}
			});
	};

	/* handle delete items from cart */
	const removeAllICartItems = async () => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;
		const token = localStorage.getItem("token");

		try {
			const response = await axios.get(
				`https://backend.atlbha.sa/api/cartShow/${domain}?delete=1`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			);
			if (
				response &&
				response.data.success &&
				response.data.data.status === 200
			) {
				toast.success(response.data?.message?.ar, { theme: "colored" });
				fetchCartData();
			} else {
				toast.error(response.data?.message?.ar, { theme: "colored" });
				fetchCartData();
			}
		} catch (err) {
			toast.error(err, { theme: "colored" });
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`الدفع — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<PageHeader header='الدفع' breadcrumb={breadcrumb} />

			<div className='checkout block'>
				<div className='container'>
					<div className='row'>
						{!token ? (
							<div className='col-12 mb-3'>
								<div className='d-flex alert alert-primary alert-lg'>
									عميل غير مسجل الدخول?
									<p onClick={openLoginModal}>اضغط هنا لتسجيل الدخول</p>
								</div>
							</div>
						) : (
							<>
								{cart?.is_service ? null : (
									<div className='col-12 col-lg-6 col-xl-7'>
										<div className='card mb-lg-0'>
											<div className='card-body'>
												<h3 className='card-title'>تفاصيل العنوان</h3>
												<SelectAddress
													fetchedData={fetchedData}
													loading={loading}
													cities={cities}
													citiesLoading={citiesLoading}
													setSelectedAddressId={setSelectedAddressId}
													selectedAddressId={selectedAddressId}
													setAddAddress={setAddAddress}
													addressError={
														error?.district !== "" &&
														error?.city !== "" &&
														error?.address !== "" &&
														error?.postCode !== ""
													}
													setDefaultAddressDisabled={setDefaultAddressDisabled}
													setAddAddressClicked={setAddAddressClicked}
													shippingCompanies={
														shippingType?.data?.shipping_company
													}
													shippingSelect={shippingSelect}
												/>

												{addAddress && (
													<>
														<div className='form-group mt-3'>
															<label htmlFor='checkout-country'>
																المنطقة{" "}
																<span
																	style={{
																		fontSize: "1.2rem",
																		fontWeight: "500",
																	}}
																	className='text-danger'>
																	*
																</span>
															</label>
															<select
																value={shipping?.district}
																onChange={(e) => {
																	setShipping({
																		...shipping,
																		district: e.target.value,
																	});
																	setError({
																		...error,
																		district: "",
																	});
																}}
																id='checkout-country'
																className='form-control'>
																<option value='' disabled={true}>
																	اختر المنطقة...
																</option>
																{removeDuplicates(cities)?.map(
																	(district, index) => (
																		<option
																			key={index}
																			value={district?.region?.name_en}>
																			{district?.region?.name}
																		</option>
																	)
																)}
															</select>
															{error?.district && (
																<span
																	style={{
																		fontSize: "0.85rem",
																		fontWeight: "500",
																	}}
																	className='text-danger'>
																	{error?.district}
																</span>
															)}
														</div>
														<div className='form-group'>
															<label htmlFor='checkout-country'>
																المدينة{" "}
																<span
																	style={{
																		fontSize: "1.2rem",
																		fontWeight: "500",
																	}}
																	className='text-danger'>
																	*
																</span>
															</label>
															<select
																value={shipping?.city}
																onChange={(e) => {
																	setShipping({
																		...shipping,
																		city: e.target.value,
																	});
																	setError({
																		...error,
																		city: "",
																	});
																}}
																id='checkout-country'
																className='form-control'>
																<option value=''>اختر المدينة...</option>
																{getCityFromProvince?.map((city, index) => (
																	<option key={index} value={city?.name_en}>
																		{city?.name}
																	</option>
																))}
															</select>
															{error?.city && (
																<span
																	style={{
																		fontSize: "0.85rem",
																		fontWeight: "500",
																	}}
																	className='text-danger'>
																	{error?.city}
																</span>
															)}
														</div>
														<div className='form-group'>
															<label htmlFor='checkout-street-address'>
																ادخل (اسم الحي، اسم الشارع، اقرب معلم)
																<span
																	style={{
																		fontSize: "1.2rem",
																		fontWeight: "500",
																	}}
																	className='text-danger'>
																	*
																</span>
															</label>
															<input
																type='text'
																className='form-control'
																id='checkout-street-address'
																placeholder='حي العليا، شارع الملك فهد، برج المملكة'
																value={shipping?.address}
																onChange={(e) => {
																	setShipping({
																		...shipping,
																		address: e.target.value,
																	});
																	setError({
																		...error,
																		address: "",
																	});
																}}
															/>
															{error?.address && (
																<span
																	style={{
																		fontSize: "0.85rem",
																		fontWeight: "500",
																	}}
																	className='text-danger'>
																	{error?.address}
																</span>
															)}
														</div>
														<div className='form-group'>
															<label htmlFor='checkout-comment'>
																ملاحظات الشحن{" "}
															</label>
															<textarea
																id='checkout-comment'
																className='form-control'
																rows='4'
																value={shipping?.notes}
																onChange={(e) => {
																	setShipping({
																		...shipping,
																		notes: e.target.value,
																	});
																	setError({
																		...error,
																		notes: "",
																	});
																}}
															/>
															{error?.notes && (
																<span
																	style={{
																		fontSize: "0.85rem",
																		fontWeight: "500",
																	}}
																	className='text-danger'>
																	{error?.notes}
																</span>
															)}
														</div>
														<div className='form-group'>
															<div className='form-check'>
																<span className='form-check-input input-check'>
																	<span className='input-check__body'>
																		<input
																			className='input-check__input'
																			type='checkbox'
																			id='checkout-create-account'
																			value={!shipping?.defaultAddress}
																			onChange={(e) => {
																				setShipping({
																					...shipping,
																					defaultAddress: e.target.checked,
																				});
																				if (shipping?.id !== null) {
																					changeDefaultAddress(shipping?.id);
																				}
																			}}
																			checked={shipping?.defaultAddress}
																		/>
																		<span className='input-check__box' />
																		<Check9x7Svg className='input-check__icon' />
																	</span>
																</span>
																<label
																	className='form-check-label'
																	htmlFor='checkout-create-account'>
																	تعيينه كـ عنوان افتراضي
																</label>
															</div>
														</div>
													</>
												)}
											</div>
										</div>
									</div>
								)}

								<div
									className={`${
										cart?.is_service ? "col-12" : "col-12 col-lg-6 col-xl-5"
									} mt-4 mt-lg-0`}>
									<CheckoutOrderDetails
										removeAllICartItems={removeAllICartItems}
										paymentMethods={paymentMethods}
										setPaymentSelect={setPaymentSelect}
										error={error}
										shippingType={shippingType}
										btnLoading={btnLoading}
										handleCheckout={handleCheckout}
										cart={cart}
										paymentSelect={paymentSelect}
										setShowCoupon={setShowCoupon}
										setCouponError={setCouponError}
										showCoupon={showCoupon}
										coupon={coupon}
										setCoupon={setCoupon}
										handleCoupon={handleCoupon}
										loadingCoupon={loadingCoupon}
										couponError={couponError}
										shippingSelect={shippingSelect}
										setShippingSelect={setShippingSelect}
										changeShippingPrice={changeShippingPrice}
										SelectShippingTypeFunc={SelectShippingTypeFunc}
										defaultAddress={defaultAddress}
										setDefaultAddress={setDefaultAddress}
										setShipping={setShipping}
										daysDefinition={daysDefinition}
									/>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	cart: state.cart,
});

const mapDispatchToProps = {
	openLoginModal: loginModalOpen,
	changeShippingPrice,
	fetchCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout);
