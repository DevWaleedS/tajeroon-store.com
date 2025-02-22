// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// application
import BlockHeader from "../shared/BlockHeader";

export default function BlockCategories(props) {
	const { title, layout, categories } = props;

	const categoriesList = categories?.map((category, index) => {
		const classes = `block-categories__item category-card category-card--layout--${layout}`;

		const subcategories = category?.subcategory?.map((sub, subIndex) => (
			<li key={subIndex}>
				<Link
					to={{
						pathname: `/products/products_filter/${
							sub?.id
						}/${encodeURIComponent(
							sub?.name
								.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
								.toLowerCase()
						)}`,
					}}>
					{sub?.name}
				</Link>
			</li>
		));

		return (
			<div key={index} className={classes}>
				<div className=' category-card__body'>
					<div className=' category-card__image'>
						<Link
							to={{
								pathname: `/products/products_filter/${
									category?.id
								}/${encodeURIComponent(
									category?.name
										.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
										.toLowerCase()
								)}`,
							}}>
							<img src={category?.icon} alt='icon' />
						</Link>
					</div>
					<div className=' category-card__content'>
						<div className=' category-card__name'>
							<Link
								to={{
									pathname: `/products/products_filter/${
										category?.id
									}/${encodeURIComponent(
										category?.name
											.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
											.toLowerCase()
									)}`,
								}}>
								{category?.name}
							</Link>
						</div>
						<ul className='category-card__links'>{subcategories}</ul>
						<div className='category-card__all'>
							<Link to={`/products`}>عرض الكل</Link>
						</div>
						<div className='category-card__products'>{`${category?.products} Products`}</div>
						<div className='category-card__products'>{`${category?.products} Products`}</div>
					</div>
				</div>
			</div>
		);
	});

	return (
		<div
			className={`block block--highlighted block-categories block-categories--layout--${layout}`}>
			<div className='container'>
				<BlockHeader title={title} />

				<div className='block-categories__list'>{categoriesList}</div>
			</div>
		</div>
	);
}

BlockCategories.propTypes = {
	title: PropTypes.string.isRequired,
	categories: PropTypes.array,
	layout: PropTypes.oneOf(["classic", "compact"]),
};

BlockCategories.defaultProps = {
	categories: [],
	layout: "classic",
};
