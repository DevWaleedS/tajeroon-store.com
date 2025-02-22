// react
import React, { useState } from "react";

// third-party
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { resetCartLocal } from "../../store/cart";
import axios from "axios";
// application
import Indicator from "./Indicator";
import { Person20Svg } from "../../svg";
import { loginModalOpen } from "../../store/login-modal";

function IndicatorAccount(props) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const { resetCartLocal, openLoginModal } = props;
	const [btnLoading, setBtnLoading] = useState(false);
	let history = useHistory();
	const token = localStorage.getItem("token");

	const Logout = () => {
		setBtnLoading(true);
		axios
			.get("https://backend.atlbha.sa/api/logoutcustomer", {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
					store_domain: `${process.env.REACT_APP_STORE_DOMAIN}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					resetCartLocal();
					setBtnLoading(false);
					localStorage.removeItem("token");
					localStorage.removeItem("name");
					localStorage.removeItem("email");
					localStorage.removeItem("image");
					toast.success(res?.data?.message?.ar, { theme: "colored" });
					history.push(``);
				} else {
					setBtnLoading(false);
					toast.error(res?.data?.message?.ar, { theme: "colored" });
				}
			})
			.catch((e) => {
				setBtnLoading(false);
				console.log(e);
			});
	};

	const dropdown = (
		<div className='account-menu'>
			<div className='account-menu__divider' />
			<Link to={`/account/dashboard`} className='account-menu__user'>
				<div className='account-menu__user-avatar'>
					<img
						src={localStorage.getItem("image") || "images/avatars/avatar-3.jpg"}
						alt={localStorage.getItem("name")}
					/>
				</div>
				<div className='account-menu__user-info'>
					<div className='account-menu__user-name'>
						{localStorage.getItem("name") || "Customer Name"}
					</div>
					<div className='account-menu__user-email'>
						{localStorage.getItem("email") || "sample@gmail.com"}
					</div>
				</div>
			</Link>
			<div className='account-menu__divider' />
			<ul className='account-menu__links'>
				<li>
					<Link to={`/account/profile`}>تعديل الملف الشخصي</Link>
				</li>
				<li>
					<Link to={`compare`}>المقارنات</Link>
				</li>
				<li>
					<Link to={`/account/orders`}>الطلبات</Link>
				</li>

				<li>
					<Link to={`/account/returnOrders`}>المرتجعات</Link>
				</li>

				<li>
					<Link to={`/account/addresses`}>العناوين</Link>
				</li>
			</ul>
			<div className='account-menu__divider' />
			<ul className='account-menu__links'>
				<li>
					<button
						className={`${btnLoading ? "btn-loading" : ""}`}
						disabled={btnLoading}
						onClick={Logout}>
						تسجيل الخروج
					</button>
				</li>
			</ul>
		</div>
	);

	return token ? (
		<Indicator url={`/account`} dropdown={dropdown} icon={<Person20Svg />} />
	) : (
		<div
			onClick={() => openLoginModal()}
			className='indicator indicator--trigger--click'>
			<button className='indicator__button'>
				<span className='indicator__area'>
					<Person20Svg />
				</span>
			</button>
		</div>
	);
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
	resetCartLocal,
	openLoginModal: loginModalOpen,
};
export default connect(mapStateToProps, mapDispatchToProps)(IndicatorAccount);
