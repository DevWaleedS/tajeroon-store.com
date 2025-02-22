// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function FooterLinks(props) {
	const { title, items } = props;
	const linksList = items?.map((item, index) => (
		<li key={index} className='footer-links__item'>
			<Link
				to={{
					pathname: `/terms/${encodeURIComponent(
						item?.title
							.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
							.toLowerCase()
					)}/${item?.id}`,
				}}
				className='footer-links__link'>
				{item?.title}
			</Link>
		</li>
	));

	return (
		<div className='site-footer__widget footer-links'>
			<h5 className='footer-links__title'>{title}</h5>
			<ul className='footer-links__list'>{linksList}</ul>
		</div>
	);
}

FooterLinks.propTypes = {
	/** widget title */
	title: PropTypes.node.isRequired,
	/** array of links */
	items: PropTypes.array,
};

FooterLinks.defaultProps = {
	items: [],
};
