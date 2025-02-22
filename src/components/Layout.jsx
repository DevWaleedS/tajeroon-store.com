// react
import React, { useEffect } from "react";
// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useFetch from "../hooks/useFetch";

// application
import Footer from "./footer";
import Header from "./header";
import MobileHeader from "./mobile/MobileHeader";
import MobileMenu from "./mobile/MobileMenu";
import Quickview from "./shared/Quickview";

// pages
import AccountLayout from "./account/AccountLayout";
import AccountPageLogin from "./account/AccountPageLogin";
import BlogPosts from "./blog/BlogPosts";
import BlogPagePost from "./blog/BlogPagePost";
import PageCart from "./shop/ShopPageCart";
import PageCheckout from "./shop/ShopPageCheckout";
import PageCompare from "./shop/ShopPageCompare";
import PageWishlist from "./shop/ShopPageWishlist";
import ShopPageCategory from "./shop/ShopPageCategory";
import ShopPageOrderSuccess from "./shop/ShopPageOrderSuccess";
import ShopPageOrderFailed from "./shop/ShopPageOrderFailed";
import ShopPageProduct from "./shop/ShopPageProduct";
import ShopPageTrackOrder from "./shop/ShopPageTrackOrder";
import SitePageContactUs from "./site/SitePageContactUs";
import SitePageNotFound from "./site/SitePageNotFound";
import StoreNotFound from "./site/StoreNotFound";
import StoreUnderMaintenance from "./site/StoreUnderMaintenance";
import HomePageOne from "./home/HomePageOne";

import LoginModalComp from "./LoginModal/LoginModal";

// data stubs
import SitePages from "./site/SitePages";
import PageLoading from "./PageLoading";
import {
	SnapPixel,
	TiktokPixel,
	TwitterPixel,
	InstagramPixel,
	GoogleTagManagerHead,
	GoogleTagManagerBody,
	GoogleAnalytics,
} from "./SEO";
import { ServicePageInfo, ServicesPage } from "./services";
import ShopCart from "./shop/ShopCart";

const categoryLayouts = [
	[
		"/shop/category-grid-3-columns-sidebar",
		{ columns: 3, viewMode: "grid", sidebarPosition: "start" },
	],
	["/shop/category-grid-4-columns-full", { columns: 4, viewMode: "grid" }],
	["/shop/category-grid-5-columns-full", { columns: 5, viewMode: "grid" }],
	[
		"/shop/category-list",
		{ columns: 3, viewMode: "list", sidebarPosition: "start" },
	],
	[
		"/shop/category-right-sidebar",
		{ columns: 3, viewMode: "grid", sidebarPosition: "end" },
	],
].map(([url, options]) => (
	<Route
		key={url}
		exact
		path={url}
		render={(props) => (
			<ShopPageCategory {...props} {...options} categorySlug='power-tools' />
		)}
	/>
));

const productLayouts = [
	["/shop/product-standard", { layout: "standard" }],
	["/shop/product-columnar", { layout: "columnar" }],
	["/shop/product-sidebar", { layout: "sidebar" }],
].map(([url, options]) => (
	<Route
		key={url}
		exact
		path={url}
		render={(props) => (
			<ShopPageProduct
				{...props}
				{...options}
				productSlug='brandix-screwdriver-screw1500acc'
			/>
		)}
	/>
));

