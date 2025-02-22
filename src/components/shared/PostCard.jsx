// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment-with-locales-es6";

function PostCard(props) {
	const { post, layout } = props;
	const cardClasses = classNames("post-card", {
		"post-card--layout--grid": ["grid-nl", "grid-lg"].includes(layout),
		"post-card--layout--list": ["list-nl", "list-sm"].includes(layout),
		"post-card--size--nl": ["grid-nl", "list-nl"].includes(layout),
		"post-card--size--lg": layout === "grid-lg",
		"post-card--size--sm": layout === "list-sm",
	});

	// formatDate
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

	return (
		<>
			<div className={cardClasses}>
				<div className='post-card__image'>
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
				<div className='post-card__info'>
					<div className='post-card__category'>
						<Link to={`/`}>{post?.postCategory?.name}</Link>
					</div>
					<div className='post-card__name'>
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
					<div className='post-card__date'>{formatDate(post?.created_at)}</div>
					<div className='post-card__content'>{post?.page_desc}</div>
					<div className='post-card__read-more'>
						<Link
							to={{
								pathname: `/blog/${post?.id}/${encodeURIComponent(
									post.title
										.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
										.toLowerCase()
								)}`,
							}}
							className='btn btn-secondary btn-sm'>
							إقرأ المزيد
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

PostCard.propTypes = {
	/**
	 * post data object
	 */
	post: PropTypes.object,
	/**
	 * post card layout
	 * one of ['grid-nl', 'grid-lg', 'list-nl', 'list-sm']
	 */
	layout: PropTypes.oneOf(["grid-nl", "grid-lg", "list-nl", "list-sm"]),
};

export default PostCard;
