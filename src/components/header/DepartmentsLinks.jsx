// react
import React from "react";

// third-party
import { Link } from "react-router-dom";

// application
import Menu from "./Menu";
import { ArrowRoundedRight6x9Svg } from "../../svg";

function DepartmentsLinks({ fetchedData }) {
	const linksList = fetchedData?.categories?.map((department, index) => {
		let arrow = null;
		let submenu = null;
		let itemClass = "";
		const type = "menu";

		if (department?.subcategory && department?.subcategory?.length !== 0) {
			arrow = <ArrowRoundedRight6x9Svg className='departments__link-arrow' />;
		}

		if (
			department?.subcategory &&
			department?.subcategory?.length !== 0 &&
			type === "menu"
		) {
			itemClass = "departments__item--menu";
			submenu = (
				<div className='departments__menu'>
					<Menu items={department} layout='classic' />
				</div>
			);
		}

		return (
			<li key={index} className={`departments__item ${itemClass}`}>
				<Link
					to={{
						pathname: `/${
							department?.is_service
								? "services/services_filter"
								: "products/products_filter"
						}/${department?.id}/${encodeURIComponent(
							department?.name
								.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
								.toLowerCase()
						)}`,
					}}>
					{department?.name}
					{arrow}
				</Link>
				{submenu}
			</li>
		);
	});

	return <ul className='departments__links'>{linksList}</ul>;
}

export default DepartmentsLinks;
