// react
import React, { useEffect } from "react";

// application
import FooterContacts from "./FooterContacts";
import FooterLinks from "./FooterLinks";
import FooterNewsletter from "./FooterNewsletter";
import ToTop from "./ToTop";
import Whatsapp from "./Whatsapp";

// import

export default function Footer({ fetchedData }) {
	const informationPages = fetchedData?.pages?.filter((page) =>
		page?.pageCategory?.some((category) => category?.name === "معلومات")
	);

	useEffect(() => {
		document.getElementById("year").innerHTML = new Date().getFullYear();
	}, []);

	return (
		<div className='site-footer'>
			<div className='container'>
				<div className='site-footer__widgets'>
					<div className='row'>
						<div className='col-12 col-md-6 col-lg-4'>
							<FooterContacts fetchedData={fetchedData} />
						</div>
						<div className='col-12 col-md-6 col-lg-4'>
							<FooterLinks
								title='معلومات'
								data={fetchedData}
								items={informationPages}
							/>
						</div>
						<div className='col-12 col-md-12 col-lg-4'>
							<FooterNewsletter fetchedData={fetchedData} />
						</div>
					</div>
				</div>

				<div className='site-footer__bottom'>
					<div className='site-footer__copyright'>
						جميع الحقوق محفوظة لـ
						<span className='name'>{fetchedData?.storeName}</span>
						&copy; <span id='year'></span>
					</div>
					<div className='site-footer__payments'>
						<>
							{
								<a
									href={fetchedData?.verificayionMethod?.link}
									target='_blank'
									rel='noreferrer'
									style={{ cursor: "pointer" }}>
									<img
										className='img-fluid'
										src={fetchedData?.verificayionMethod?.image}
										alt={fetchedData?.verificayionMethod?.image}
										width='40'
									/>
								</a>
							}
							{fetchedData?.paymentMethod?.map((payment) => (
								<div key={payment?.id}>
									<img
										className={`img-fluid ${
											payment?.name === "الدفع عند الاستلام" ? "COD_img" : ""
										}`}
										src={payment?.image}
										alt={payment?.name}
										width={`${
											payment?.name === "الدفع عند الاستلام" ? "25" : "40"
										}`}
									/>
								</div>
							))}
						</>
					</div>
				</div>
			</div>
			<ToTop />
			<Whatsapp
				WhatsappNumber={fetchedData?.phonenumber}
				storeName={fetchedData?.storeName}
				logo={fetchedData?.logo}
			/>
		</div>
	);
}
