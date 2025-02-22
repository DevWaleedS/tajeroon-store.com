import React, { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import useFetch from "../../hooks/useFetch";
import BlockLoader from "../blocks/BlockLoader";
import { translateCityNameFunc } from "../../Utilities/UtilitiesFunctions";

export default function AccountPageAddresses() {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const [btnLoading, setBtnLoading] = useState(false);
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.sa/api/OrderAddress?domain=${domain}`
	);
	const { fetchedData: cities, loading: citiesLoading } = useFetch(
		`https://backend.atlbha.sa/api/selector/shippingcities/5`
	);

	function translateProvinceName(name) {
		const unique = cities?.data?.cities?.filter(
			(obj) => obj?.region?.name_en === name
		);
		return unique?.[0]?.name || name;
	}

	const deleteAddresss = (id) => {
		axios
			.delete(`https://backend.atlbha.sa/api/OrderAddress/${id}`, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					store_domain: `${process.env.REACT_APP_STORE_DOMAIN}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setBtnLoading(false);
					setReload(!reload);
					toast.success(res?.data?.message?.ar, { theme: "colored" });
				} else {
					setBtnLoading(false);
					setReload(!reload);
					toast.error(res?.data?.message?.ar, { theme: "colored" });
				}
			});
	};

	const addresses = fetchedData?.data?.orderAddress?.map((address, index) => (
		<React.Fragment key={index}>
			<div className='addresses-list__item card address-card'>
				{address?.default_address === 1 && (
					<div className='address-card__badge'>العنوان الافتراضي</div>
				)}

				<div className='address-card__body'>
					<div className='address-card__name'>
						{translateCityNameFunc(cities?.data?.cities, address?.city)}
					</div>
					<div className='address-card__row'>
						{translateProvinceName(address?.district)}
					</div>
					<div className='address-card__row'>{address?.street_address}</div>
					<div className='address-card__row'>{address?.postal_code}</div>
					<div className='address-card__footer'>
						<Link to={`/account/addresses/${address?.id}`}>تعديل</Link>
						&nbsp;&nbsp;
						<button
							disabled={btnLoading}
							style={{
								color: "#1a66ff",
								backgroundColor: "transparent",
								border: "none",
							}}
							onClick={() => deleteAddresss(address?.id)}
							type='button'>
							حذف
						</button>
					</div>
				</div>
			</div>
			<div className='addresses-list__divider' />
		</React.Fragment>
	));

	return (
		<div className='addresses-list'>
			<Helmet>
				<title>{`العناوين  — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>
			{loading && citiesLoading ? (
				<div className='w-100 d-flex flex-row justify-content-center'>
					<BlockLoader />
				</div>
			) : (
				<>
					<Link
						to={`/account/addresses/add-address`}
						className='addresses-list__item addresses-list__item--new'>
						<div className='addresses-list__plus' />
						<div className='btn btn-secondary btn-sm'>اضافة عنوان جديد</div>
					</Link>
					<div className='addresses-list__divider' />

					{addresses}
				</>
			)}
		</div>
	);
}
