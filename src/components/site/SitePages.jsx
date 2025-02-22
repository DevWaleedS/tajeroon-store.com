// react
import React, { useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";

// application
import PageHeader from "../shared/PageHeader";

// data stubs

import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import BlockLoader from "../blocks/BlockLoader";

function SitePages() {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const { id } = useParams();
	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.sa/api/storPage/${id}?domain=${domain}`
	);
	const [sitePage, seTSitePage] = useState();

	const breadcrumb = [
		{ title: "الرئيسية", url: `/` },
		{
			title: sitePage?.title,
			url: `/${sitePage?.id}/${encodeURIComponent(
				sitePage?.title
					.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
					.toLowerCase()
			)}`,
		},
	];

	useEffect(() => {
		if (fetchedData?.data?.page) {
			seTSitePage(fetchedData?.data?.page);
		}
	}, [fetchedData?.data?.page]);
	if (loading) {
		return <BlockLoader />;
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${sitePage?.title}`}</title>
			</Helmet>

			<PageHeader header={sitePage?.title} breadcrumb={breadcrumb} />

			<div className='container'>
				<div className='sub_title'>
					<h6>{sitePage?.page_desc}</h6>
				</div>
			</div>

			<div className='block faq'>
				<div
					className='container'
					dangerouslySetInnerHTML={{ __html: sitePage?.page_content }}></div>
			</div>
		</React.Fragment>
	);
}

export default SitePages;
