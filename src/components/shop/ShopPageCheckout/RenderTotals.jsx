import React from "react";
import Currency from "../../shared/Currency";

const RenderTotals = ({ cart, paymentSelect, otherShippingSelect }) => {
	return (
		<React.Fragment>
			<tbody className='checkout__totals-subtotals'>
				<tr>
					<th>السعر</th>
					<td>
						<Currency value={cart.subtotal} />
					</td>
				</tr>
				<tr>
					<th>الضريبة</th>
					<td>
						<Currency value={cart?.tax} />
					</td>
				</tr>
				{cart?.overweight_price > 0 ? (
					<tr>
						<th>قيمة الوزن الزائد ({cart?.overweight} kg)</th>
						<td>
							<Currency value={cart?.overweight_price} />
						</td>
					</tr>
				) : null}
				{cart?.shipping > 0 ? (
					<tr>
						<th>الشحن</th>
						{cart?.shipping > 0 ? (
							<td>
								<Currency value={cart?.shipping} />
							</td>
						) : (
							<td>شحن مجاني</td>
						)}
					</tr>
				) : null}
				{cart?.discount_type !== null && (
					<tr>
						<th>
							الخصم{" "}
							{cart?.discount_type === "fixed" ? null : (
								<span style={{ fontSize: "0.85rem", color: "#7e7e7e" }}>
									({cart?.discount_price}%)
								</span>
							)}
						</th>
						<td>
							<Currency value={cart?.discount_total} />
						</td>
					</tr>
				)}

				{JSON.parse(paymentSelect)?.id === 4 ? (
					<tr>
						<th>الدفع عند الاستلام</th>
						<td>
							<Currency value={Number(JSON.parse(paymentSelect)?.codprice)} />
						</td>
					</tr>
				) : otherShippingSelect?.id === 5 &&
				  otherShippingSelect?.cod_price !== 0 ? (
					<tr>
						<th>الدفع عند الاستلام</th>
						<td>
							<Currency
								value={Number(
									otherShippingSelect?.id === 5
										? otherShippingSelect?.cod_price
										: JSON.parse(paymentSelect)?.codprice
								)}
							/>
						</td>
					</tr>
				) : null}
			</tbody>
		</React.Fragment>
	);
};

export default RenderTotals;
