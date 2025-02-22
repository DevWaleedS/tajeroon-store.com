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
	Table,
} from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "../../scss/returnOrdersModal/_returnOrdersModal.scss";
import useFetch from "../../hooks/useFetch";
import InputNumber from "../shared/InputNumber";

function ReturnOrderModal({ products, onClose }) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const [comment, setComment] = useState("");
	const [btnLoading, setBtnLoading] = useState(false);
	const [returnReason, setReturnReason] = useState("");
	const [productDetails, setProductDetails] = useState([]);
	const { fetchedData: returnReasonsData } = useFetch(
		`https://backend.atlbha.sa/api/selector/returnReasons`
	);

	useEffect(() => {
		if (Array.isArray(products) && products.length > 0) {
			const initialDetails = products.map((product) => ({
				orderItemId: product.id || "",
				qty: Number(product.quantity) || 1, // Use explicit conversion to avoid NaN
				originalQty: Number(product.quantity) || 1, // Convert to a number
			}));
			setProductDetails(initialDetails);
		} else {
			setProductDetails([]);
		}
	}, [products]);

	const handleChangeQuantity = (index, value) => {
		const updatedDetails = [...productDetails];
		const newQty = Number(value);

		if (isNaN(newQty)) {
			toast.error("الكمية المدخلة غير صحيحة");
			return;
		}

		if (newQty <= 0) {
			toast.error("يجب ان تكون الكميه منتج واحد علي الاقل");
			return;
		}

		if (newQty > updatedDetails[index].originalQty) {
			toast.error("الكميه المدخله اكبر من الكميه الحاليه للمنتج");
			return;
		}

		updatedDetails[index].qty = newQty;
		setProductDetails(updatedDetails);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("order_id", localStorage.getItem("order_id"));
		formData.append("store_id", localStorage.getItem("storeId"));
		formData.append("return_reason_id", returnReason);
		if (comment) {
			formData.append("comment", comment);
		}

		productDetails.forEach((product, index) => {
			formData.append(`data[${index}][order_item_id]`, product.orderItemId);
			formData.append(`data[${index}][qty]`, product.qty);
		});

		setBtnLoading(true);
		try {
			const response = await axios.post(
				"https://backend.atlbha.sa/api/returnOrder",
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						store_domain: store_domain,
					},
				}
			);

			if (
				response?.data?.success === true &&
				response?.data?.data?.status === 200
			) {
				toast.success(response?.data?.message?.ar, { theme: "colored" });
				onClose();
			} else {
				toast.error(
					response?.data?.message?.ar
						? response?.data?.message?.ar
						: response?.data?.message?.en,
					{
						theme: "colored",
					}
				);

				toast.error(response?.message, { theme: "colored" });
				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error occurred while returning order", error);
		}
		setBtnLoading(false);
	};

	return (
		<Modal
			size='lg'
			isOpen={!!products && products.length > 0}
			toggle={onClose}>
			<ModalHeader className='return-orders-modal-header' toggle={onClose}>
				ارجاع الطلب
			</ModalHeader>
			<Form onSubmit={handleSubmit}>
				<ModalBody>
					<h4>تفاصيل المنتجات</h4>
					<Table className='mb-4' hover responsive size='sm' striped>
						<thead>
							<tr>
								<th>الصورة</th>
								<th>اسم المنتج</th>
								<th style={{ textAlign: "right", paddingRight: "40px" }}>
									الكمية
								</th>
								<th style={{ textAlign: "center" }}>السعر</th>
							</tr>
						</thead>
						<tbody>
							{products.map((item, index) => (
								<tr key={item.id}>
									<td>
										<img
											src={item?.product.cover}
											alt={item?.product.name}
											style={{ width: "50px" }}
										/>
									</td>
									<td
										style={{
											width: "240px",
											maxWidth: "280px",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}>
										{item?.product.name}
									</td>
									<td style={{ textAlign: "center" }}>
										<InputNumber
											className='product__quantity'
											size='sm'
											onChange={(value) => handleChangeQuantity(index, value)}
											value={productDetails[index]?.qty || ""}
											min={1}
										/>
									</td>
									<td style={{ textAlign: "center" }}>{item?.price} ر.س</td>
								</tr>
							))}
						</tbody>
					</Table>

					<FormGroup>
						<Label for='returnReason'>
							حدد سبب الارجاع{" "}
							<span
								style={{ fontSize: "1.2rem", fontWeight: "500" }}
								className='text-danger'>
								*
							</span>
						</Label>
						<Input
							type='select'
							name='returnReason'
							id='returnReason'
							value={returnReason}
							onChange={(e) => setReturnReason(e.target.value)}>
							<option value=''>سبب الارجاع</option>
							{returnReasonsData?.data?.return_reasons?.map((reason) => (
								<option key={reason.id} value={reason.id}>
									{reason.title}
								</option>
							))}
						</Input>
					</FormGroup>

					{returnReason === "5" && (
						<FormGroup>
							<Label for='comment'>ادخل سبب الارجاع</Label>
							<Input
								id='comment'
								type='textarea'
								value={comment}
								rows={5}
								style={{ resize: "none" }}
								onChange={(e) => setComment(e.target.value)}
							/>
						</FormGroup>
					)}
				</ModalBody>
				<ModalFooter>
					<Button type='submit' color='primary' disabled={btnLoading}>
						{btnLoading ? (
							<span className='btn-loading'></span>
						) : (
							"تأكيد الارجاع"
						)}
					</Button>
					<Button color='secondary' onClick={onClose}>
						الغاء
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}

export default ReturnOrderModal;
