import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BlockFeatures from "../blocks/BlockFeatures";
import BlockProductColumns from "../blocks/BlockProductColumns";

import ProductsSection from "../../NewComponents/Products/ProductsSection";
import SlideShow from "../../NewComponents/Slider/SlideShow";
import PostsSection from "../../NewComponents/Posts/PostsSection";
import useFetch from "../../hooks/useFetch";
import { FaviconChanger } from "../SEO";

function HomePageOne({ fetchedData }) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const [activeCategoryId, setActiveCategoryId] = useState(null);
	const { fetchedData: categories } = useFetch(
		`https://backend.atlbha.sa/api/home/categories/${domain}`
	);

	// recentProducts
	const { fetchedData: recentProducts, loading: recentProductsLoading } =
		useFetch(
			`https://backend.atlbha.sa/api/recentProducts/${domain}?number=20${
				activeCategoryId !== null ? "&category_id=" + activeCategoryId : ""
			}`
		);

	// specialProducts
	const { fetchedData: specialProducts, loading: specialProductsLoading } =
		useFetch(
			`https://backend.atlbha.sa/api/specialProducts/${domain}?number=20${
				activeCategoryId !== null ? "&category_id=" + activeCategoryId : ""
			}`
		);

	// moreSalesProducts
	const { fetchedData: moreSalesProducts, loading: moreSalesProductsLoading } =
		useFetch(
			`https://backend.atlbha.sa/api/moreSalesProducts/${domain}?number=20${
				activeCategoryId !== null ? "&category_id=" + activeCategoryId : ""
			}`
		);

	useEffect(() => {}, [activeCategoryId]);

	const columns = [
		{
			title: "المنتجات الأكثر تقييماً",
			products: fetchedData?.data?.productsRatings?.slice(0, 3) || [],
		},
	];

	return (
		<React.Fragment>
			<Helmet>
				<title>{`الرئيسية — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<SlideShow url='https://backend.atlbha.sa/api/silders' />
			<BlockFeatures />

			{/* :: => Products Section */}
			<ProductsSection
				secTitle='الجديد'
				layout='grid-4'
				categories={categories}
				loading={recentProductsLoading}
				activeCategoryId={activeCategoryId}
				setActiveCategoryId={setActiveCategoryId}
				secData={recentProducts?.data?.resent_arrive}
			/>

			{/* :: => Slide Show Banner */}
			<SlideShow url='https://backend.atlbha.sa/api/banars' />

			{/* :: => Products Section */}
			<ProductsSection
				secTitle='المميزة'
				layout='grid-5'
				categories={categories}
				loading={specialProductsLoading}
				activeCategoryId={activeCategoryId}
				setActiveCategoryId={setActiveCategoryId}
				secData={specialProducts?.data?.specialProducts}
			/>

			{/* :: => Products Section */}
			<ProductsSection
				secTitle='الأكثر طلباً'
				layout='horizontal'
				categories={categories}
				loading={moreSalesProductsLoading}
				activeCategoryId={activeCategoryId}
				setActiveCategoryId={setActiveCategoryId}
				secData={moreSalesProducts?.data?.moreSalesProducts}
			/>

			{/* :: => Posts Section */}
			<PostsSection secTitle='المقالات' layout='list-sm' />

			{columns?.[0]?.products?.length !== 0 && (
				<BlockProductColumns columns={columns} />
			)}
			<FaviconChanger />
		</React.Fragment>
	);
}

export default HomePageOne;
