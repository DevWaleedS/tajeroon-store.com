import React from "react";
import { Link } from "react-router-dom";

const ProductImage = ({ item }) => {
	return (
		<div className='product-image'>
			<Link
				to={{
					pathname: `/products/${encodeURIComponent(
						item?.name.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-").toLowerCase()
					)}/${item?.id}`,
				}}
				className='product-image__body'>
				<img className='product-image__img' src={item?.cover} alt={item.name} />
			</Link>
		</div>
	);
};

export default ProductImage;
