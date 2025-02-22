// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import AppLink from "../shared/AppLink";
import languages from "../../i18n";
import Megamenu from "./Megamenu";
import Menu from "./Menu";
import { ArrowRoundedDown9x6Svg } from "../../svg";

// data stubs
import navLinks from "../../data/headerNavigation";

function NavLinks(props) {
	const { fetchedData, productsData, servicesData } = props;

	const handleMouseEnter = (event) => {
		const { locale } = props;
		const { direction } = languages[locale];

		const item = event.currentTarget;
		const megamenu = item.querySelector(".nav-links__megamenu");

		if (megamenu) {
			const container = megamenu.offsetParent;
			const containerWidth = container.getBoundingClientRect().width;
			const megamenuWidth = megamenu.getBoundingClientRect().width;
			const itemOffsetLeft = item.offsetLeft;

			if (direction === "rtl") {
				const itemPosition =
					containerWidth -
					(itemOffsetLeft + item.getBoundingClientRect().width);

				const megamenuPosition = Math.round(
					Math.min(itemPosition, containerWidth - megamenuWidth)
				);

				megamenu.style.left = "";
				megamenu.style.right = `${megamenuPosition}px`;
			} else {
				const megamenuPosition = Math.round(
					Math.min(itemOffsetLeft, containerWidth - megamenuWidth)
				);

				megamenu.style.right = "";
				megamenu.style.left = `${megamenuPosition}px`;
			}
		}
	};

	const linksList = navLinks.map((item, index) => {
		// to hide or show the services link
		if (item.title === "الخدمات" && !servicesData?.length) {
			return null;
		}

		// to hide or show the products link
		if (item.title === "المنتجات" && !productsData?.length) {
			return null;
		}

		const morePages = fetchedData?.pages?.filter((page) =>
			page?.pageCategory?.some((category) => category?.name === "المزيد")
		);
		let arrow;
		let submenu;

		if (item.submenu) {
			arrow = <ArrowRoundedDown9x6Svg className='nav-links__arrow' />;
		}

		if (item.submenu && item.submenu.type === "menu") {
			submenu = (
				<div className='nav-links__menu'>
					<Menu
						items={{
							id: 0,
							name: "المزيد",
							subcategory: morePages?.map((item) => ({
								id: item?.id,
								name: item?.title,
								type: "links",
							})),
						}}
					/>
				</div>
			);
		}

		if (item.submenu && item.submenu.type === "megamenu") {
			submenu = (
				<div
					className={`nav-links__megamenu nav-links__megamenu--size--${item.submenu.menu.size}`}>
					<Megamenu menu={item.submenu.menu} />
				</div>
			);
		}

		const classes = classNames("nav-links__item", {
			"nav-links__item--with-submenu": item.submenu,
		});

		return (
			<li key={index} className={classes} onMouseEnter={handleMouseEnter}>
				<AppLink to={item.url} {...item.props}>
					{morePages?.length === 0 ? (
						item.title !== "المزيد" && <span>{item.title}</span>
					) : (
						<span>
							{item.title}
							{arrow}
						</span>
					)}
				</AppLink>
				{submenu}
			</li>
		);
	});

	return <ul className='nav-links__list'>{linksList}</ul>;
}

NavLinks.propTypes = {
	/** current locale */
	locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
	locale: state.locale,
});

export default connect(mapStateToProps)(NavLinks);
