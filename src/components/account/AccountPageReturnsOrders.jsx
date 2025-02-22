// react
import React, { useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";

// icons
import { FcInfo } from "react-icons/fc";

import useFetch from "../../hooks/useFetch";
import moment from "moment/moment";
import BlockLoader from "../blocks/BlockLoader";

import ReturnOrderModalDetails from "../returnOrderModal/ReturnOrderModalDetails";
import { Pagination } from "@mui/material";

const AccountPageReturnsOrders = () => {
	const [postsPerPage] = useState(8);
	const [currentPage, setCurrentPage] = useState(1);
	const [returnOrders, setReturnOrders] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrderItems, setSelectedOrderItems] = useState({});
	let storeId = localStorage.getItem("storeId");
	const { fetchedData, loading } = useFetch(
		` https://backend.atlbha.sa/api/returnOrderIndex/${storeId}?page=${currentPage}&number=${postsPerPage}`
	);

	useEffect(() => {
		if (fetchedData) {
			setReturnOrders(fetchedData?.data?.ReturnOrders);
		}
	}, [fetchedData]);

	const openReturnModal = (items) => {
		setSelectedOrderItems(items);

		setIsModalOpen(true);
	};

	const closeReturnModal = () => {
		setIsModalOpen(false);
	};

	let ordersList = null;
	ordersList = returnOrders?.map((item, index) => (
		<tr key={item?.id}>
			<td>
				<div>
					{(index + 1).toLocaleString("en-US", {
						minimumIntegerDigits: 2,
						useGrouping: false,
					})}
				</div>
			</td>
			<td>{moment(item?.created_at).format("L")}</td>
			<td
				style={{
					width: "240px",
					maxWidth: "260px",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}>
				{item?.reason_txt?.title}
			</td>

			<td
				style={{
					width: "max-content",
					textAlign: "center",
				}}>
				{item?.status}
			</td>
			<td> {item?.return_total} ر.س</td>
			<td>
				<FcInfo
					onClick={() => openReturnModal(item)}
					style={{ width: "50px", fontSize: "20px", cursor: "pointer" }}
				/>
			</td>
		</tr>
	));

	if (returnOrders?.length === 0) {
		ordersList = (
			<tr>
				<td colSpan={5} className='text-center'>
					لاتوجد مرتجعات حتى الان
				</td>
			</tr>
		);
	}

	return (
		<div className='card'>
			<Helmet>
				<title>{`مرتجعاتي — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			{loading ? (
				<BlockLoader />
			) : (
				<>
					<div className='card-header'>
						<h5>مرتجعاتي</h5>
					</div>
					<div className='card-divider' />
					<div className='card-table'>
						<div className='table-responsive-sm'>
							<table>
								<thead>
									<tr>
										<th>م</th>
										<th>تاريخ الطلب</th>
										<th>سبب الارجاع</th>

										<th
											style={{
												width: "max-content",
												textAlign: "center",
											}}>
											حالة الطلب
										</th>
										<th>إجمالي الطلب</th>
										<th
											style={{
												width: "50px",
												textAlign: "center",
											}}>
											التفاصيل
										</th>
									</tr>
								</thead>
								<tbody>{ordersList}</tbody>
							</table>
						</div>
					</div>

					<div className='card-divider' />
					{fetchedData?.data?.page_count !== 1 && !loading && (
						<Pagination
							count={fetchedData?.data?.page_count}
							page={currentPage}
							onChange={(event, value) => {
								setCurrentPage(value);
							}}
						/>
					)}

					{isModalOpen && (
						<ReturnOrderModalDetails
							returnItem={selectedOrderItems}
							onClose={closeReturnModal}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default AccountPageReturnsOrders;
