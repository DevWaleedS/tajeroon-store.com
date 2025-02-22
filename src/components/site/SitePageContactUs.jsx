// react
import React, { useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";

// application
import PageHeader from "../shared/PageHeader";
import BlockLoader from "../blocks/BlockLoader";
import { loginModalOpen } from "../../store/login-modal";

// data stubs

function SitePageContactUs(props) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [btnLoading, setBtnLoading] = useState(false);
	const { openLoginModal } = props;
	const [DataError, setDataError] = useState({
		subject: "",
		message: "",
	});
	const resetData = () => {
		setDataError({
			subject: "",
			message: "",
		});
	};

	const handleSend = () => {
		resetData();
		setBtnLoading(true);
		let formData = new FormData();
		formData.append("title", subject);
		formData.append("content", message);
		axios
			.post(
				`https://backend.atlbha.sa/api/addContact?domain=${store_domain}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					toast.success(res?.data?.message?.ar, { theme: "colored" });
					setSubject("");
					setMessage("");
					setBtnLoading(false);
				} else {
					setBtnLoading(false);
					setDataError({
						subject: res?.data?.message?.en?.title?.[0],
						message: res?.data?.message?.en?.content?.[0],
					});
				}
			});
	};

	const tConvert = (time) => {
		time = time
			.toString()
			.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
		if (time.length > 1) {
			time = time.slice(1);
			time[5] = +time[0] < 12 ? " صباحاً " : " مساءً ";
			time[0] = +time[0] % 12 || 12;
		}
		return time.join("");
	};

	const breadcrumb = [
		{ title: "الرئيسية", url: `/${store_domain}` },
		{ title: "تواصل معنا", url: "" },
	];

	if (props?.loading) {
		return <BlockLoader />;
	}

	if (!token) {
		openLoginModal();
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{`تواصل معنا — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>
			<PageHeader header='تواصل معنا' breadcrumb={breadcrumb} />
			<div className='block'>
				<div className='container'>
					{!token ? (
						<div className='col-12 mb-3'>
							<div className='d-flex alert alert-primary alert-lg'>
								عميل غير مسجل الدخول?
								<p onClick={openLoginModal}>اضغط هنا لتسجيل الدخول</p>
							</div>
						</div>
					) : (
						<div className='card mb-0'>
							<div className='card-body contact-us'>
								<div className='contact-us__container'>
									<div className='row'>
										<div className='col-12 col-lg-6 pb-4 pb-lg-0'>
											<h4 className='contact-us__header card-title'>عنواننا</h4>
											<div className='contact-us__address'>
												<p>
													{props?.fetchedData?.storeAddress}
													<br />
													البريد الالكتروني: {props?.fetchedData?.storeEmail}
													<br />
													رقم الهاتف:{" "}
													<span
														style={{
															direction: "ltr",
															display: "inline-block",
														}}>
														{props?.fetchedData?.phonenumber && (
															<span>966</span>
														)}
														{props?.fetchedData?.phonenumber?.startsWith("+966")
															? props?.fetchedData?.phonenumber?.slice(4)
															: props?.fetchedData?.phonenumber?.startsWith(
																	"00966"
															  )
															? props?.fetchedData?.phonenumber?.slice(5)
															: props?.fetchedData?.phonenumber}
													</span>
												</p>

												<p>
													<strong>اوقات الدوام</strong>
													<br />
													<ul className='works-day'>
														{props?.fetchedData?.workDays?.map(
															(item, index) => (
																<li key={index}>
																	<span>{item?.day?.name}</span>
																	{item?.status === "active"
																		? `${tConvert(
																				item?.from?.slice(0, 5) || ""
																		  )} - ${tConvert(
																				item?.to?.slice(0, 5) || ""
																		  )}`
																		: "مغلق"}
																</li>
															)
														)}
													</ul>
												</p>

												<p>
													<strong>وصف المتجر</strong>
													<br />
													{props?.fetchedData?.description}
												</p>
											</div>
										</div>
										<div className='col-12 col-lg-6'>
											<h4 className='contact-us__header card-title'>
												اترك لنا رسالة
											</h4>
											<form>
												<div className='form-group'>
													<label htmlFor='form-subject'>موضوع الرسالة</label>
													<input
														value={subject}
														onChange={(e) => setSubject(e.target.value)}
														type='text'
														id='form-subject'
														className='form-control'
														placeholder='موضوع الرسالة'
													/>
													{DataError?.subject && (
														<span
															style={{ color: "#ff3c3c", fontSize: "14px" }}>
															{DataError?.subject}
														</span>
													)}
												</div>
												<div className='form-group'>
													<label htmlFor='form-message'>الرسالة</label>
													<textarea
														value={message}
														onChange={(e) => setMessage(e.target.value)}
														id='form-message'
														className='form-control'
														rows='4'
													/>
													{DataError?.message && (
														<span
															style={{ color: "#ff3c3c", fontSize: "14px" }}>
															{DataError?.message}
														</span>
													)}
												</div>
												<button
													onClick={handleSend}
													disabled={(!message || !subject) && !btnLoading}
													type='button'
													className='btn btn-primary'>
													ارسال
												</button>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
	openLoginModal: loginModalOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(SitePageContactUs);
