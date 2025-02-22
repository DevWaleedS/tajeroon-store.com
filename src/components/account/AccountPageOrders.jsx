// react
import React, { useEffect, useState } from "react";

// third-party
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// application
import useFetch from "../../hooks/useFetch";
import moment from "moment/moment";
import BlockLoader from "../blocks/BlockLoader";
import { Pagination } from "@mui/material";

const AccountPageOrders = () => {
	const domain = process.env.REACT_APP_STORE_DOMAIN;

	const [currentPage, setCurrentPage] = useState(1);
	const [orders, setOrders] = useState([]);
	const [postsPerPage] = useState(8);

	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.sa/api/ordersUser/${domain}?page=${currentPage}&number=${postsPerPage}`
	);

	useEffect(() => {
		if (fetchedData) {
			setOrders(fetchedData?.data?.order);
		}
	}, [fetchedData]);

	let ordersList = null;
	ordersList = orders?.map((order) => (
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
			<td> {order?.total_price} ر.س</td>
		</tr>
	));

	if (orders?.length === 0) {
		ordersList = (
			<tr>
				<td colSpan={5} className='text-center'>
					لاتوجد طلبات حتى الان
				</td>
			</tr>
		);
	}

	return (
		<div className='card'>
			<Helmet>
				<title>{`طلباتي — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			{loading ? (
				<BlockLoader />
			) : (
				<>
					<div className='card-header'>
						<h5>طلباتي</h5>
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
								<tbody>{ordersList}</tbody>
							</table>
						</div>
					</div>
					<div className='card-divider' />
					{fetchedData?.data?.page_count !== 0 && !loading && (
						<Pagination
							count={fetchedData?.data?.page_count}
							page={currentPage}
							onChange={(event, value) => {
								setCurrentPage(value);
							}}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default AccountPageOrders;
