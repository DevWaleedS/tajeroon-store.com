// react
import React from "react";

// third-party
import Slider from "react-slick";

export default function BlockBanner({ bannars }) {
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
    };
    const banners = bannars?.map((banner, index) => {
        return <img key={index} alt={index} src={banner} width="100%" height="245px" />;
    });

    return (
        <div className="block block-banner banners">
            <div className="container">
                <div className="block-slideshow ">
                    <Slider {...settings}>{banners}</Slider>
                </div>
            </div>
        </div>
    );
}
