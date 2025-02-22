import React from "react";
// Install Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../../components/shared/ProductCard";
SwiperCore.use([Navigation]);

const ProductShowcase = ({ products, layout }) => {
	const breakpointsStyle = {
		0: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
		640: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 10,
		},
		1024: {
			slidesPerView: 4,
			spaceBetween: 10,
		},
	};
	const breakpointsStyleHorizontal = {
		0: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
		640: {
			slidesPerView: 1,
			spaceBetween: 10,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		1024: {
			slidesPerView: 3,
			spaceBetween: 10,
		},
	};

	return (
		<Swiper
			spaceBetween={50}
			slidesPerView={4}
			loop={true}
			breakpoints={
				layout == "horizontal" ? breakpointsStyleHorizontal : breakpointsStyle
			}
			navigation={{
				nextEl: ".swiper-product-button-next",
				prevEl: ".swiper-product-button-prev",
			}}>
			<>
				{products?.length > 0 ? (
					products?.map((product) => (
						<SwiperSlide key={`product-${product.id}`}>
							<div style={{ paddingBottom: "56px" }}>
								<div className='block-products-carousel__column'>
									<div className='block-products-carousel__cell'>
										<ProductCard product={product} />
									</div>
								</div>
							</div>
						</SwiperSlide>
					))
				) : (
					<div
						className=' d-flex justify-content-center align-items-center'
						style={{ height: "200px" }}>
						<div className='block-products-carousel__column'>
							لا توجد بيانات لهذا النشاط
						</div>
					</div>
				)}
			</>
		</Swiper>
	);
};

export default ProductShowcase;
