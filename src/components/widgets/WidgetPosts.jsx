import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment-with-locales-es6";

function WidgetPosts(props) {
	const { posts } = props;
	const formatDate = (date) => {
		const calcPassedDays = (date1, date2) =>
			Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
		const currentDate = calcPassedDays(+new Date(), +new Date(date));

		if (currentDate === 0)
			return "اليوم،" + moment(date).locale("ar").format(" h:mm a");
		if (currentDate === 1)
			return "أمس،" + moment(date).locale("ar").format(" h:mm a");
		if (currentDate === 2)
			return "منذ يومان،" + moment(date).locale("ar").format(" h:mm a");
		if (currentDate <= 7)
			return (
				`منذ ${currentDate} أيام،` + moment(date).locale("ar").format(" h:mm a")
			);

		return moment(date).locale("ar").format("D MMMM YYYY, h:mm a");
	};

	const postsList = posts?.map((post) => (
		<div key={post.id} className='widget-posts__item'>
			<div className='widget-posts__image'>
				<Link
					to={{
						pathname: `/blog/${post?.id}/${encodeURIComponent(
							post.title
								.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
								.toLowerCase()
						)}`,
					}}>
					<img src={post?.image} alt={post?.title} />
				</Link>
			</div>
			<div className='widget-posts__info'>
				<div className='widget-posts__name'>
					<Link
						to={{
							pathname: `/blog/${post?.id}/${encodeURIComponent(
								post.title
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}`,
						}}>
						{post?.title}
					</Link>
				</div>
				<div className='widget-posts__date'>{formatDate(post?.created_at)}</div>
			</div>
		</div>
	));

	return (
		<div className='widget-posts widget'>
			<h4 className='widget__title'>اخر المقالات</h4>
			<div className='widget-posts__list'>{postsList}</div>
		</div>
	);
}

WidgetPosts.propTypes = {
	/**
	 * array of posts
	 */
	posts: PropTypes.array,
};
WidgetPosts.defaultProps = {
	posts: [],
};

export default WidgetPosts;
