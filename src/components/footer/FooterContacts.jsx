// react
import React from "react";
export default function FooterContacts({ fetchedData }) {
	return (
		<div className='site-footer__widget footer-contacts'>
			<h5 className='footer-contacts__title'>تواصل معنا</h5>

			<div className='footer-contacts__logo'>
				<img
					src={fetchedData?.logo}
					alt={fetchedData?.storeName}
					loading='lazy'
				/>
			</div>
			<div className='footer-contacts__text'>{fetchedData?.storeName}</div>
			<p className='footer-contacts__text '>{fetchedData?.description}</p>
			<ul className='footer-contacts__contacts'>
				<li>
					<i className='footer-contacts__icon fas fa-globe-americas' />
					{fetchedData?.storeAddress}
				</li>
				<li>
					<i className='footer-contacts__icon far fa-envelope' />
					{fetchedData?.storeEmail}
				</li>
				<li>
					<i className='footer-contacts__icon fas fa-mobile-alt' />
					<span style={{ display: "inline-block", direction: "ltr" }}>
						{fetchedData?.phonenumber && <span>966</span>}
						{fetchedData?.phonenumber?.startsWith("+966")
							? fetchedData?.phonenumber?.slice(4)
							: fetchedData?.phonenumber?.startsWith("00966")
							? fetchedData?.phonenumber?.slice(5)
							: fetchedData?.phonenumber}
					</span>
				</li>
				{fetchedData?.verification_code && (
					<li>
						<span>
							{fetchedData?.verificayionMethod?.type === "commerce"
								? "رقم السجل : "
								: "رمز الوثيقة : "}
							{fetchedData?.verification_code}
						</span>
					</li>
				)}
			</ul>
		</div>
	);
}
