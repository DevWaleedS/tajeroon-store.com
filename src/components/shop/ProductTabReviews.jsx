// react
import React, { useState } from "react";
import { connect } from "react-redux";
// application
import Pagination from "../shared/Pagination";
import Rating from "../shared/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import { loginModalOpen } from "../../store/login-modal";

// data stubs

function ProductTabReviews(props) {
	const store_domain = process.env.REACT_APP_STORE_DOMAIN;
	const { openLoginModal } = props;
	const token = localStorage.getItem("token");
	const [rateing, setRateing] = useState(5);
	const [commentText, setCommentText] = useState("");
	const [commentTextError, setCommentTextError] = useState("");
	const [btnLoading, setBtnLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(10);
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentComments = props?.data?.commentOfProducts?.slice(
		indexOfFirstPost,
		indexOfLastPost
	);
	const handleAddComment = () => {
		setCommentTextError("");
		const commentData = {
			comment_text: commentText,
			rateing: rateing,
		};
		setBtnLoading(true);
		axios
			.post(
				`https://backend.atlbha.sa/api/addComment/${props?.data?.product?.id}?domain=${store_domain}`,
				commentData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
						store_domain: store_domain,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					toast.success(res?.data?.message?.ar, { theme: "colored" });
					setCommentText("");
					setRateing(3);
					setBtnLoading(false);
				} else {
					toast.error(res?.data?.message?.ar, { theme: "colored" });
					setCommentTextError(res?.data?.message?.en?.comment_text);
					setBtnLoading(false);
				}
			})
			.catch((e) => {
				if (
					e?.response?.status === 401 &&
					e.response?.data?.message === "Unauthenticated."
				) {
					openLoginModal();
				} else {
					console.log(e);
				}
				setBtnLoading(false);
			});
	};
	const reviewsList = currentComments?.map((comment, index) => (
		<li key={index} className='reviews-list__item'>
			<div className='review'>
				<div className='review__avatar'>
					<img src={comment?.user?.image} alt={comment?.user?.name} />
				</div>
				<div className=' review__content'>
					<div className=' review__author'>{comment?.user?.name}</div>
					<div className=' review__rating'>
						<Rating value={Number(comment?.rateing)} />
					</div>
					<div className=' review__text'>{comment?.comment_text}</div>
					<div className=' review__date'>{comment?.created_at}</div>
				</div>
			</div>
		</li>
	));

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const previousPage = () => {
		if (currentPage !== 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const nextPage = () => {
		if (
			currentPage !==
			Math.ceil(props?.data?.commentOfProducts?.length / postsPerPage)
		) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<div className='reviews-view'>
			<div className='reviews-view__list'>
				<h3 className='reviews-view__header'>تقييمات العملاء</h3>
				{props?.data?.commentOfProducts?.length > 0 ? (
					<div className='reviews-list'>
						<ol className='reviews-list__content'>{reviewsList}</ol>
						<div className='reviews-list__pagination'>
							<Pagination
								postsPerPage={postsPerPage}
								totalPosts={props?.data?.commentOfProducts?.length}
								paginate={paginate}
								previousPage={previousPage}
								nextPage={nextPage}
								currentPage={currentPage}
							/>
						</div>
					</div>
				) : (
					<p>لاتوجد تعليقات حتى الان</p>
				)}
			</div>

			<form className='reviews-view__form'>
				<h3 className='reviews-view__header'>أضف تقييمك</h3>
				<div className='row'>
					<div className='col-12 col-lg-9 col-xl-8'>
						<div className='form-row'>
							<div className='form-group col-md-4'>
								<label htmlFor='review-stars'>أختر عدد النجوم</label>
								<select
									value={rateing}
									onChange={(e) => setRateing(e.target.value)}
									id='review-stars'
									className='form-control'>
									<option value={5}>تقييم 5 نجوم</option>
									<option value={4}>تقييم 4 نجوم</option>
									<option value={3}>تقييم 3 نجوم</option>
									<option value={2}>تقييم 2 نجوم</option>
									<option value={1}>تقييم 1 نجوم</option>
								</select>
							</div>
							{/*<div className="form-group col-md-4">
                                <label htmlFor="review-author">اسمك</label>
                                <input value={comment?.username} onChange={(e) => setComment({ ...comment, username: e.target.value })} type="text" className="form-control" id="review-author" placeholder="اسم المستخدم" />
                            </div>*/}
							{/*<div className="form-group col-md-4">
                                <label htmlFor="review-email">البريد الاكتروني</label>
                                <input value={comment?.email} onChange={(e) => setComment({ ...comment, email: e.target.value })} type="text" className="form-control" id="review-email" placeholder="البريد الالكتروني" />
                        </div>*/}
						</div>
						<div className='form-group'>
							<label htmlFor='review-text'>أكتب تقييمك</label>
							<textarea
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								className='form-control'
								id='review-text'
								rows='6'
							/>
							{commentTextError && (
								<span style={{ color: "#ff4242", fontSize: "14px" }}>
									{commentTextError}
								</span>
							)}
						</div>
						<div className='form-group mb-0'>
							<button
								disabled={btnLoading}
								type='button'
								onClick={handleAddComment}
								className='btn btn-primary btn-lg'>
								أنشر تقييمك
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
	openLoginModal: loginModalOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductTabReviews);
