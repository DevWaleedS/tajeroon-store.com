import React from "react";
import PropTypes from "prop-types";
import WidgetPosts from "../widgets/WidgetPosts";
import WidgetSearch from "../widgets/WidgetSearch";
import WidgetTags from "../widgets/WidgetTags";
import { useLocation } from "react-router-dom";

export default function BlogSidebar(props) {
	const location = useLocation();

	const { position, fetchedData, getSearchData } = props;

	return (
		<div className={`block block-sidebar block-sidebar--position--${position}`}>
			{fetchedData?.posts?.length > 0 && (
				<div className='block-sidebar__item'>
					<WidgetSearch getSearchData={getSearchData} />
				</div>
			)}
			{fetchedData?.lastPosts?.length > 0 && (
				<div className='block-sidebar__item'>
					<WidgetPosts posts={fetchedData?.lastPosts?.slice(0, 3)} />
				</div>
			)}
			{(fetchedData?.tags?.length > 0 ||
				fetchedData?.post?.tags?.length > 0) && (
				<div className='block-sidebar__item'>
					<WidgetTags
						tags={
							location?.pathname === `/blog`
								? fetchedData?.tags
								: fetchedData?.post?.tags
						}
					/>
				</div>
			)}
		</div>
	);
}

BlogSidebar.propTypes = {
	position: PropTypes.oneOf(["start", "end"]),
};

BlogSidebar.defaultProps = {
	position: "start",
};
