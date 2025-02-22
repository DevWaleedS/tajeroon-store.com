// react
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { resetCartLocal } from "../../store/cart";
import BlockLoader from "../blocks/BlockLoader";

const InactiveAccountPage = (props) => {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	const { resetCartLocal, loading, setReload, reload } = props;
	const [btnLoading, setBtnLoading] = useState(false);
	let history = useHistory();

	const deActiveAccount = () => {
		setBtnLoading(true);
		axios
			.get(`https://backend.atlbha.sa/api/deactivateAccount`, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
					store_domain: `${process.env.REACT_APP_STORE_DOMAIN}`,
				},
			})
			.then((res) => {
				if (
					res?.data?.success === true &&
					res?.data?.data?.status === 200 &&
					res?.data?.message?.ar === "تم تعطيل   المستخدم بنجاح"
				) {
					toast.success(res?.data?.message?.ar, { theme: "colored" });
					setBtnLoading(false);
					Logout();
					setReload(!reload);
				} else {
					setBtnLoading(false);
					toast.error(res?.data?.message?.ar, { theme: "colored" });
					setReload(!reload);
				}
			});
	};

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
					history.push(`/${store_domain}`);
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

	if (loading) {
		return <BlockLoader />;
	}

	return (
		<div className='card'>
			<Helmet>
				<title>{`تعطيل الحساب — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>
			<>
				<div className='card-header'>
					<h5>تعطيل الحساب</h5>
				</div>
				<div className='card-divider' />
				<div className='d-flex flex-column gap-3 p-2'>
					<p>
						يمكنك تعطيل حسابك مؤقتاً من خلال النقر على زر تعطيل الحساب بالاسفل
						علماً ان معلومات الحساب لن تنحذف من بيانات المتجر
					</p>
					<button
						disabled={btnLoading}
						className='deactive-btn'
						onClick={() => deActiveAccount()}>
						تعطيل الحساب
					</button>
				</div>
			</>
		</div>
	);
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
	resetCartLocal,
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(InactiveAccountPage);
