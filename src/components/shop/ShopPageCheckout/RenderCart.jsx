import React from "react";
import Currency from "../../shared/Currency";
import RenderTotals from "./RenderTotals";

const RenderCart = ({ cart, paymentSelect, otherShippingSelect }) => {
	// to handle total of cart
	const cashOnDelivery = Number(
		otherShippingSelect?.id === 5
			? otherShippingSelect?.cod_price
			: JSON.parse(paymentSelect)?.codprice
	);

	const totalCartValue = cart?.total;
	const totalValue = cashOnDelivery
		? Number(totalCartValue + cashOnDelivery)?.toFixed(2)
		: Number(cart?.total)?.toFixed(2);

	const items = cart?.items?.map((item) => (
		<tr key={item.id}>
			<td>{`${item?.product?.name} × ${item?.qty}`}</td>

			<td>
				<Currency value={item?.sum} />
			</td>
		</tr>
	));

	return (
		<table className='checkout__totals'>
			<thead className='checkout__totals-header'>
				<tr>
					<th>{cart?.is_service ? "الخدمة" : "المنتج"}</th>
					<th>الإجمالي</th>
				</tr>
			</thead>
			<tbody className='checkout__totals-products'>{items}</tbody>
			<RenderTotals
				cart={cart}
				paymentSelect={paymentSelect}
				otherShippingSelect={otherShippingSelect}
			/>
			<tfoot className='checkout__totals-footer'>
				<tr>
					<th>
						الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
					</th>
					<td style={{ whiteSpace: "nowrap" }}>
						<Currency value={totalValue} />
					</td>
				</tr>
			</tfoot>
		</table>
	);
};

export default RenderCart;
