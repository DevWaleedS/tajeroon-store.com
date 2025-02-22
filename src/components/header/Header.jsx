// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

// application
import NavPanel from "./NavPanel";
import Search from "./Search";

function Header(props) {
	const { layout, fetchedData, servicesData, productsData } = props;
	let bannerSection;

	if (layout === "default") {
		bannerSection = (
			<div className='site-header__middle container'>
				<div className='site-header__logo'>
					<Link to={`/`}>
						<img
							src={fetchedData?.logo || "https://placehold.co/80x80?text=Logo"}
							alt={`${localStorage.getItem("store-name")}`}
							width='100%'
							height='100%'
						/>
					</Link>
				</div>
				<div className='site-header__search'>
					<Search fetchedData={fetchedData} context='header' />
				</div>
				<div className='site-header__phone'>
					<div className='site-header__phone-title'>
						<FormattedMessage
							id='header.phoneLabel'
							defaultMessage='خدمة العملاء'
						/>
					</div>
					<div className='site-header__phone-number'>
						{fetchedData?.phonenumber && <span>966</span>}
						{fetchedData?.phonenumber?.startsWith("+966")
							? fetchedData?.phonenumber?.slice(4)
							: fetchedData?.phonenumber?.startsWith("00966")
							? fetchedData?.phonenumber?.slice(5)
							: fetchedData?.phonenumber}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='site-header'>
			{bannerSection}
			<div className='site-header__nav-panel'>
				<NavPanel
					fetchedData={fetchedData}
					layout={layout}
					servicesData={servicesData}
					productsData={productsData}
				/>
			</div>
		</div>
	);
}

Header.propTypes = {
	/** one of ['default', 'compact'] (default: 'default') */
	layout: PropTypes.oneOf(["default", "compact"]),
};

Header.defaultProps = {
	layout: "default",
};

export default Header;
