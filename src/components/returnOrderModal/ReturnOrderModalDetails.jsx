import React, { useState, useEffect } from "react";
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	FormGroup,
	Label,
	Form,
} from "reactstrap";

import "../../scss/returnOrdersModal/_returnOrdersModal.scss";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";

function ReturnOrderModalDetails({ returnItem, onClose }) {
	const { name } = useParams();
	const [comment, setComment] = useState("");
	const [returnReason, setReturnOrders] = useState("");

	useEffect(() => {
		setComment(returnItem?.comment);
		setReturnOrders(returnItem?.reason_txt?.title);
	}, [returnItem]);

	console.log(returnItem);

	return (
		<Modal size='lg' isOpen={true} toggle={onClose}>
			<ModalHeader className='return-orders-modal-header' toggle={onClose}>
				تفاصيل طلب الاسترجاع
			</ModalHeader>
			<Form>
				<ModalBody>
					<FormGroup>
						<Label for='returnReason'>سبب الارجاع </Label>
						<Input
							id='returnReason'
							type='text'
							readOnly
							value={returnReason}
							rows={5}
							style={{ resize: "none" }}
						/>
					</FormGroup>

					{comment && (
						<FormGroup>
							<Label for='comment'> تفاصيل السبب</Label>
							<Input
								id='comment'
								readOnly
								type='textarea'
								value={comment}
								rows={5}
								style={{ resize: "none" }}
							/>
						</FormGroup>
					)}

					<div className='card-table'>
						<h4 className='pt-5'>تفاصيل المنتجات</h4>
						<div className='table-responsive-sm'>
							<table>
								<thead>
									<tr>
										<th>المنتج</th>
										<th style={{ textAlign: "center" }}>الكمية</th>
										<th>الإجمالي</th>
									</tr>
								</thead>
								<tbody className='card-table__body card-table__body--merge-rows'>
									{returnItem?.orderItem?.map((item) => (
										<tr key={item.id}>
											<td style={{ width: "60%" }}>
												<Link
													to={{
														pathname: `/products/${encodeURIComponent(
															item?.product?.name
																.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
																.toLowerCase()
														)}/${item?.product?.id}`,
													}}
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
											<td style={{ width: "10%", textAlign: "center" }}>
												{item?.return_qty}
											</td>
											<td style={{ width: "20%" }}>{item?.total} ر.س</td>
										</tr>
									))}
								</tbody>

								<tfoot>
									<tr>
										<th>
											الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
										</th>
										<td></td>
										<td>{returnItem?.return_total} ر.س</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>

					<div className='row mt-3 no-gutters mx-n2 pt-5'>
						<div className='col-12 px-2'>
							<div className='card address-card address-card--featured'>
								<div className='address-card__body'>
									<div className='address-card__badge address-card__badge--muted'>
										عنوان الشحن
									</div>
									<div className='address-card__name'>
										{returnItem?.order?.OrderAddress?.city}
									</div>
									<div className='address-card__row'>
										{returnItem?.order?.OrderAddress?.district}
										<br />
										{returnItem?.order?.OrderAddress?.street_address}
										<br />
										{returnItem?.order?.OrderAddress?.postal_code}
									</div>
									<div className='address-card__row'>
										<div className='address-card__row-title'>رقم الهاتف</div>
										<div className='address-card__row-content'>
											{returnItem?.order?.user?.phonenumber}
										</div>
									</div>
									<div className='address-card__row'>
										<div className='address-card__row-title'>
											البريد الالكتروني
										</div>
										<div className='address-card__row-content'>
											{returnItem?.order?.user?.email}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color='secondary' onClick={onClose}>
						الغاء
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}

export default ReturnOrderModalDetails;
