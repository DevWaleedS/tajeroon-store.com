import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check100Svg } from "../../svg";

export default function ShopPageOrderSuccess() {
	return (
		<div className='block order-success'>
			<Helmet>
				<title>{`طلب ناجح — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>
			<div className='container'>
				<div className='order-success__body'>
					<div className='order-success__header'>
						<Check100Svg className='order-success__icon' />
						<h1 className='order-success__title'>شكراً لك</h1>
						<div className='order-success__subtitle'>
							تم الدفع و ارسال الطلب بنجاح
						</div>
						<div className='order-success__actions'>
							<Link to='/' className='btn btn-xs btn-secondary'>
								الصفحة الرئيسية
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
