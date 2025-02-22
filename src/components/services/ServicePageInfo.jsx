// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import useFetch from "../../hooks/useFetch";

// application
import PageHeader from "../shared/PageHeader";
import ProductTabs from "../shop/ProductTabs";
import { url } from "../../services/utils";

// blocks
import BlockLoader from "../blocks/BlockLoader";

// widgets
import WidgetCategories from "../widgets/WidgetCategories";

import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import SitePageNotFound from "../site/SitePageNotFound";
import { SnapPixel, TiktokPixel, TwitterPixel, InstagramPixel } from "../SEO";
import { Service, ServicesCarouselBlock, WidgetServices } from ".";

function ServicePageInfo(props) {
	const { serviceId: id } = useParams();

	const { layout, sidebarPosition } = props;
	const token = localStorage.getItem("token");
	const domain = process.env.REACT_APP_STORE_DOMAIN;

	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.sa/api/productPage/${domain}/${id}`
	);

	if (loading) {
		return <BlockLoader />;
	}

	const breadcrumb = [
		{ title: "الرئيسية", url: url.home() },
		{ title: "الخدمات", url: url.catalog() },
		{ title: fetchedData?.data?.product?.name, url: "" },
	];

	let content;

	if (layout === "sidebar") {
		const sidebar = (
			<div className='shop-layout__sidebar'>
				<div className='block block-sidebar'>
					<div className='block-sidebar__item'>
						<WidgetCategories location='service' />
					</div>
					<div className='block-sidebar__item d-none d-lg-block'>
						<WidgetServices title='الخدمات المضافة مؤخراً' />
					</div>
				</div>
			</div>
		);

		content = (
			<div className='container'>
				<div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
					{sidebarPosition === "start" && sidebar}
					<div className=' shop-layout__content'>
						<div className=' block'>
							<Service
								token={token}
								product={fetchedData?.data?.product}
								layout={layout}
							/>
							<ProductTabs withSidebar />
						</div>

						{fetchedData?.data?.relatedProduct?.length > 0 && (
							<ServicesCarouselBlock
								title='خدمات ذات صله'
								layout='grid-4-sm'
								products={fetchedData?.data?.relatedProduct}
								withSidebar
							/>
						)}
					</div>
					{sidebarPosition === "end" && sidebar}
				</div>
			</div>
		);
	} else {
		content = (
			<React.Fragment>
				<div className='block'>
					<div className='container'>
						<Service
							token={token}
							product={fetchedData?.data?.product}
							layout={layout}
						/>
						<ProductTabs data={fetchedData?.data} />
					</div>
				</div>

				{fetchedData?.data?.relatedProduct?.length > 0 && (
					<ServicesCarouselBlock
						title='خدمات ذات صله'
						layout='grid-5'
						products={fetchedData?.data?.relatedProduct}
					/>
				)}
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${localStorage.getItem("store-name")} - ${
					fetchedData?.data?.product?.name
				}`}</title>

				<meta
					name='keywords'
					content={fetchedData?.data?.product?.SEOdescription?.toString()}
				/>
				<meta
					name='description'
					content={fetchedData?.data?.product?.short_description}
				/>
			</Helmet>
			{fetchedData?.data ? (
				<>
					<SnapPixel data={fetchedData?.data?.product?.snappixel} />
					<TiktokPixel data={fetchedData?.data?.product?.tiktokpixel} />
					<TwitterPixel data={fetchedData?.data?.product?.twitterpixel} />
					<InstagramPixel data={fetchedData?.data?.product?.instapixel} />
					<PageHeader breadcrumb={breadcrumb} />
					{content}
				</>
			) : (
				<SitePageNotFound />
			)}
		</React.Fragment>
	);
}

ServicePageInfo.propTypes = {
	/** Product slug. */
	servicesSlug: PropTypes.string,
	/** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
	layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
	/**
	 * sidebar position (default: 'start')
	 * one of ['start', 'end']
	 * for LTR scripts "start" is "left" and "end" is "right"
	 */
	sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ServicePageInfo.defaultProps = {
	layout: "standard",
	sidebarPosition: "start",
};

export default ServicePageInfo;
