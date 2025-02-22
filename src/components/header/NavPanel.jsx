// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import CartIndicator from "./IndicatorCart";
import Departments from "./Departments";
import Indicator from "./Indicator";
import IndicatorAccount from "./IndicatorAccount";
import IndicatorSearch from "./IndicatorSearch";
import NavLinks from "./NavLinks";
import { Heart20Svg, LogoSmallSvg, Compare16Svg } from "../../svg";

function NavPanel(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const { layout, wishlist, fetchedData, servicesData, productsData } = props;
	let logo = null;
	let departments = null;
	let searchIndicator;

	if (layout === "compact") {
		logo = (
			<div className='nav-panel__logo'>
				<Link to='/'>
					<LogoSmallSvg />
				</Link>
			</div>
		);

		searchIndicator = <IndicatorSearch />;
	}

	if (layout === "default") {
		departments = (
			<div className='nav-panel__departments'>
				<Departments fetchedData={fetchedData} />
			</div>
		);
	}

	return (
		<nav className='nav-panel'>
			<div className='nav-panel__container container'>
				<div className='nav-panel__row'>
					{logo}
					{departments}

					<div className='nav-panel__nav-links nav-links'>
						<NavLinks
							fetchedData={fetchedData}
							servicesData={servicesData}
							productsData={productsData}
						/>
					</div>

					<div className='nav-panel__indicators'>
						<div className='indicator indicator--trigger--click'>
							<Link className='indicator__button' to={`compare`}>
								<span className='indicator__area'>
									<Compare16Svg />
								</span>
							</Link>
						</div>
						{searchIndicator}

						<Indicator
							url={`wishlist`}
							value={wishlist.filter((item) => item?.domain === domain).length}
							icon={<Heart20Svg />}
						/>

						<CartIndicator />

						<IndicatorAccount />
					</div>
				</div>
			</div>
		</nav>
	);
}

NavPanel.propTypes = {
	/** one of ['default', 'compact'] (default: 'default') */
	layout: PropTypes.oneOf(["default", "compact"]),
};

NavPanel.defaultProps = {
	layout: "default",
};

const mapStateToProps = (state) => ({
	wishlist: state.wishlist,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NavPanel);
