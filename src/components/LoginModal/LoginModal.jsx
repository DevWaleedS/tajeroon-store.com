import React, { useState, useEffect } from "react";
import { CloseIcon } from "../../svg";
import { UserProfile } from "../../svg";
import { SmartPhone } from "../../svg";
import { Email } from "../../svg";
import { True } from "../../svg";
import { Envelope } from "../../svg";
import { DisabledEmail } from "../../svg";
import { DisabledSmartPhone } from "../../svg";
import { UserIcon } from "../../svg";
import { Saudi } from "../../svg";
import { Arrow } from "../../svg";
import axios from "axios";
import { useHistory } from "react-router";

//Mui//
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// third-party
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import { toast } from "react-toastify";
import { loginModalClose } from "../../store/login-modal";
import { addLocalCartToDB, fetchCartData } from "../../store/cart";

const FIRSTNAME_REGEX = /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/;
const SECONDNAME_REGEX = /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/;
const PHONE_REGEX = /^(5\d{8})$/;
const CODE_REGEX = /^(\d{6})$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function LoginModal(props) {
	let history = useHistory();
	const { open, closeLoginModal, addLocalCartToDB, fetchCartData, cart } =
		props;
	const [btnLoading, setBtnLoading] = useState(false);
	const [option, setOption] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [secondName, setSecondName] = useState("");
	const [phoneCode, setPhoneCode] = useState(+966);
	const [userId, setUserId] = useState("");
	const [code, setCode] = useState("");
	const [send, setSend] = useState(false);
	const [newUser, setNewUser] = useState(false);
	const [sendEmail, setSendEmail] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [counter, setCounter] = useState(60);
	const [timerId, setTimerId] = useState(null);
	const [verificationMobileError, setVerificationMobileError] = useState("");
	const [verificationEmailError, setVerificationEmailError] = useState("");
	const [verificationError, setVerificationError] = useState("");
	const [firstNameError, setFirstNameError] = useState("");
	const [secondNameError, setSecondNameError] = useState("");
	const [codeError, setCodeError] = useState("");

	const [validFirstName, setValidFirstName] = useState(false);
	const [firstNameFocus, setFirstNameFocus] = useState(false);

	const [validSecondName, setValidSecondName] = useState(false);
	const [secondNameFocus, setSecondNameFocus] = useState(false);

	const [validPhone, setValidPhone] = useState(false);
	const [phoneFocus, setPhoneFocus] = useState(false);

	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [validCode, setValidCode] = useState(false);
	const [codeFocus, setCodeFocus] = useState(false);

	// TO HANDLE VALIDATION FOR FIRST NAME
	useEffect(() => {
		const firstNameValidation = FIRSTNAME_REGEX.test(firstName);
		setValidFirstName(firstNameValidation);
	}, [firstName]);

	// TO HANDLE VALIDATION FOR SECOND NAME
	useEffect(() => {
		const secondNameValidation = SECONDNAME_REGEX.test(secondName);
		setValidSecondName(secondNameValidation);
	}, [secondName]);

	// TO HANDLE VALIDATION FOR PHONE
	useEffect(() => {
		const phoneValidation = PHONE_REGEX.test(phone);
		setValidPhone(phoneValidation);
	}, [phone]);

	// TO HANDLE VALIDATION FOR EMAIL
	useEffect(() => {
		const emailValidation = EMAIL_REGEX.test(email);
		setValidEmail(emailValidation);
	}, [email]);

	// TO HANDLE VALIDATION FOR CODE
	useEffect(() => {
		const codeValidation = CODE_REGEX.test(code);
		setValidCode(codeValidation);
	}, [code]);

	const verificationMobile = () => {
		setVerificationError("");
		setCodeError("");
		setVerificationMobileError("");
		setVerificationEmailError("");
		const data = {
			phonenumber: phone && "+966" + phone,
		};
		setBtnLoading(true);
		setBtnDisabled(true);
		axios
			.post("https://backend.atlbha.sa/api/logincustomerphoneapi", data)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					if (res?.data?.message?.en === "account is not active") {
						activeAccount(res?.data?.data?.user?.id);
					} else {
						setBtnLoading(false);
						setBtnDisabled(false);
						setSend(true);
						startCountdown();
						toast.success("تم إرسال كود التحقق بنجاح", { theme: "colored" });
					}
				} else {
					setBtnLoading(false);
					setBtnDisabled(false);
					setVerificationMobileError(res?.data?.message?.en?.phonenumber?.[0]);
				}
			})
			.catch((e) => {
				setBtnLoading(false);
				setBtnDisabled(false);
				console.log(e);
			});
	};

	const verificationEmail = () => {
		setVerificationError("");
		setCodeError("");
		setVerificationMobileError("");
		setVerificationEmailError("");
		const data = {
			email: email,
		};
		setBtnLoading(true);
		setBtnDisabled(true);
		axios
			.post("https://backend.atlbha.sa/api/logincustomeremailapi", data)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					if (res?.data?.message?.en === "account is not active") {
						activeAccount(res?.data?.data?.user?.id);
					} else {
						setSendEmail(true);
						startCountdown();
						setBtnLoading(false);
						setBtnDisabled(false);
						toast.success("تم إرسال كود التحقق بنجاح", { theme: "colored" });
					}
				} else {
					setVerificationEmailError(res?.data?.message?.en?.email?.[0]);
					setBtnLoading(false);
					setBtnDisabled(false);
				}
			})
			.catch((e) => {
				setBtnLoading(false);
				setBtnDisabled(false);
				console.log(e);
			});
	};

	const activeAccount = (id) => {
		setBtnLoading(true);
		setBtnDisabled(true);
		axios
			.get(`https://backend.atlbha.sa/api/selector/activateAccount/${id}`, {})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					toast.success(res?.data?.message?.ar, { theme: "colored" });
					setBtnLoading(false);
					setBtnDisabled(false);
				} else {
					setBtnLoading(false);
					setBtnDisabled(false);
					toast.error(res?.data?.message?.ar, { theme: "colored" });
				}
			});
	};

	const verifyUser = () => {
		setBtnLoading(true);
		setBtnDisabled(true);
		setVerificationError("");
		setCodeError("");
		setVerificationMobileError("");
		setVerificationEmailError("");

		const data = {
			phonenumber: option === "phonenumber" ? phone && "+966" + phone : email,
			code: code,
		};
		axios
			.post("https://backend.atlbha.sa/api/verifyUser", data)
			.then((res) => {
				if (
					res?.data?.success === true &&
					res?.data?.data?.status === 200 &&
					res?.data?.message?.en === "verified"
				) {
					setUserId(res?.data?.data?.user?.id);
					if (res?.data?.data?.token === null) {
						setNewUser(true);
					} else {
						toast.success("تم تسجيل الدخول بنجاح", { theme: "colored" });
						setNewUser(false);
						localStorage.setItem("token", res?.data?.data?.token);
						localStorage.setItem(
							"name",
							`${res?.data?.data?.user?.name} ${res?.data?.data?.user?.lastname}`
						);
						localStorage.setItem("email", res?.data?.data?.user?.email);
						localStorage.setItem("image", res?.data?.data?.user?.image);
						closeModal();
						history.push(`/`);
						if (cart?.items?.length !== 0) {
							addLocalCartToDB(cart);
						} else {
							fetchCartData();
						}
					}
					setBtnLoading(false);
					setBtnDisabled(false);
				} else {
					setBtnLoading(false);
					setBtnDisabled(false);
					setVerificationError(res?.data?.message?.ar);
					setCodeError(res?.data?.message?.en?.code?.[0]);
					setVerificationMobileError(res?.data?.message?.en?.phonenumber?.[0]);
					setVerificationEmailError(res?.data?.message?.en?.phonenumber?.[0]);
				}
			})
			.catch((e) => {
				setBtnLoading(false);
				setBtnDisabled(false);
				console.log(e);
			});
	};

	const registerUser = () => {
		setVerificationError("");
		setFirstNameError("");
		setSecondNameError("");
		setVerificationEmailError("");
		setVerificationMobileError("");
		let formData = new FormData();
		formData.append("name", firstName);
		formData.append("lastname", secondName);
		formData.append(
			option === "email" ? "phonenumber" : "email",
			option === "email" ? phone && "+966" + phone : email
		);

		axios
			.post(`https://backend.atlbha.sa/api/registerUser/${userId}`, formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					toast.success("تم تسجيل الدخول بنجاح", { theme: "colored" });
					localStorage.setItem("token", res?.data?.data?.token);
					localStorage.setItem("name", res?.data?.data?.user?.name);
					localStorage.setItem("email", res?.data?.data?.user?.email);
					localStorage.setItem("image", res?.data?.data?.user?.image);
					closeModal();
					setBtnDisabled(false);
					history.push(`/`);
					if (cart?.items?.length !== 0) {
						addLocalCartToDB(cart);
					} else {
						fetchCartData();
					}
				} else {
					setBtnDisabled(false);
					setFirstNameError(res?.data?.message?.en?.name?.[0]);
					setSecondNameError(res?.data?.message?.en?.lastname?.[0]);
					setVerificationEmailError(res?.data?.message?.en?.email?.[0]);
					setVerificationMobileError(res?.data?.message?.en?.phonenumber?.[0]);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	function startCountdown() {
		setTimerId(
			setInterval(() => {
				setCounter((prevCountdown) => prevCountdown - 1);
			}, 1000)
		);
	}

	React.useEffect(() => {
		if (counter === 0) {
			clearInterval(timerId);
			setTimerId(null);
		}
	}, [counter, timerId]);

	const sendAgainPhone = () => {
		setPhone("");
		setEmail("");
		setCode("");
		setOption("phonenumber");
		setSend(false);
		setCodeError("");
		setVerificationMobileError("");
		setCounter(60);
		clearInterval(timerId);
		setTimerId(null);
	};

	const sendAgainEmail = () => {
		setPhone("");
		setEmail("");
		setCode("");
		setOption("email");
		setSendEmail(false);
		setCodeError("");
		setVerificationEmailError("");
		setCounter(60);
		clearInterval(timerId);
		setTimerId(null);
	};

	const closeModal = () => {
		setPhone("");
		setEmail("");
		setCode("");
		setOption("");
		setSend(false);
		setCodeError("");
		setVerificationMobileError("");
		setFirstName("");
		setSecondName("");
		setUserId("");
		setNewUser(false);
		setSendEmail(false);
		setBtnDisabled(false);
		setCounter(60);
		clearInterval(timerId);
		setTimerId(null);
		setVerificationMobileError("");
		setVerificationEmailError("");
		setVerificationError("");
		setFirstNameError("");
		setSecondNameError("");
		closeLoginModal();
	};

	return (
		<Modal isOpen={open}>
			<div className='login_modal'>
				<div className='close_btn'>
					<CloseIcon onClick={closeModal} />
				</div>
				<div className='profile_icon'>
					<UserProfile />
				</div>
				{!newUser ? (
					<div className='modal_body'>
						<p className='title'>تسجيل الدخول</p>
						{option === "phonenumber" ? (
							<div className='phone_content'>
								<div className='phone_input'>
									<label>
										رقم الجوال{" "}
										<span
											style={{ fontSize: "1.2rem", fontWeight: "500" }}
											className='text-danger'>
											*
										</span>
									</label>
									<div className='input_content'>
										<input
											placeholder='51 234 5678'
											value={phone}
											onChange={(e) => setPhone(e.target.value.slice(0, 9))}
											type='number'
											onFocus={() => setPhoneFocus(true)}
											onBlur={() => setPhoneFocus(true)}
										/>
										<FormControl
											className='phone_code'
											variant=''
											sx={{ m: 1, minWidth: 120 }}>
											<Select
												value={phoneCode}
												onChange={(e) => setPhoneCode(e.target.value)}
												label='phoneCode'
												IconComponent={(props) => <Arrow {...props} />}>
												<MenuItem value={+966}>
													<Saudi />
													<p>+966</p>
												</MenuItem>
											</Select>
										</FormControl>
									</div>
									<span
										className={
											phoneFocus && phone && !validPhone
												? " d-block error"
												: "d-none"
										}>
										تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
									</span>
									{verificationMobileError && (
										<span className='error'>{verificationMobileError}</span>
									)}
								</div>
								{send && (
									<>
										<div className='confirm_input'>
											<label>
												رمز التحقق{" "}
												<span
													style={{ fontSize: "1.2rem", fontWeight: "500" }}
													className='text-danger'>
													*
												</span>
											</label>

											<input
												placeholder='أدخل رمز التحقق'
												value={code}
												onChange={(e) => setCode(e.target.value.slice(0, 6))}
												type='number'
												onFocus={() => setCodeFocus(true)}
												onBlur={() => setCodeFocus(true)}
											/>
										</div>
										<span
											className={
												codeFocus && code && !validCode
													? " d-block error"
													: "d-none"
											}>
											تأكد ان الكود عبارة عن أرقام لايزيد عن ستة
										</span>
										{codeError && <span className='error'>{codeError}</span>}
										{verificationError && (
											<span className='error'>{verificationError}</span>
										)}

										<button
											disabled={btnDisabled || code?.length < 6}
											className={`confirm ${
												code?.length === 6 ? "active" : null
											} ${btnLoading ? "btn-loading" : ""}`}
											onClick={() => verifyUser()}>
											{btnLoading ? (
												""
											) : (
												<div className='d-flex flex-row justify-content-center align-items-center'>
													<span>التحقق</span> <True />
												</div>
											)}
										</button>

										<button
											disabled={counter > 0 || btnDisabled}
											className={`retry_send`}
											onClick={() => {
												verificationMobile();
												setCounter(60);
											}}>
											إعادة إرسال بعد <span>{counter}</span>
										</button>

										<div className='options'>
											<button
												disabled={btnDisabled}
												className={`${btnDisabled && "disabled"}`}
												onClick={() => {
													sendAgainPhone();
												}}>
												{btnDisabled ? <DisabledSmartPhone /> : <SmartPhone />}
												<p className={`${btnDisabled && "disabled"}`}>
													رسالة نصية
												</p>
											</button>
											<button
												disabled={btnDisabled}
												className={`${btnDisabled && "disabled"}`}
												onClick={() => {
													sendAgainEmail();
												}}>
												{btnDisabled ? <DisabledEmail /> : <Email />}
												<p className={`${btnDisabled && "disabled"}`}>
													البريد الإلكتروني
												</p>
											</button>
										</div>
									</>
								)}
								{!send && (
									<button
										disabled={btnDisabled}
										onClick={() => verificationMobile()}
										className={`send ${btnLoading ? "btn-loading" : ""}`}>
										{btnLoading ? "" : "ارسال رمز التحقق"}
									</button>
								)}
							</div>
						) : option === "email" ? (
							<div className='email_content'>
								<div className='email_input'>
									<label>
										البريد الإلكتروني{" "}
										<span
											style={{ fontSize: "1.2rem", fontWeight: "500" }}
											className='text-danger'>
											*
										</span>
									</label>
									<div className='input_content'>
										<input
											placeholder='sample@gmail.com'
											value={email}
											onChange={(e) =>
												setEmail(
													e.target.value.replace(
														/[^a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]/g,
														""
													)
												)
											}
											type='email'
											onFocus={() => setEmailFocus(true)}
											onBlur={() => setEmailFocus(true)}
										/>
										<Envelope />
									</div>
									<span
										className={
											emailFocus && email && !validEmail
												? " d-block error"
												: "d-none"
										}>
										تأكد من ادخال البريد الالكتروني
									</span>
									{verificationEmailError && (
										<span className='error'>{verificationEmailError}</span>
									)}
								</div>
								{sendEmail && (
									<>
										<div className='confirm_input'>
											<label>
												رمز التحقق{" "}
												<span
													style={{ fontSize: "1.2rem", fontWeight: "500" }}
													className='text-danger'>
													*
												</span>
											</label>
											<input
												placeholder='أدخل رمز التحقق'
												value={code}
												onChange={(e) => setCode(e.target.value.slice(0, 6))}
												type='number'
												onFocus={() => setCodeFocus(true)}
												onBlur={() => setCodeFocus(true)}
											/>
										</div>
										<span
											className={
												codeFocus && code && !validCode
													? " d-block error"
													: "d-none"
											}>
											تأكد ان الكود عبارة عن أرقام لايزيد عن ستة
										</span>
										{codeError && <span className='error'>{codeError}</span>}
										{verificationError && (
											<span className='error'>{verificationError}</span>
										)}

										<button
											disabled={btnDisabled || code?.length < 6}
											className={`confirm ${
												code?.length === 6 ? "active" : null
											} ${btnLoading ? "btn-loading" : ""}`}
											onClick={() => verifyUser()}>
											{btnLoading ? (
												""
											) : (
												<div className='d-flex flex-row justify-content-center align-items-center'>
													<span>التحقق</span> <True />
												</div>
											)}
										</button>

										<button
											disabled={counter > 0 || btnDisabled}
											className={`retry_send`}
											onClick={() => {
												verificationEmail();
												setCounter(60);
											}}>
											إعادة إرسال بعد <span>{counter}</span>
										</button>

										<div className='options'>
											<button
												disabled={btnDisabled}
												className={`${btnDisabled && "disabled"}`}
												onClick={() => {
													sendAgainPhone();
												}}>
												{btnDisabled ? <DisabledSmartPhone /> : <SmartPhone />}
												<p className={`${btnDisabled && "disabled"}`}>
													رسالة نصية
												</p>
											</button>
											<button
												disabled={btnDisabled}
												className={`${btnDisabled && "disabled"}`}
												onClick={() => {
													sendAgainEmail();
												}}>
												{btnDisabled ? <DisabledEmail /> : <Email />}
												<p className={`${btnDisabled && "disabled"}`}>
													البريد الإلكتروني
												</p>
											</button>
										</div>
									</>
								)}
								{!sendEmail && (
									<button
										disabled={btnDisabled}
										onClick={() => verificationEmail()}
										className={`send ${btnLoading ? "btn-loading" : ""}`}>
										{btnLoading ? "" : "ارسال رمز التحقق"}
									</button>
								)}
							</div>
						) : (
							<div className='content'>
								<p className='title'>اختر الطريقة المناسبة لك</p>
								<div className='options'>
									<button onClick={() => setOption("phonenumber")}>
										<SmartPhone />
										<p>رسالة نصية</p>
									</button>
									<button onClick={() => setOption("email")}>
										<Email />
										<p>البريد الإلكتروني</p>
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className='register_body'>
						<p className='title'>إنشاء عضوية للمرة الأول</p>
						<div className='name_inputs'>
							<div className='name_input'>
								<label>
									الإسم الأول{" "}
									<span
										style={{ fontSize: "1.2rem", fontWeight: "500" }}
										className='text-danger'>
										*
									</span>
								</label>
								<div className='input_content'>
									<UserIcon />
									<input
										placeholder='ادخل اسمك'
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										type='text'
										onFocus={() => setFirstNameFocus(true)}
										onBlur={() => setFirstNameFocus(true)}
									/>
								</div>
								<span
									className={
										firstNameFocus && firstName && !validFirstName
											? " d-block error"
											: "d-none"
									}>
									يجب ان يكون اسمك صحيح وحقيقي
								</span>
								{firstNameError && (
									<span className='error'>{firstNameError}</span>
								)}
							</div>
							<div className='name_input'>
								<label>
									الإسم الثاني{" "}
									<span
										style={{ fontSize: "1.2rem", fontWeight: "500" }}
										className='text-danger'>
										*
									</span>
								</label>
								<div className='input_content'>
									<UserIcon />
									<input
										placeholder='ادخل اسم العائلة'
										value={secondName}
										onChange={(e) => setSecondName(e.target.value)}
										type='text'
										onFocus={() => setSecondNameFocus(true)}
										onBlur={() => setSecondNameFocus(true)}
									/>
								</div>
								<span
									className={
										secondNameFocus && secondName && !validSecondName
											? " d-block error"
											: "d-none"
									}>
									يجب ان يكون اسم العائلة صحيح وحقيقي
								</span>
								{secondNameError && (
									<span className='error'>{secondNameError}</span>
								)}
							</div>
						</div>
						{option === "phonenumber" ? (
							<div className='email_content'>
								<div className='email_input'>
									<label>
										البريد الإلكتروني{" "}
										<span
											style={{ fontSize: "1.2rem", fontWeight: "500" }}
											className='text-danger'>
											*
										</span>
									</label>
									<div className='input_content'>
										<input
											placeholder='sample@gmail.com'
											value={email}
											onChange={(e) =>
												setEmail(
													e.target.value.replace(
														/[^a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]/g,
														""
													)
												)
											}
											type='email'
											onFocus={() => setEmailFocus(true)}
											onBlur={() => setEmailFocus(true)}
										/>
										<Envelope />
									</div>
									<span
										className={
											emailFocus && email && !validEmail
												? " d-block error"
												: "d-none"
										}>
										تأكد من ادخال البريد الالكتروني
									</span>
									{verificationEmailError && (
										<span className='error'>{verificationEmailError}</span>
									)}
								</div>
							</div>
						) : (
							<div className='phone_content'>
								<div className='phone_input'>
									<label>
										رقم الجوال{" "}
										<span
											style={{ fontSize: "1.2rem", fontWeight: "500" }}
											className='text-danger'>
											*
										</span>
									</label>
									<div className='input_content'>
										<input
											placeholder='51 234 5678'
											value={phone}
											onChange={(e) => setPhone(e.target.value.slice(0, 9))}
											type='number'
											onFocus={() => setPhoneFocus(true)}
											onBlur={() => setPhoneFocus(true)}
										/>
										<FormControl
											className='phone_code'
											variant=''
											sx={{ m: 1, minWidth: 120 }}>
											<Select
												value={phoneCode}
												onChange={(e) => setPhoneCode(e.target.value)}
												label='phoneCode'
												IconComponent={(props) => <Arrow {...props} />}>
												<MenuItem value={+966}>
													<Saudi />
													<p>+966</p>
												</MenuItem>
											</Select>
										</FormControl>
									</div>
									<span
										className={
											phoneFocus && phone && !validPhone
												? " d-block error"
												: "d-none"
										}>
										تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
									</span>
									{verificationMobileError && (
										<span className='error'>{verificationMobileError}</span>
									)}
								</div>
							</div>
						)}
						<button className='register' onClick={() => registerUser()}>
							تسجيل
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
}

const mapStateToProps = (state) => ({
	open: state.loginModal.open,
	cart: state.cart,
});

const mapDispatchToProps = {
	closeLoginModal: loginModalClose,
	addLocalCartToDB,
	fetchCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
