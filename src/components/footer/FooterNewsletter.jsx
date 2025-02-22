// react
import React, { useEffect, useState } from "react";

// application
import SocialLinks from "../shared/SocialLinks";
import axios from "axios";
import { toast } from "react-toastify";

export default function FooterNewsletter({ fetchedData }) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const token = localStorage.getItem("token");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");

	// EMAIL VALIDATION
	const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	// TO HANDLE VALIDATION FOR EMAIL
	useEffect(() => {
		const emailValidation = EMAIL_REGEX.test(email);
		setValidEmail(emailValidation);
	}, [email]);

	// Create add subscription function to send email to database.
	const addSubscription = (e) => {
		e.preventDefault();

		let formData = new FormData();
		formData.append("email", email);

		axios
			.post(
				`https://backend.atlbha.sa/api/addSubsicription/${store_domain}`,
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
				} else {
					setEmailError(res?.data?.message?.email[0]);
				}
			});
	};
	return (
		<div className='site-footer__widget footer-newsletter'>
			<h5 className='footer-newsletter__title'>اخر الاخبار</h5>
			<div className='footer-newsletter__text'>
				ادخل بريدك الالكتروني و كن أول من يصله كل جديد
			</div>

			<form action='' className='footer-newsletter__form'>
				<label className='sr-only' htmlFor='footer-newsletter-address'>
					البريد الالكتروني
				</label>
				<input
					type='text'
					value={email}
					onChange={(e) =>
						setEmail(
							e.target.value.replace(/[^a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]/g, "")
						)
					}
					className='footer-newsletter__form-input form-control'
					id='footer-newsletter-address'
					placeholder='البريد الالكتروني...'
					aria-invalid={validEmail ? "false" : "true"}
					aria-describedby='email'
					onFocus={() => setEmailFocus(true)}
					onBlur={() => setEmailFocus(true)}
				/>

				<button
					disabled={
						emailFocus && email && !validEmail
							? true
							: false || email === ""
							? true
							: false
					}
					onClick={addSubscription}
					type='submit'
					className='footer-newsletter__form-button btn btn-primary'>
					الاشتراك
				</button>
			</form>

			<div>
				<p
					id='email'
					className={
						emailFocus && email && !validEmail
							? " d-block wrong-text "
							: "d-none"
					}
					style={{
						color: "#ff3c3c",
						fontSize: "14px",
					}}>
					تأكد من كتابة البريد الالكتروني بشكل صحيح
				</p>
				{emailError && (
					<span style={{ color: "#ff3c3c", fontSize: "14px" }}>
						{emailError}
					</span>
				)}
			</div>

			{(fetchedData?.facebook ||
				fetchedData?.twiter ||
				fetchedData?.youtube ||
				fetchedData?.instegram ||
				fetchedData?.snapchat ||
				fetchedData?.tiktok ||
				fetchedData?.jaco) && (
				<div className='footer-newsletter__text footer-newsletter__text--social'>
					تابعونا على شبكات التواصل الاجتماعي
				</div>
			)}

			<SocialLinks
				fetchedData={fetchedData}
				className='footer-newsletter__social-links'
				shape='circle'
			/>
		</div>
	);
}