function Layout(props) {
	const token = localStorage.getItem("token");
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const { headerLayout } = props;

	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.sa/api/indexStore/${domain}`
	);

	// to hide or show the services link
	const { fetchedData: servicesData } = useFetch(
		`https://backend.atlbha.sa/api/storeProductCategory?domain=${domain}&is_service=1`
	);
	// to hide or show the services link
	const { fetchedData: productsData } = useFetch(
		`https://backend.atlbha.sa/api/storeProductCategory?domain=${domain}`
	);

	useEffect(() => {
		localStorage.setItem("store-name", fetchedData?.data?.storeName);
		localStorage.setItem("store-logo", fetchedData?.data?.logo);
		localStorage.setItem("storeId", fetchedData?.data?.storeId);
	}, [fetchedData]);

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--primary-bg",
			fetchedData?.data?.Theme ? fetchedData?.data?.Theme?.primaryBg : "#1dbbbe"
		);
		document.documentElement.style.setProperty(
			"--secondary-bg",
			fetchedData?.data?.Theme
				? fetchedData?.data?.Theme?.secondaryBg
				: "#02466a"
		);
		document.documentElement.style.setProperty(
			"--fontColor",
			fetchedData?.data?.Theme ? fetchedData?.data?.Theme?.fontColor : "#3d464d"
		);
		document.documentElement.style.setProperty(
			"--header-bg",
			fetchedData?.data?.Theme ? fetchedData?.data?.Theme?.headerBg : "#1dbbbe"
		);
		document.documentElement.style.setProperty(
			"--layout-bg",
			fetchedData?.data?.Theme ? fetchedData?.data?.Theme?.layoutBg : "#ffffff"
		);
		document.documentElement.style.setProperty(
			"--icons-bg",
			fetchedData?.data?.Theme ? fetchedData?.data?.Theme?.iconsBg : "#1dbbbe"
		);
		document.documentElement.style.setProperty(
			"--footer-bg",
			fetchedData?.data?.Theme ? fetchedData?.data?.Theme?.footerBg : "#ffffff"
		);
		document.documentElement.style.setProperty(
			"--footer-border",
			fetchedData?.data?.Theme
				? fetchedData?.data?.Theme?.footerBorder
				: "#ebebeb"
		);
	}, [fetchedData?.data?.Theme]);

	if (fetchedData?.success === false && fetchedData?.data === null) {
		return <StoreNotFound title={fetchedData?.message?.ar} />;
	}

	if (
		fetchedData?.success &&
		fetchedData?.data?.status === 200 &&
		fetchedData?.message?.en === "Maintenance return successfully"
	) {
		return (
			<StoreUnderMaintenance
				title={fetchedData?.data?.maintenanceMode?.title}
				message={fetchedData?.data?.maintenanceMode?.message}
			/>
		);
	}

	if (loading) {
		return <PageLoading />;
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>
					{fetchedData?.data?.Seo?.title ?? localStorage.getItem("store-name")}
				</title>
				<meta
					name='description'
					content={
						fetchedData?.data?.Seo?.metaDescription ??
						localStorage.getItem("store-name")
					}
				/>
				<meta
					name='keywords'
					content={fetchedData?.data?.Seo?.key_words?.toString() || "أطلبها"}
				/>

				{fetchedData?.data?.Seo?.search && (
					<meta
						name='google-site-verification'
						content={fetchedData?.data?.Seo?.search}
					/>
				)}

				{/* Open Graph */}
				{fetchedData?.data?.Seo?.graph && (
					<>
						<meta
							property='og:title'
							content={fetchedData?.data?.Seo?.graph?.og_title}
						/>
						<meta
							property='og:site_name'
							content={fetchedData?.data?.Seo?.graph?.og_site_name}
						/>
						<meta
							property='og:url'
							content={fetchedData?.data?.Seo?.graph?.og_url}
						/>
						<meta
							property='og:description'
							content={fetchedData?.data?.Seo?.graph?.og_description}
						/>
						<meta
							property='og:type'
							content={fetchedData?.data?.Seo?.graph?.og_type}
						/>
						<meta
							property='og:image'
							content={fetchedData?.data?.Seo?.graph?.og_image}
						/>
					</>
				)}
			</Helmet>
			{fetchedData?.data?.Seo?.google_analytics && (
				<GoogleAnalytics gtmScript={fetchedData?.data?.Seo?.google_analytics} />
			)}

			{fetchedData?.data?.Seo?.tag && (
				<GoogleTagManagerHead gtmScript={fetchedData.data.Seo.tag} />
			)}

			{fetchedData?.data?.Seo?.footer && (
				<GoogleTagManagerBody gtmBody={fetchedData.data.Seo.footer} />
			)}

			{fetchedData?.data?.Seo?.snappixel && (
				<SnapPixel data={fetchedData?.data?.Seo?.snappixel} />
			)}

			{fetchedData?.data?.Seo?.twitterpixel && (
				<TwitterPixel data={fetchedData?.data?.Seo?.twitterpixel} />
			)}

			{fetchedData?.data?.Seo?.instapixel && (
				<InstagramPixel data={fetchedData?.data?.Seo?.instapixel} />
			)}

			{fetchedData?.data?.Seo?.tiktokpixel && (
				<TiktokPixel data={fetchedData?.data?.Seo?.tiktokpixel} />
			)}

			<LoginModalComp />
			<ToastContainer
				autoClose={5000}
				hideProgressBar
				rtl
				position='top-left'
			/>

			<Quickview />

			<MobileMenu
				fetchedData={fetchedData?.data}
				servicesData={servicesData?.data?.Products}
				productsData={productsData?.data?.Products}
			/>

			<div className='site'>
				<header className='site__header d-lg-none'>
					<MobileHeader fetchedData={fetchedData?.data} />
				</header>

				<header className='site__header d-lg-block d-none'>
					<Header
						fetchedData={fetchedData?.data}
						layout={headerLayout}
						servicesData={servicesData?.data?.Products}
						productsData={productsData?.data?.Products}
					/>
				</header>

				<div className='site__body'>
					<Switch>
						services
						<Route
							exact
							path='/'
							render={() => (
								<HomePageOne fetchedData={fetchedData} loading={loading} />
							)}
						/>
						<Route exact path='/account/login' component={AccountPageLogin} />
						<Route path='/account' component={AccountLayout} />
						<Route
							exact
							path='/products'
							render={(props) => (
								<ShopPageCategory
									{...props}
									columns={3}
									viewMode='grid'
									sidebarPosition='start'
								/>
							)}
						/>
						<Route
							exact
							path='/products/:productName/:productId'
							render={(props) => (
								<ShopPageProduct
									{...props}
									layout='standard'
									productSlug={props.match.params.productId}
								/>
							)}
						/>
						<Route
							exact
							path='/products/products_filter/:productId/:categoryName'
							render={(props) => (
								<ShopPageCategory
									{...props}
									columns={3}
									viewMode='grid'
									sidebarPosition='start'
								/>
							)}
						/>
						<Route
							exact
							path='/services/services_filter/:serviceId/:serviceName'
							render={(props) => (
								<ServicesPage
									{...props}
									columns={3}
									viewMode='grid'
									sidebarPosition='start'
								/>
							)}
						/>
						<Route
							exact
							path='/services/:serviceId/:serviceName'
							render={(props) => (
								<ServicePageInfo
									{...props}
									layout='standard'
									servicesSlug={props.match.params.serviceId}
								/>
							)}
						/>
						{/* Route for services list */}
						<Route
							exact
							path='/services'
							render={(props) => (
								<ServicesPage
									{...props}
									columns={3}
									viewMode='grid'
									sidebarPosition='start'
								/>
							)}
						/>
						{/* Following category layouts only for demonstration. */}
						{categoryLayouts}
						{/* Following product layouts only for demonstration. */}
						{productLayouts}
						{/** cart of products */}
						<Route
							exact
							path='/cart'
							render={() => <ShopCart token={token} />}
						/>
						<Route
							exact
							path='/checkout'
							render={() => <PageCheckout token={token} />}
						/>
						<Route
							exact
							path='/checkout/success'
							component={ShopPageOrderSuccess}
						/>
						<Route
							exact
							path='/checkout/failed'
							component={ShopPageOrderFailed}
						/>
						<Route exact path='/wishlist' component={PageWishlist} />
						<Route exact path='/compare' component={PageCompare} />
						<Route exact path='/track-order' component={ShopPageTrackOrder} />
						<Route
							exact
							path='/blog'
							render={(props) => (
								<BlogPosts {...props} layout='classic' sidebarPosition='end' />
							)}
						/>
						<Route
							exact
							path='/blog/:id/:post_title'
							render={(props) => (
								<BlogPagePost
									{...props}
									layout='classic'
									sidebarPosition='end'
								/>
							)}
						/>
						<Route
							exact
							path='/contact-us'
							render={() => (
								<SitePageContactUs
									fetchedData={fetchedData?.data}
									loading={loading}
								/>
							)}
						/>
						<Route exact path={"/terms/:title/:id"} component={SitePages} />
						<Route component={SitePageNotFound} />
					</Switch>
				</div>
				{!loading && (
					<footer className='site__footer'>
						<Footer fetchedData={fetchedData?.data} />
					</footer>
				)}
			</div>
		</React.Fragment>
	);
}

Layout.propTypes = {
	/**
	 * header layout (default: 'classic')
	 * one of ['classic', 'compact']
	 */
	headerLayout: PropTypes.oneOf(["default", "compact"]),
};

Layout.defaultProps = {
	headerLayout: "default",
};

export default Layout;
