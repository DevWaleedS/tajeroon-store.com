// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import moment from "moment/moment";

import BlockLoader from "../blocks/BlockLoader";
import useFetch from "../../hooks/useFetch";

export default function AccountPageDashboard({ fetchedData, loading }) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;

	// to get the orders
	const { fetchedData: ordersData, loading: loadingOrders } = useFetch(
		` https://backend.atlbha.sa/api/ordersUser/${domain}`
	);

	// to get the default address
	const { fetchedData: orderAddress } = useFetch(
		`https://backend.atlbha.sa/api/OrderAddress?domain=${domain}`
	);
	const defaultAddress = orderAddress?.data?.orderAddress?.find(
		(address) => address?.default_address === 1
	);

	// to get the first 3 orders
	let orders = null;
	orders = ordersData?.data?.order?.slice(0, 3)?.map((order) => (
		<tr key={order?.id}>
			<td>
				<Link
					onClick={() => {
						localStorage.setItem("order_id", order?.id);
					}}
					to={`/account/orders/${order?.id}`}>{`#${order?.order_number}`}</Link>
			</td>
			<td>{moment(order?.created_at).format("L")}</td>
			<td>{order?.status}</td>
			<td>{order?.payment_status}</td>
			<td>{order?.total_price} ر.س</td>
		</tr>
	));

	if (ordersData?.data?.order?.length === 0) {
		orders = (
			<tr>
				<td colSpan={5} className='text-center'>
					لاتوجد طلبات حتى الان
				</td>
			</tr>
		);
	}

	if (loadingOrders) {
		orders = (
			<tr>
				<td colSpan={5} className='text-center'>
					جاري التحميل ...
				</td>
			</tr>
		);
	}

	if (loading) {
		return <BlockLoader />;
	}

	return (
		<div className='dashboard'>
			<Helmet>
				<title>{`حسابي — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<div className='dashboard__profile card profile-card'>
				<div className='card-body profile-card__body'>
					<div className='profile-card__avatar'>
						<img
							src={
								fetchedData?.data?.users?.image || "images/avatars/avatar-3.jpg"
							}
							alt={fetchedData?.data?.users?.name}
						/>
					</div>
					<div className='profile-card__name'>{`${
						fetchedData?.data?.users?.name || "Customer"
					} ${fetchedData?.data?.users?.lastname}`}</div>
					<div className='profile-card__email'>
						{fetchedData?.data?.users?.email || "sample@gmail.com"}
					</div>
					<div className='profile-card__edit'>
						<Link to='profile' className='btn btn-secondary btn-sm'>
							تعديل الملف الشخصي
						</Link>
					</div>
				</div>
			</div>
			<div className='dashboard__address card address-card address-card--featured'>
				<div className='address-card__badge' style={{ color: "#FFF" }}>
					العنوان الافتراضي
				</div>

				<div className='address-card__body'>
					<div className='address-card__name'>{defaultAddress?.city}</div>
					<div className='address-card__row'>
						{defaultAddress?.district}
						<br />
						{defaultAddress?.street_address}
						<br />
						{defaultAddress?.postal_code}
					</div>
					<div className='address-card__row'>
						<div className='address-card__row-title'>رقم الهاتف</div>
						<div className='address-card__row-content'>
							{fetchedData?.data?.users?.phonenumber?.startsWith("+966")
								? fetchedData?.data?.users?.phonenumber?.slice(4)
								: fetchedData?.data?.users?.phonenumber?.startsWith("00966")
								? fetchedData?.data?.users?.phonenumber.slice(5)
								: fetchedData?.data?.users?.phonenumber}
						</div>
					</div>
					<div className='address-card__row'>
						<div className='address-card__row-title'>البريد الالكتروني</div>
						<div className='address-card__row-content'>
							{fetchedData?.data?.users?.email || "sample@gmail.com"}
						</div>
					</div>
				</div>
			</div>
			<div className='dashboard__orders card'>
				<div className='card-header'>
					<h5>آخر الطلبات</h5>
				</div>
				<div className='card-divider' />
				<div className='card-table'>
					<div className='table-responsive-sm'>
						<table>
							<thead>
								<tr>
									<th>رقم الطلب</th>
									<th>تاريخ الطلب</th>
									<th>حالة الطلب</th>
									<th>حالة الدفع</th>
									<th>الإجمالي</th>
								</tr>
							</thead>
							<tbody>{orders}</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
