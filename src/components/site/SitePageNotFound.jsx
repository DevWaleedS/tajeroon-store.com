// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function SitePageNotFound() {
	return (
		<div className='block'>
			<Helmet>
				<title>{`404 Page Not Found — ${localStorage.getItem(
					"store-name"
				)}`}</title>
			</Helmet>

			<div className='container'>
				<div className='not-found'>
					<div className='not-found__404'>خطأ 404</div>

					<div className='not-found__content'>
						<h1 className='not-found__title'>الصفحة غير موجودة</h1>

						<p className='not-found__text'>
							لايمكننا العثور على الصفحة التي تبحث عنها
							<br />
							يمكنك محاولة البحث عنها بالاسفل
						</p>

						<form className='not-found__search'>
							<input
								type='text'
								className='not-found__search-input form-control'
								placeholder='ابحث هنا ...'
							/>
							<button
								type='submit'
								className='not-found__search-button btn btn-primary'>
								بحث
							</button>
						</form>

						<p className='not-found__text'>
							او يمكنك الذهاب الى الصفحة الرئيسية
						</p>

						<Link to={`/`} className='btn btn-secondary btn-sm'>
							الصفحة الرئيسية
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SitePageNotFound;
