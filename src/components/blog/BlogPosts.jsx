import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import useFetch from "../../hooks/useFetch";
import PageHeader from "../shared/PageHeader";
import PostCard from "../shared/PostCard";
import BlogSidebar from "./BlogSidebar";
import BlockLoader from "../blocks/BlockLoader";
import axios from "axios";
import DisplayedPosts from "./BlogPosts/DisplayedPosts";

function BlogPosts(props) {
	const domain = process.env.REACT_APP_STORE_DOMAIN;
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(5);
	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.sa/api/postStore/${domain}?page=${currentPage}&number=${postsPerPage}`
	);
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isLoadingSearch, setIsLoadingSearch] = useState(false);
	const { layout, sidebarPosition } = props;

	const searchData = () => {
		setIsLoadingSearch(true);
		axios
			.get(`https://backend.atlbha.sa/api/searchPost/${domain}?query=${search}`)
			.then((response) => {
				setSearchResults(response?.data?.data);
				setIsLoadingSearch(false);
			})
			.catch((error) => {
				console.error("Error fetching search results:", error);
				setIsLoadingSearch(false);
			});
	};

	useEffect(() => {
		const timeoutId = search ? setTimeout(() => searchData(), 4000) : null;

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [search]);

	const getSearchData = (search) => {
		setSearch(search);
	};

	const breadcrumb = [
		{ title: "الرئيسية", url: `/}` },
		{ title: "المقالات", url: `/blog` },
	];
	let sidebarStart;
	let sidebarEnd;

	const sidebar = (
		<BlogSidebar
			fetchedData={fetchedData?.data}
			position={sidebarPosition}
			getSearchData={getSearchData}
		/>
	);

	if (sidebarPosition === "start") {
		sidebarStart = (
			<div className='col-12 col-lg-4 order-1 order-lg-0'>{sidebar}</div>
		);
	} else if (sidebarPosition === "end") {
		sidebarEnd = <div className='col-12 col-lg-4'>{sidebar}</div>;
	}

	const displayedPosts = search
		? searchResults?.pages
		: fetchedData?.data?.posts;

	const postsList = displayedPosts?.map((post) => {
		const postLayout = {
			classic: "grid-lg",
			grid: "grid-nl",
			list: "list-nl",
		}[layout];

		return (
			<div key={post.id} className='posts-list__item'>
				<PostCard post={post} layout={postLayout} />
			</div>
		);
	});

	if (loading) {
		return <BlockLoader />;
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{`كل المقالات — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<PageHeader header='المقالات' breadcrumb={breadcrumb} />

			<div className='container'>
				<div className='row'>
					{sidebarStart}
					{isLoadingSearch ? (
						<div className='col-12 col-lg-8'>
							<BlockLoader />
						</div>
					) : displayedPosts?.length > 0 ? (
						<DisplayedPosts
							layout={layout}
							postsList={postsList}
							search={search}
							fetchedData={fetchedData}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
					) : (
						<div className='col-12 col-lg-8'>
							<p>لاتوجد مقالات في هذا القسم</p>
						</div>
					)}
					{sidebarEnd}
				</div>
			</div>
		</React.Fragment>
	);
}

BlogPosts.propTypes = {
	layout: PropTypes.oneOf(["classic", "grid", "list"]),
	sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

BlogPosts.defaultProps = {
	layout: "classic",
	sidebarPosition: "start",
};

export default BlogPosts;
