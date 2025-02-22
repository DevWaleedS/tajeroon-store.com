import React from "react";

import CategoriesList from "../Categories/CategoriesList";
import ProductShowcase from "./ProductShowcase";
import BlockLoader from "../../components/blocks/BlockLoader";

const ProductsSection = ({
	secTitle,
	loading,
	secData,
	categories,
	activeCategoryId,
	setActiveCategoryId,
	layout,
}) => {
	return (
		<section className='block-products-carousel' data-layout={layout}>
			<div className='container'>
				<div className='block-header'>
					<h2 className='block-header__title'>{secTitle}</h2>
					<div className='block-header__divider'></div>

					<CategoriesList
						categories={categories}
						activeCategoryId={activeCategoryId}
						onCategoryClick={setActiveCategoryId}
					/>

					<div className='block-header__arrows-list'>
						<button className='block-header__arrow block-header__arrow--left swiper-product-button-next'>
							<svg xmlns='http://www.w3.org/2000/svg' width='7' height='11'>
								<path d='M6.7,0.3L6.7,0.3c-0.4-0.4-0.9-0.4-1.3,0L0,5.5l5.4,5.2c0.4,0.4,0.9,0.3,1.3,0l0,0c0.4-0.4,0.4-1,0-1.3l-4-3.9l4-3.9 C7.1,1.2,7.1,0.6,6.7,0.3z'></path>
							</svg>
						</button>
						<button className='block-header__arrow block-header__arrow--right swiper-product-button-prev'>
							<svg xmlns='http://www.w3.org/2000/svg' width='7' height='11'>
								<path d='M0.3,10.7L0.3,10.7c0.4,0.4,0.9,0.4,1.3,0L7,5.5L1.6,0.3C1.2-0.1,0.7,0,0.3,0.3l0,0c-0.4,0.4-0.4,1,0,1.3l4,3.9l-4,3.9 C-0.1,9.8-0.1,10.4,0.3,10.7z'></path>
							</svg>
						</button>
					</div>
				</div>
				<div className='block-products-carousel__slider'>
					<div className='block-products-carousel__preloader' />
					{!loading ? (
						<ProductShowcase layout={layout} products={secData} />
					) : (
						<BlockLoader />
					)}
				</div>
			</div>
		</section>
	);
};

export default ProductsSection;
