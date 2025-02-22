// react
import React from "react";
import { useParams } from "react-router-dom";
// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import useFetch from "../../hooks/useFetch";

// application
import PageHeader from "../shared/PageHeader";
import BlogPost from "./BlogPost";
import BlogSidebar from "./BlogSidebar";
import BlockLoader from "../blocks/BlockLoader";

export default function BlogPagePost(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const { id } = useParams();

	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.sa/api/postdetail/${id}?domain=${domain}`
	);
	const { layout, sidebarPosition } = props;

	let content;

	if (loading) {
		return <BlockLoader />;
	}

	if (layout === "classic") {
		const sidebar = (
			<BlogSidebar fetchedData={fetchedData?.data} position={sidebarPosition} />
		);

		let sidebarStart;
		let sidebarEnd;

		if (sidebarPosition === "start") {
			sidebarStart = (
				<div className='col-12 col-lg-4 order-1 order-lg-0'>{sidebar}</div>
			);
		}
		if (sidebarPosition === "end") {
			sidebarEnd = <div className='col-12 col-lg-4'>{sidebar}</div>;
		}

		content = (
			<div className='row'>
				{sidebarStart}
				<div className='col-12 col-lg-8'>
					<BlogPost
						data={fetchedData?.data?.post}
						relatedPosts={fetchedData?.data?.relatedPosts}
						layout={layout}
					/>
				</div>
				{sidebarEnd}
			</div>
		);
	} else if (layout === "full") {
		content = (
			<div className='row justify-content-center'>
				<div className='col-md-12 col-lg-9 col-xl-8'>
					<BlogPost layout={layout} />
				</div>
			</div>
		);
	}

	const breadcrumbs = [
		{ title: "الرئيسية", url: `/` },
		{ title: "المقالات", url: `/blog` },
		{ title: `${fetchedData?.data?.post?.title}`, url: "" },
	];

	return (
		<React.Fragment>
			<Helmet>
				<title>{` ${localStorage.getItem("store-name")} — ${
					fetchedData?.data?.post?.seo_title
						? fetchedData?.data?.post?.seo_title
						: fetchedData?.data?.post?.title
				}`}</title>
				<meta
					name='description'
					content={
						fetchedData?.data?.post?.seo_desc
							? fetchedData?.data?.post?.seo_desc
							: fetchedData?.data?.post?.page_desc
					}
				/>
			</Helmet>

			<PageHeader breadcrumb={breadcrumbs} />

			<div className='container'>{content}</div>
		</React.Fragment>
	);
}

BlogPagePost.propTypes = {
	/**
	 * post layout
	 * one of ['classic', 'full'] (default: 'classic')
	 */
	layout: PropTypes.oneOf(["classic", "full"]),
	/**
	 * sidebar position (default: 'start')
	 * one of ['start', 'end']
	 * for LTR scripts "start" is "left" and "end" is "right"
	 */
	sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

BlogPagePost.defaultProps = {
	layout: "classic",
	sidebarPosition: "start",
};
