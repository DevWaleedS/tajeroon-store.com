import React, { useEffect } from "react";
import Currency from "./Currency";
import { Modal } from "reactstrap";
import InputNumber from "./InputNumber";
import { Cross20Svg } from "../../svg";
import ProductOtions from "./ProductOtions";
import { toast } from "react-toastify";
import classNames from "classnames";
import { getFilterAttributes } from "../../Utilities/UtilitiesFunctions";

function OptionsModal({
	modalData,
	price,
	discount_price,
	stock,
	selectedValues,
	openModal,
	colseOptionModal,
	newStock,
	handleChangeOptions,
	cartNeedUpdateOptions,
	handleChangeQuantityOptions,
	getItemQuantity,
}) {
	let prices;

	useEffect(() => {
		if (selectedValues?.[0]?.qty > newStock) {
			handleChangeQuantityOptions(modalData, 1);
		} else {
			handleChangeQuantityOptions(modalData, selectedValues?.[0]?.qty);
		}
	}, [newStock]);

	const getItemOptions = (item) => {
		const product = selectedValues?.find((x) => x?.id === item?.id);
		return product ? product?.options : item?.options;
	};

	if (Number(modalData?.product?.discount_price) > 0) {
		prices = (
			<React.Fragment>
				<span className='product__new-price'>
					<Currency value={Number(discount_price) || 0} />
				</span>{" "}
				<span className='product__old-price'>
					<Currency value={Number(price) || 0} />
				</span>
			</React.Fragment>
		);
	} else {
		prices = <Currency value={Number(price) || 0} />;
	}
	return (
		<Modal isOpen={openModal} toggle={colseOptionModal} centered size='md'>
			<div className='quickview'>
				<button
					className='quickview__close'
					type='button'
					onClick={colseOptionModal}>
					<Cross20Svg />
				</button>
				<div className='product__prices'>
					{prices} <span className='tax-text'>السعر شامل الضريبة</span>
				</div>
				{modalData?.product?.product_has_options === 1 && (
					<ProductOtions
						product={modalData?.product}
						attributes={getFilterAttributes(modalData?.product)}
						selectedValues={getItemOptions(modalData)}
						updateSelectOptions={handleChangeOptions}
						itemProduct={modalData}
					/>
				)}
				<div className='form-group product__option'>
					<label htmlFor='product-quantity' className='product__option-label'>
						الكمية
					</label>
					<div className='product__actions m-0'>
						<div className='product__actions-item product__actions-item--addtocart'>
							<button
								type='button'
								onClick={cartNeedUpdateOptions}
								disabled={!selectedValues?.[0]?.qty || stock === "0"}
								className={classNames("btn btn-primary btn-lg")}>
								تحديث إلى السلة
							</button>
						</div>
						<div className='product__actions-item'>
							<InputNumber
								id='product-quantity'
								aria-label='Quantity'
								className='product__quantity'
								size='lg'
								onChange={(quantity) => {
									if (quantity <= newStock) {
										handleChangeQuantityOptions(modalData, quantity);
									} else {
										toast.error(
											`الكمية المتوفرة ${
												newStock === 1
													? "قطعة واحدة "
													: newStock === 2
													? " قطعتين "
													: ` ${newStock} قطع`
											} فقط `,
											{ theme: "colored" }
										);
									}
								}}
								value={getItemQuantity(selectedValues?.[0])}
								min={1}
							/>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export default OptionsModal;
