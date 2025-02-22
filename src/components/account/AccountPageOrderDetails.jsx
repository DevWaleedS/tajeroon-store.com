import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { Helmet } from "react-helmet-async";
import BlockLoader from "../blocks/BlockLoader";
import { FaServicestack } from "react-icons/fa";
import { AiFillCopy, AiFillCheckCircle } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReturnOrderModal from "../returnOrderModal/ReturnOrderModal";
import useFetch from "../../hooks/useFetch";

export default function AccountPageOrderDetails() {
	const domain = process.env.REACT_APP_STORE_DOMAIN;

	const [copy, setCopy] = useState(false);
	const [orderItems, setOrderItems] = useState([]);
	const [selectedOrderItems, setSelectedOrderItems] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const orderId = localStorage.getItem("order_id");
	const { fetchedData, loading, setReload, reload } = useFetch(
		`https://backend.atlbha.sa/api/orderUser/${domain}/${orderId}`
	);

	const handleToggleAll = (e) => {
		if (e.target.checked) {
			setSelectedOrderItems(orderItems);
		} else {
			setSelectedOrderItems([]);
		}
	};

	const handleToggleItem = (item) => {
		setSelectedOrderItems((prev) =>
			prev.some((i) => i.id === item.id)
				? prev.filter((i) => i.id !== item.id)
				: [...prev, item]
		);
	};

	useEffect(() => {
		if (fetchedData) {
			setOrderItems(fetchedData?.data?.order?.orderItem || []);
		}
	}, [fetchedData]);

	const printDocument = () => {
		const input = document.getElementById("printableArea");
		html2canvas(input)
			.then((canvas) => {
				const imgData = canvas.toDataURL("image/png");
				const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = pdf.internal.pageSize.getHeight();
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;
				let finalWidth = pdfWidth;
				let finalHeight = canvasHeight * (pdfWidth / canvasWidth);

				if (finalHeight > pdfHeight) {
					finalHeight = pdfHeight;
					finalWidth = canvasWidth * (pdfHeight / canvasHeight);
				}

				const x = (pdfWidth - finalWidth) / 2;
				const y = 0;

				pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
				pdf.save(`invoice(${fetchedData?.data?.order?.order_number}).pdf`);
			})
			.catch((err) => console.error("Error while generating PDF", err));
	};

	const handleCancelOrder = async () => {
		try {
			const response = await axios.get(
				`https://backend.atlbha.sa/api/cancelOrder/${orderId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						store_domain: `${process.env.REACT_APP_STORE_DOMAIN}`,
					},
				}
			);
			if (response?.data?.success && response?.data?.data?.status === 200) {
				setReload(!reload);
				toast.success(response?.data?.message?.ar, { theme: "colored" });
			} else {
				toast.error(response?.data?.message?.ar, { theme: "colored" });
			}
		} catch (error) {
			console.error("Error occurred while canceling order", error);
		}
	};

	const openReturnModal = (items) => {
		if (items.length === 0) {
			toast.warning("حدد المنتجات المراد ارجاعها", { theme: "colored" });
			return;
		}

		setSelectedOrderItems(Array.isArray(items) ? items : [items]);
		setIsModalOpen(true);
	};

	const closeReturnModal = () => {
		setIsModalOpen(false);
	};

	const handlePeriod = (period) => {
		const numPeriod = Number(period);

		if (numPeriod === 1) return <span className='text-success'>يوم واحد</span>;
		if (numPeriod === 2) return <span className='text-success'>يومين</span>;
		if (numPeriod >= 3 && numPeriod <= 10)
			return <span className='text-success'>{period} أيام</span>;
		return <span className='text-success'>{period} يوم</span>;
	};
	return (
		<React.Fragment>
			<Helmet>
				<title>{`تفاصيل الطلب — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			{loading ? (
				<BlockLoader />
			) : (
				<>
					<section className='d-flex justify-content-between'>
						<div
							className='d-block'
							style={{ width: "max-content", cursor: "pointer" }}>
							<h5 className='btn-xs btn-secondary' onClick={printDocument}>
								تحميل الفاتورة
							</h5>
						</div>

						{!fetchedData?.data?.order?.is_service &&
							(fetchedData?.data?.order?.status === "جديد" ||
								fetchedData?.data?.order?.status === "قيد التجهيز") && (
								<div
									className='d-block'
									style={{ width: "max-content", cursor: "pointer" }}>
									<h5 className='btn-xs btn-danger' onClick={handleCancelOrder}>
										الغاء الطلب
									</h5>
								</div>
							)}
					</section>
					<section id='printableArea'>
						<div className='card'>
							<div className='order-header'>
								<div className='order-header__actions'>
									{fetchedData?.data?.order?.is_service ? null : (
										<h5
											className='btn-xs btn-secondary'
											style={{ cursor: "text", width: "max-content" }}>
											كمية الطلب ({fetchedData?.data?.order?.quantity})
										</h5>
									)}
								</div>
								<h5 className='order-header__title'>
									طلب رقم {`#${fetchedData?.data?.order?.order_number}`}
								</h5>
								<div className='order-header__subtitle'>
									<div className='subtitle'>
										حالة الطلب:
										<mark className='order-header__status'>
											{fetchedData?.data?.order?.status}
										</mark>
									</div>
									<div className='subtitle payment-status'>
										حالة الدفع:
										{fetchedData?.data?.order?.payment_status ===
										"لم يتم الدفع" ? (
											<mark className='order-header__status pending'>
												{fetchedData?.data?.order?.payment_status}
											</mark>
										) : fetchedData?.data?.order?.payment_status ===
										  "تم الدفع" ? (
											<mark className='order-header__status success'>
												{fetchedData?.data?.order?.payment_status}
											</mark>
										) : (
											<mark className='order-header__status failed'>
												{fetchedData?.data?.order?.payment_status}
											</mark>
										)}
									</div>
									<div className='subtitle'>
										تم طلبه بتاريخ
										<mark className='order-header__date'>
											{moment(fetchedData?.data?.order?.created_at).format("L")}
										</mark>
									</div>

									{fetchedData?.data?.order?.shipping?.shipping_id ? (
										<div className='d-flex flex-column align-items-start mt-2'>
											<div
												className='d-flex flex-row align-items-center'
												style={{ gap: "0.3rem" }}>
												<FaServicestack />
												<span className='me-2'>رقم التتبع</span>{" "}
												<span
													className='me-2'
													style={{
														display: "flex",
														flexDirection: "row",
														alignItems: "center",
														fontSize: "14px",
													}}>
													( انسخ رقم التتبع و تتبع الشحنة من هنا
													<a
														href={fetchedData?.data?.order?.trackingLink}
														target='_blank'
														rel='noreferrer'>
														<BiLinkExternal
															style={{
																width: "16px",
																cursor: "pointer",
																color: "#5c5cff",
															}}
														/>
													</a>
													)
												</span>
											</div>
											<div className='order-data-row track_id_box'>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{ gap: "0.3rem" }}>
													<span className='track_id_input'>
														{fetchedData?.data?.order?.shipping?.shipping_id}
													</span>
													{copy ? (
														<div className='copy-track_id-icon'>
															<AiFillCheckCircle color='#1dbbbe' />
														</div>
													) : (
														<div className='copy-track_id-icon'>
															<AiFillCopy
																color='#1dbbbe'
																style={{ cursor: "pointer" }}
																onClick={() => {
																	setCopy(true);
																	setTimeout(() => {
																		navigator.clipboard.writeText(
																			fetchedData?.data?.order?.shipping
																				?.shipping_id
																		);
																		setCopy(false);
																	}, 1000);
																}}
															/>
														</div>
													)}
												</div>
											</div>
										</div>
									) : null}
								</div>
							</div>

							{(fetchedData?.data?.order?.status === "تم الشحن" ||
								fetchedData?.data?.order?.status === "مكتمل") &&
								!fetchedData?.data?.order?.is_return && (
									<div className='pl-4'>
										<h5
											className='btn-xs btn-secondary'
											style={{
												width: "max-content",
												marginRight: "auto",
												cursor: "pointer",
												opacity: `${
													selectedOrderItems.length === 0 ? "0.5" : "1"
												}`,
											}}
											onClick={() => openReturnModal(selectedOrderItems)}>
											ارجاع الطلب
										</h5>
									</div>
								)}
							<div className='card-divider' />
							{(fetchedData?.data?.order?.status === "تم الشحن" ||
								fetchedData?.data?.order?.status === "مكتمل") &&
							!fetchedData?.data?.order?.is_return ? (
								<div className='card-table'>
									<div className='table-responsive-sm'>
										<table>
											<thead>
												<tr style={{ borderBottom: "2px solid #f0f0f0" }}>
													<th>
														<input
															type='checkbox'
															onChange={handleToggleAll}
															checked={
																orderItems?.length > 0 &&
																selectedOrderItems?.length ===
																	orderItems?.length
															}
														/>
													</th>

													{fetchedData?.data?.order?.is_service ? (
														<>
															<th>اسم الخدمة</th>
															<th style={{ textAlign: "center" }}>
																مدة التنفيذ
															</th>
														</>
													) : (
														<>
															<th>اسم المنتج</th>

															<th style={{ textAlign: "center" }}>الكمية</th>
														</>
													)}

													<th>الإجمالي</th>
												</tr>
											</thead>
											<tbody className='card-table__body card-table__body--merge-rows'>
												{orderItems?.map((item) => (
													<tr key={item.id}>
														<td>
															<input
																type='checkbox'
																checked={selectedOrderItems.some(
																	(i) => i.id === item.id
																)}
																onChange={() => handleToggleItem(item)}
															/>
														</td>

														<td style={{ width: "50%" }}>
															<Link
																to={
																	item?.is_service
																		? `/services/${
																				item?.product?.id
																		  }/${encodeURIComponent(
																				item?.product?.name
																					.replace(
																						/[^a-zA-Z0-9\u0621-\u064A]+/g,
																						"-"
																					)
																					.toLowerCase()
																		  )}`
																		: `/products/${encodeURIComponent(
																				item?.product?.name
																					.replace(
																						/[^a-zA-Z0-9\u0621-\u064A]+/g,
																						"-"
																					)
																					.toLowerCase()
																		  )}/${item?.product?.id}`
																}
																style={{
																	display: "flex",
																	justifyContent: "start",
																	alignItems: "center",
																	gap: "4px",
																}}>
																<div
																	style={{
																		width: "35px",
																		border: "1px solid #ddd",
																		padding: "5px",
																		borderRadius: "50%",
																		overflow: "hidden",
																	}}>
																	<img
																		src={item?.product?.cover}
																		alt={item?.product?.name}
																		style={{ maxWidth: "100%", height: "100%" }}
																	/>
																</div>
																<span>{item?.product?.name}</span>
															</Link>
														</td>
														{fetchedData?.data?.order?.is_service ? (
															<td style={{ width: "10%", textAlign: "center" }}>
																{item?.period
																	? handlePeriod(item?.period)
																	: null}
															</td>
														) : (
															<td style={{ width: "10%", textAlign: "center" }}>
																{item?.quantity}
															</td>
														)}
														<td>{item?.sum} ر.س</td>
													</tr>
												))}
											</tbody>
											<tbody className='card-table__body card-table__body--merge-rows'>
												<tr>
													<td colSpan='3'>السعر</td>
													<td style={{ textAlign: "right" }}>
														{fetchedData?.data?.order?.subtotal} ر.س
													</td>
													<td></td>
												</tr>
												<tr>
													<td colSpan='3'>الضريبة</td>
													<td style={{ textAlign: "right" }}>
														{fetchedData?.data?.order?.tax} ر.س
													</td>
													<td></td>
												</tr>
												{fetchedData?.data?.order?.overweight_price > 0 && (
													<tr>
														<td colSpan='3'>
															قيمة الوزن الزائد (
															{fetchedData?.data?.order?.overweight} kg)
														</td>
														<td style={{ textAlign: "right" }}>
															{fetchedData?.data?.order?.overweight_price} ر.س{" "}
														</td>
														<td></td>
													</tr>
												)}
												{fetchedData?.data?.order?.shipping_price > 0 && (
													<tr>
														<td colSpan='3'>الشحن</td>
														<td style={{ textAlign: "right" }}>
															{fetchedData?.data?.order?.shipping_price} ر.س{" "}
														</td>
														<td></td>
													</tr>
												)}

												{fetchedData?.data?.order?.cod === "1" && (
													<tr>
														<td colSpan='3'>الدفع عند الاستلام</td>
														<td style={{ textAlign: "right" }}>
															{fetchedData?.data?.order?.codprice} ر.س{" "}
														</td>
														<td></td>
													</tr>
												)}
												{fetchedData?.data?.order?.discount !== 0 && (
													<tr>
														<td colSpan='3'>الخصم</td>
														<td style={{ textAlign: "right" }}>
															{Number(fetchedData?.data?.order?.discount)} ر.س{" "}
														</td>
														<td></td>
													</tr>
												)}
											</tbody>
											<tfoot>
												<tr>
													<td colSpan='3'>
														الإجمالي{" "}
														<span className='tax-text'>(شامل الضريبة)</span>
													</td>
													<td style={{ textAlign: "right" }}>
														{fetchedData?.data?.order?.total_price} ر.س{" "}
													</td>
													<td></td>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>
							) : (
								<div className='card-table'>
									<div className='table-responsive-sm'>
										<table>
											<thead>
												<tr>
													{fetchedData?.data?.order?.is_service ? (
														<>
															<th>اسم الخدمة</th>
															<th style={{ textAlign: "center" }}>
																مدة التنفيذ
															</th>
														</>
													) : (
														<>
															<th>اسم المنتج</th>
															<th style={{ textAlign: "center" }}>الكمية</th>
														</>
													)}
													<th>الإجمالي</th>
												</tr>
											</thead>
											<tbody className='card-table__body card-table__body--merge-rows'>
												{orderItems?.map((item) => (
													<tr key={item.id}>
														<td style={{ width: "60%" }}>
															<Link
																to={
																	item?.is_service
																		? `/services/${
																				item?.product?.id
																		  }/${encodeURIComponent(
																				item?.product?.name
																					.replace(
																						/[^a-zA-Z0-9\u0621-\u064A]+/g,
																						"-"
																					)
																					.toLowerCase()
																		  )}`
																		: `/products/${encodeURIComponent(
																				item?.product?.name
																					.replace(
																						/[^a-zA-Z0-9\u0621-\u064A]+/g,
																						"-"
																					)
																					.toLowerCase()
																		  )}/${item?.product?.id}`
																}
																style={{
																	display: "flex",
																	justifyContent: "start",
																	alignItems: "center",
																	gap: "4px",
																}}>
																<div
																	style={{
																		width: "35px",
																		border: "1px solid #ddd",
																		padding: "5px",
																		borderRadius: "50%",
																		overflow: "hidden",
																	}}>
																	<img
																		src={item?.product?.cover}
																		alt={item?.product?.name}
																		style={{ maxWidth: "100%", height: "100%" }}
																	/>
																</div>
																<span>{item?.product?.name}</span>
															</Link>
														</td>

														{fetchedData?.data?.order?.is_service ? (
															<td style={{ width: "10%", textAlign: "center" }}>
																{item?.period
																	? handlePeriod(item?.period)
																	: null}
															</td>
														) : (
															<td style={{ width: "10%", textAlign: "center" }}>
																{item?.quantity}
															</td>
														)}

														<td style={{ width: "20%" }}>{item?.sum} ر.س</td>
													</tr>
												))}
											</tbody>
											<tbody className='card-table__body card-table__body--merge-rows'>
												<tr>
													<th>السعر</th>
													<td></td>
													<td>{fetchedData?.data?.order?.subtotal} ر.س</td>
												</tr>
												<tr>
													<th>الضريبة </th>
													<td></td>
													<td>{fetchedData?.data?.order?.tax} ر.س</td>
												</tr>
												{fetchedData?.data?.order?.overweight_price > 0 && (
													<tr>
														<th>
															قيمة الوزن الزائد (
															{fetchedData?.data?.order?.overweight} kg)
														</th>
														<td></td>
														<td>
															{fetchedData?.data?.order?.overweight_price} ر.س
														</td>
													</tr>
												)}
												{fetchedData?.data?.order?.shipping_price > 0 && (
													<tr>
														<th>الشحن</th>
														<td></td>
														<td>
															{fetchedData?.data?.order?.shipping_price} ر.س
														</td>
													</tr>
												)}

												{fetchedData?.data?.order?.cod === "1" && (
													<tr>
														<th>الدفع عند الإستلام</th>
														<td></td>
														<td>{fetchedData?.data?.order?.codprice} ر.س</td>
													</tr>
												)}

												{fetchedData?.data?.order?.discount > 0 && (
													<tr>
														<th>الخصم</th>
														<td></td>
														<td>
															{Number(fetchedData?.data?.order?.discount)} ر.س
														</td>
													</tr>
												)}
											</tbody>
											<tfoot>
												<tr>
													<th>
														الإجمالي{" "}
														<span className='tax-text'>(شامل الضريبة)</span>
													</th>
													<td></td>
													<td>{fetchedData?.data?.order?.total_price} ر.س</td>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>
							)}
						</div>

						{!fetchedData?.data?.order?.is_service ? (
							<div className='row mt-3 no-gutters mx-n2'>
								<div className='col-12 px-2'>
									<div className='card address-card address-card--featured'>
										<div className='address-card__body'>
											<div className='address-card__badge address-card__badge--muted'>
												عنوان الشحن
											</div>
											<div className='address-card__name'>
												{fetchedData?.data?.order?.OrderAddress?.city}
											</div>
											<div className='address-card__row'>
												{fetchedData?.data?.order?.OrderAddress?.district}
												<br />
												{fetchedData?.data?.order?.OrderAddress?.street_address}
												<br />
												{fetchedData?.data?.order?.OrderAddress?.postal_code}
											</div>
											<div className='address-card__row'>
												<div className='address-card__row-title'>
													رقم الهاتف
												</div>
												<div className='address-card__row-content'>
													{fetchedData?.data?.order?.user?.phonenumber}
												</div>
											</div>
											<div className='address-card__row'>
												<div className='address-card__row-title'>
													البريد الالكتروني
												</div>
												<div className='address-card__row-content'>
													{fetchedData?.data?.order?.user?.email}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						) : null}

						{isModalOpen && (
							<ReturnOrderModal
								products={selectedOrderItems}
								onClose={closeReturnModal}
							/>
						)}
					</section>
				</>
			)}
		</React.Fragment>
	);
}
