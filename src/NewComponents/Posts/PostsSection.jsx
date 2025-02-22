import React from "react";
import useApiFetch from "../../hooks/useApiFetch";
import PageLoading from "../../components/PageLoading";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import PostCard from "../../components/shared/PostCard";

const PostsSection = ({ layout, secTitle }) => {
	const domain = process.env.REACT_APP_STORE_DOMAIN;

	const { data, loading } = useApiFetch(
		`https://backend.atlbha.sa/api/lastPosts/${domain}`
	);

	if (data?.data?.lastPosts?.length === 0) return null;
	if (loading)
		return (
			<>
				<section
					className={`position-relative block block-posts block-posts--layout--${layout}`}
					data-layout={layout}
					style={{ height: "150px" }}>
					<div className='container '>
						<PageLoading classNames='style-2' />
					</div>
				</section>
			</>
		);

	return (
		<>
			<section
				className={`block block-posts block-posts--layout--${layout}`}
				data-layout={layout}>
				<div className='container'>
					<div className='block-header'>
						<h2 className='block-header__title'>{secTitle}</h2>
						<div className='block-header__divider'></div>

						<div className='block-header__arrows-list'>
							<button className='block-header__arrow block-header__arrow--left swiper-posts-button-next'>
								<svg xmlns='http://www.w3.org/2000/svg' width='7' height='11'>
									<path d='M6.7,0.3L6.7,0.3c-0.4-0.4-0.9-0.4-1.3,0L0,5.5l5.4,5.2c0.4,0.4,0.9,0.3,1.3,0l0,0c0.4-0.4,0.4-1,0-1.3l-4-3.9l4-3.9 C7.1,1.2,7.1,0.6,6.7,0.3z'></path>
								</svg>
							</button>
							<button className='block-header__arrow block-header__arrow--right swiper-posts-button-prev'>
								<svg xmlns='http://www.w3.org/2000/svg' width='7' height='11'>
									<path d='M0.3,10.7L0.3,10.7c0.4,0.4,0.9,0.4,1.3,0L7,5.5L1.6,0.3C1.2-0.1,0.7,0,0.3,0.3l0,0c-0.4,0.4-0.4,1,0,1.3l4,3.9l-4,3.9 C-0.1,9.8-0.1,10.4,0.3,10.7z'></path>
								</svg>
							</button>
						</div>
					</div>
					<div className=''>
						<Swiper
							spaceBetween={50}
							slidesPerView={2}
							loop={true}
							breakpoints={{
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
							}}
							navigation={{
								nextEl: ".swiper-posts-button-next",
								prevEl: ".swiper-posts-button-prev",
							}}>
							{data?.data?.lastPosts?.length !== 0 ? (
								data?.data?.lastPosts?.map((post) => (
									<SwiperSlide key={post.id}>
										<div className='col'>
											<PostCard post={post} />
										</div>
									</SwiperSlide>
								))
							) : (
								<div
									className='d-flex flex-column w-100 align-items-center justify-content-center'
									style={{ minHeight: "120px" }}>
									<h6>لاتوجد مقالات في هذا القسم</h6>
								</div>
							)}
						</Swiper>
					</div>
				</div>
			</section>
		</>
	);
};

export default PostsSection;
