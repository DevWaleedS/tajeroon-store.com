// react
import React, { useEffect, useState } from "react";
import axios from "axios";

// third-party
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

import BlockLoader from "../blocks/BlockLoader";

export default function AccountPageProfile({
	fetchedData,
	loading,
	reload,
	setReload,
}) {
	const token = localStorage.getItem("token");
	const [btnLoading, setBtnLoading] = useState(false);
	const [previewImage, setPeviewImage] = useState(null);
	const [userData, setUserData] = useState({
		firstName: fetchedData?.data?.users?.name || "",
		secondName: fetchedData?.data?.users?.lastname || "",
		email: fetchedData?.data?.users?.email || "",
		phonenumber: fetchedData?.data?.users?.phonenumber?.startsWith("+966")
			? fetchedData?.data?.users?.phonenumber?.slice(4)
			: fetchedData?.data?.users?.phonenumber?.startsWith("00966")
			? fetchedData?.data?.users?.phonenumber.slice(5)
			: fetchedData?.data?.users?.phonenumber || "",
		image: null,
	});

	const [DataError, setDataError] = useState({
		firstName: "",
		secondName: "",
		email: "",
		phonenumber: "",
	});
	const resetData = () => {
		setDataError({
			firstName: "",
			secondName: "",
			email: "",
			phonenumber: "",
		});
	};

	useEffect(() => {
		setUserData({
			firstName: fetchedData?.data?.users?.name,
			secondName: fetchedData?.data?.users?.lastname,
			email: fetchedData?.data?.users?.email,
			phonenumber: fetchedData?.data?.users?.phonenumber?.startsWith("+966")
				? fetchedData?.data?.users?.phonenumber?.slice(4)
				: fetchedData?.data?.users?.phonenumber?.startsWith("00966")
				? fetchedData?.data?.users?.phonenumber.slice(5)
				: fetchedData?.data?.users?.phonenumber,
			image: null,
		});
		setPeviewImage(fetchedData?.data?.users?.image);
	}, [fetchedData?.data?.users]);

	const handleUpdateProfile = () => {
		resetData();
		setBtnLoading(true);
		let formData = new FormData();
		formData.append("name", userData?.firstName);
		formData.append("lastname", userData?.secondName);
		formData.append("email", userData?.email);
		formData.append(
			"phonenumber",
			userData?.phonenumber?.startsWith("+966") ||
				userData?.phonenumber?.startsWith("00966")
				? userData?.phonenumber
				: `+966${userData?.phonenumber}`
		);
		if (userData?.image) {
			formData.append("image", userData?.image);
		}
		axios
			.post("https://backend.atlbha.sa/api/profileCustomer", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
					store_domain: `${process.env.REACT_APP_STORE_DOMAIN}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					toast.success(res?.data?.message?.ar, { theme: "colored" });
					setBtnLoading(false);
					setReload(!reload);
					localStorage.setItem(
						"name",
						`${res?.data?.data?.users?.name} ${res?.data?.data?.users?.lastname}`
					);
					localStorage.setItem("email", res?.data?.data?.users?.email);
					localStorage.setItem("image", res?.data?.data?.users?.image);
				} else {
					setBtnLoading(false);
					setDataError({
						firstName: res?.data?.message?.en?.name?.[0],
						secondName: res?.data?.message?.en?.lastname?.[0],
						email: res?.data?.message?.en?.email?.[0],
						phonenumber: res?.data?.message?.en?.phonenumber?.[0],
					});
				}
			});
	};

	if (loading) {
		return <BlockLoader />;
	}

	return (
		<div className='card'>
			<Helmet>
				<title>{`تعديل الملف الشخصي — ${localStorage.getItem(
					"store-name"
				)}`}</title>
			</Helmet>

			<div className='card-header'>
				<h5>تعديل الملف الشخصي</h5>
			</div>
			<div className='card-divider' />
			<div className='card-body d-flex'>
				<div className='w-100 row'>
					<div className='col-md-6 col-12 row no-gutters flex-1 order-md-0 order-1'>
						<div className='col-12'>
							<div className='form-group'>
								<label htmlFor='profile-first-name'>الاسم الاول</label>
								<input
									id='profile-first-name'
									type='text'
									className='form-control'
									placeholder='الاسم الاول'
									value={userData?.firstName}
									onChange={(e) =>
										setUserData({ ...userData, firstName: e.target.value })
									}
								/>
								{DataError?.firstName && (
									<span style={{ color: "#ff3c3c", fontSize: "14px" }}>
										{DataError?.firstName}
									</span>
								)}
							</div>
							<div className='form-group'>
								<label htmlFor='profile-last-name'>الاسم الاخير</label>
								<input
									id='profile-last-name'
									type='text'
									className='form-control'
									placeholder='الاسم الاخير'
									value={userData?.secondName}
									onChange={(e) =>
										setUserData({ ...userData, secondName: e.target.value })
									}
								/>
								{DataError?.secondName && (
									<span style={{ color: "#ff3c3c", fontSize: "14px" }}>
										{DataError?.secondName}
									</span>
								)}
							</div>
							<div className='form-group'>
								<label htmlFor='profile-email'>البريد الالكتروني</label>
								<input
									id='profile-email'
									type='email'
									className='form-control'
									placeholder='البريد الالكتروني'
									value={userData?.email}
									onChange={(e) =>
										setUserData({ ...userData, email: e.target.value })
									}
								/>
								{DataError?.email && (
									<span style={{ color: "#ff3c3c", fontSize: "14px" }}>
										{DataError?.email}
									</span>
								)}
							</div>
							<div className='form-group'>
								<label htmlFor='profile-phone'>رقم الهاتف</label>
								<div
									className='d-flex align-items-center form-control'
									style={{ direction: "ltr" }}>
									<span>+966</span>
									<input
										style={{
											direction: "ltr",
											border: "none",
											outline: "none",
										}}
										id='profile-phone'
										type='tel'
										maxLength={9}
										className=''
										placeholder='رقم الهاتف'
										value={userData?.phonenumber}
										onChange={(e) =>
											setUserData({ ...userData, phonenumber: e.target.value })
										}
									/>
								</div>
								{DataError?.phonenumber && (
									<span style={{ color: "#ff3c3c", fontSize: "14px" }}>
										{DataError?.phonenumber}
									</span>
								)}
							</div>

							<div className='form-group mt-5 mb-0'>
								<button
									disabled={btnLoading}
									onClick={handleUpdateProfile}
									type='button'
									className='btn btn-primary'>
									حفظ
								</button>
							</div>
						</div>
					</div>
					<div className='col-md-6 col-12 card-body profile-card__body justify-content-start order-md-1 order-0'>
						<div className='profile-card__avatar'>
							<img
								src={
									previewImage ||
									fetchedData?.data?.users?.image ||
									"images/avatars/avatar-3.jpg"
								}
								alt={fetchedData?.data?.users?.name}
							/>
						</div>
						<div className='profile-card__edit'>
							<div className=''>
								<label htmlFor='photo' className='btn btn-secondary btn-sm'>
									رفع صورة شخصية
								</label>
								<input
									onChange={(e) => {
										setUserData({ ...userData, image: e.target.files?.[0] });
										setPeviewImage(URL.createObjectURL(e.target.files?.[0]));
									}}
									id='photo'
									type='file'
									hidden></input>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
