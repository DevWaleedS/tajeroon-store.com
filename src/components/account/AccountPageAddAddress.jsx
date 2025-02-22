import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { Check9x7Svg } from "../../svg";
import {
	getCityFromProvinceFunc,
	removeDuplicates,
} from "../../Utilities/UtilitiesFunctions";

export default function AccountPageAddAddress() {
	const history = useHistory();
	const { fetchedData: cities } = useFetch(
		`https://backend.atlbha.sa/api/selector/shippingcities/5`
	);
	const [btnLoading, setBtnLoading] = useState(false);
	const [shipping, setShipping] = useState({
		district: "",
		city: "",
		address: "",
		postCode: "",
		defaultAddress: true,
	});

	const [error, setError] = useState({
		district: "",
		city: "",
		address: "",
		postCode: "",
		defaultAddress: "",
	});

	const resetError = () => {
		setError({
			district: "",
			city: "",
			address: "",
			postCode: "",
			defaultAddress: "",
		});
	};
	const getCityFromProvince = getCityFromProvinceFunc(
		cities?.data?.cities,
		shipping
	);

	const addNewAddress = () => {
		resetError();
		setBtnLoading(true);
		let formData = new FormData();
		formData.append("district", shipping?.district);
		formData.append("city", shipping?.city);
		formData.append("street_address", shipping?.address);
		formData.append("postal_code", shipping?.postCode);
		formData.append("default_address", shipping?.defaultAddress ? 1 : 0);
		axios
			.post(`https://backend.atlbha.sa/api/OrderAddress`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					store_domain: `${process.env.REACT_APP_STORE_DOMAIN}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setBtnLoading(false);
					toast.success(res?.data?.message?.ar, { theme: "colored" });
					setShipping({
						district: "",
						city: "",
						address: "",
						postCode: "",
						defaultAddress: true,
					});
					history.push(`/account/addresses`);
				} else {
					setBtnLoading(false);
					setError({
						district: res?.data?.message?.en?.district?.[0],
						city: res?.data?.message?.en?.city?.[0],
						address: res?.data?.message?.en?.street_address?.[0],
						postCode: res?.data?.message?.en?.postal_code?.[0],
						defaultAddress: res?.data?.message?.en?.default_address?.[0],
					});
				}
			});
	};

	return (
		<div className='card'>
			<Helmet>
				<title>{`اضافة عنوان — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<div className='card-header'>
				<h5>اضافة عنوان جديد</h5>
			</div>
			<div className='card-divider' />
			<div className='card-body'>
				<div className='row no-gutters'>
					<div className='col-12 col-lg-10 col-xl-8'>
						<div className='form-group'>
							<label htmlFor='checkout-country'>
								المنطقة{" "}
								<span
									style={{ fontSize: "1.2rem", fontWeight: "500" }}
									className='text-danger'>
									*
								</span>
							</label>
							<select
								value={shipping?.district}
								onChange={(e) => {
									setShipping({ ...shipping, district: e.target.value });
								}}
								id='checkout-country'
								className='form-control'>
								<option value='' disabled={true}>
									اختر المنطقة...
								</option>
								{removeDuplicates(cities?.data?.cities)?.map(
									(district, index) => (
										<option key={index} value={district?.region?.name_en}>
											{district?.region?.name}
										</option>
									)
								)}
							</select>
							{error?.district && (
								<span
									style={{ fontSize: "0.85rem", fontWeight: "500" }}
									className='text-danger'>
									{error?.district}
								</span>
							)}
						</div>
						<div className='form-group'>
							<label htmlFor='checkout-country'>
								المدينة{" "}
								<span
									style={{ fontSize: "1.2rem", fontWeight: "500" }}
									className='text-danger'>
									*
								</span>
							</label>
							<select
								value={shipping?.city}
								onChange={(e) =>
									setShipping({ ...shipping, city: e.target.value })
								}
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
									style={{ fontSize: "0.85rem", fontWeight: "500" }}
									className='text-danger'>
									{error?.city}
								</span>
							)}
						</div>
						<div className='form-group'>
							<label htmlFor='checkout-street-address'>
								ادخل (اسم الحي، اسم الشارع، اقرب معلم)
								<span
									style={{ fontSize: "1.2rem", fontWeight: "500" }}
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
								onChange={(e) =>
									setShipping({ ...shipping, address: e.target.value })
								}
							/>
							{error?.address && (
								<span
									style={{ fontSize: "0.85rem", fontWeight: "500" }}
									className='text-danger'>
									{error?.address}
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
											onChange={(e) =>
												setShipping({
													...shipping,
													defaultAddress: e.target.checked,
												})
											}
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
						<div className='form-group mt-3 mb-0'>
							<button
								onClick={() => addNewAddress()}
								disabled={btnLoading}
								className='btn btn-primary'
								type='button'>
								اضافة
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
