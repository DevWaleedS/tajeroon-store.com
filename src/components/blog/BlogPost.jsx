// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment-with-locales-es6";

export default function BlogPost(props) {
	const { layout, data, relatedPosts } = props;

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

	const postClasses = classNames("post__content typography", {
		"typography--expanded": layout === "full",
	});

	/* related posts array */
	const relatedPostsList = relatedPosts?.slice(0, 2).map((relatedPost) => (
		<div
			key={relatedPost?.id}
			className='related-posts__item post-card post-card--layout--related'>
			<div className='post-card__image'>
				<Link
					to={{
						pathname: `/blog/${relatedPost?.id}/${encodeURIComponent(
							relatedPost?.title
								.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
								.toLowerCase()
						)}`,
					}}>
					<img
						src={relatedPost?.image}
						alt={relatedPost.title}
						width={"100%"}
					/>
				</Link>
			</div>
			<div className='post-card__info'>
				<div className='post-card__name'>
					<Link
						to={{
							pathname: `/blog/${relatedPost?.id}/${encodeURIComponent(
								relatedPost?.title
									.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-")
									.toLowerCase()
							)}`,
						}}>
						{relatedPost?.title}
					</Link>
				</div>
				<div className='post-card__date'>
					{" "}
					{formatDate(relatedPost?.created_at)}
				</div>
			</div>
		</div>
	));

	return (
		<>
			<div className={`block post post--layout--${layout}`}>
				<div
					className={`post__header post-header post-header--layout--${layout}`}>
					<h1 className='post-header__title'>{data?.title}</h1>
					<div className='post-header__meta'>
						<div className='post-header__meta-item'>
							بواسطة {data?.user?.name}
						</div>
						<div className='post-header__meta-item'>
							{formatDate(data?.created_at)}
						</div>
						{/*<div className="post-header__meta-item">4 التعليقات</div>*/}
					</div>
				</div>

				<div className='post__featured'>
					<img src={data?.image} width={"100%"} alt={data?.title} />
				</div>
				<div className={postClasses}>
					<div dangerouslySetInnerHTML={{ __html: data?.page_content }} />
				</div>
				<div className='post__footer'>
					<div className='post__tags-share-links'>
						<div className='post__tags tags'>
							<div className='tags__list'>
								{data?.tags?.map(
									(tag, index) => tag !== "" && <span key={index}>{tag}</span>
								)}
							</div>
						</div>
						{/*<div className="post__share-links share-links">
                        <ul className="share-links__list">
                            <li className="share-links__item share-links__item--type--like"><Link to="/">Like</Link></li>
                            <li className="share-links__item share-links__item--type--tweet"><Link to="/">Tweet</Link></li>
                            <li className="share-links__item share-links__item--type--pin"><Link to="/">Pin It</Link></li>
                            <li className="share-links__item share-links__item--type--counter"><Link to="/">4K</Link></li>
                        </ul>
                    </div>*/}
					</div>
					{/*<div className="post-author">
                    <div className="post-author__avatar">
                        <img src={data?.user?.image} alt={data?.user?.name} />
                    </div>
                    <div className="post-author__info">
                        <div className="post-author__name">{data?.user?.name}</div>
                        <div className="post-author__about">هنا تعرض نبذة قصيرة عن الكاتب</div>
                    </div>
                </div>*/}
				</div>
				{relatedPosts?.length !== 0 && (
					<section className='post__section'>
						<h4 className='post__section-title'>مقالات ذات صلة</h4>
						<div className='related-posts'>
							<div className='related-posts__list'>{relatedPostsList}</div>
						</div>
					</section>
				)}

				{/*<section className="post__section">
                <h4 className="post__section-title">{`التعليقات (${comments.count})`}</h4>

                <BlogCommentsList comments={comments.items} />
            </section>*/}

				{/*<section className="post__section">
                <h4 className="post__section-title">اكتب </h4>
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="comment-first-name">الاسم الاول</label>
                            <input type="text" className="form-control" id="comment-first-name" placeholder="الاسم الاول" />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="comment-last-name">الاسم الاخير</label>
                            <input type="text" className="form-control" id="comment-last-name" placeholder="الاسم الاخير" />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="comment-email">البريد الالكتروني</label>
                            <input type="email" className="form-control" id="comment-email" placeholder="البريد الالكتروني" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment-content">التعليق</label>
                        <textarea className="form-control" id="comment-content" rows="6" />
                    </div>
                    <div className="form-group mt-4">
                        <button type="submit" className="btn btn-primary btn-lg">انشر التعليق</button>
                    </div>
                </form>
            </section>*/}
			</div>
		</>
	);
}

BlogPost.propTypes = {
	/**
	 * post layout
	 * one of ['classic', 'full'] (default: 'classic')
	 */
	layout: PropTypes.oneOf(["classic", "full"]),
};

BlogPost.defaultProps = {
	layout: "classic",
};
