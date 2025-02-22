// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// application
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export default function ShopPageOrderSuccess() {
	return (
		<div className='block order-success'>
			<Helmet>
				<title>{`طلب فاشل — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<div className='container'>
				<div className='order-success__body'>
					<div className='order-success__header'>
						<CancelOutlinedIcon
							className='order-success__icon'
							style={{ fill: "#e42c2c", fontSize: "7rem" }}
						/>
						<h1 className='order-success__title'>مع الاسف</h1>
						<div className='order-success__subtitle'>
							فشلت عملية الدفع يرجى المحاولة لاحقاً
						</div>
						<div className='order-success__actions'>
							<Link to={`/`} className='btn btn-xs btn-secondary'>
								الصفحة الرئيسية
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
