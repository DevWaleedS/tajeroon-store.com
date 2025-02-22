import React from "react";
import useApiFetch from "../../hooks/useApiFetch";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import PageLoading from "../../components/PageLoading";

const SlideShow = ({ url }) => {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const { data, loading } = useApiFetch(`${url}/${domain}`);

	if (loading)
		return (
			<div className='block-slideshow block block-slideshow--layout--full'>
				<div className='container'>
					<div className='block-slideshow__body'>
						<PageLoading classNames='style-2' />
					</div>
				</div>
			</div>
		);

	const banars = Array.isArray(data?.data?.banars) ? data.data.banars : [];
	const sliders = Array.isArray(data?.data?.sliders) ? data.data.sliders : [];

	return (
		<div className='block-slideshow block block-slideshow--layout--full'>
			<div className='container'>
				<div className='block-slideshow__body'>
					<Swiper
						spaceBetween={0}
						pagination={{
							clickable: true,
						}}
						autoplay={{
							delay: 2500,
						}}
						modules={[Pagination, Autoplay]}
						className='SlideShow w-100 h-100'>
						{banars.length > 0 ? (
							<>
								{banars.map((image, index) => (
									<SwiperSlide key={index}>
										<img
											alt='banner'
											src={image}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									</SwiperSlide>
								))}
							</>
						) : null}

						{sliders.length > 0 ? (
							<>
								{sliders.map((image, index) => (
									<SwiperSlide key={index}>
										<img
											alt='banner'
											src={image}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									</SwiperSlide>
								))}
							</>
						) : null}
					</Swiper>
				</div>
			</div>
		</div>
	);
};

export default SlideShow;
