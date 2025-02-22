// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// application
import Currency from "../shared/Currency";

function WidgetProducts(props) {
	const { title, products } = props;
	const productsList = products.map((product) => {
		let image;
		let price;

		if (product?.cover) {
			image = (
				<div className='widget-products__image'>
					<div className='product-image'>
						<Link
							to={`/services/${product?.id}/${encodeURIComponent(
								product?.name
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}`}
							className='product-image__body'>
							<img
								className='product-image__img'
								src={product?.cover}
								alt={product?.name}
							/>
						</Link>
					</div>
				</div>
			);
		}

		if (Number(product?.discount_price) > 0) {
			price = (
				<React.Fragment>
					<span className='widget-products__new-price'>
						<Currency value={Number(product?.discount_price) || 0} />
					</span>{" "}
					<span className='widget-products__old-price'>
						<Currency value={Number(product?.selling_price) || 0} />
					</span>
				</React.Fragment>
			);
		} else {
			price = <Currency value={Number(product?.selling_price) || 0} />;
		}

		return (
			<div key={product.id} className='widget-products__item'>
				{image}
				<div className='widget-products__info'>
					<div className='widget-products__name'>
						<Link
							to={`/services/${product?.id}/${encodeURIComponent(
								product?.name
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}`}>
							{product?.name}
						</Link>
					</div>
					<div className='widget-products__prices'>{price}</div>
					<span className='tax-text'>السعر شامل الضريبة</span>
				</div>
			</div>
		);
	});

	return (
		<div className='widget-products widget'>
			<h4 className='widget__title'>{title}</h4>
			<div className='widget-products__list'>{productsList}</div>
		</div>
	);
}

WidgetProducts.propTypes = {
	/**
	 * widget title
	 */
	title: PropTypes.node,
	/**
	 * array of product objects
	 */
	products: PropTypes.array,
};

WidgetProducts.defaultProps = {
	products: [],
};

export default WidgetProducts;
