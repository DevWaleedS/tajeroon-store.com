// react
import React, { useCallback, useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import ProductPagination from "../shared/ProductPagination";

import {
	Filters16Svg,
	LayoutGrid16x16Svg,
	LayoutList16x16Svg,
} from "../../svg";
import { sidebarOpen } from "../../store/sidebar";
import ProductCard from "../shared/ProductCard";

function useSetOption(option, filter, dispatch) {
	const callback = useCallback(filter, []);

	return useCallback(
		(data) => {
			dispatch({
				type: "SET_OPTION_VALUE",
				option,
				value: callback(data),
			});
		},
		[option, callback, dispatch]
	);
}

function ProductsView(props) {
	const {
		isLoading,
		productsList,
		options,
		filters,
		dispatch,
		layout: propsLayout,
		grid,
		offcanvas,
		sidebarOpen,
	} = props;
	const [layout, setLayout] = useState(propsLayout);
	const handlePageChange = useSetOption("page", parseFloat, dispatch);
	const handleSortChange = useSetOption(
		"sort",
		(event) => event.target.value,
		dispatch
	);
	const handleLimitChange = useSetOption(
		"limit",
		(event) => parseFloat(event.target.value),
		dispatch
	);

	const handleResetFilters = useCallback(() => {
		dispatch({ type: "RESET_FILTERS" });
	}, [dispatch]);

	const filtersCount = Object.keys(filters)
		.map((x) => filters[x])
		.filter((x) => x).length;
	let viewModes = [
		{ key: "grid", title: "Grid", icon: <LayoutGrid16x16Svg /> },
		{ key: "list", title: "List", icon: <LayoutList16x16Svg /> },
	];

	//
	viewModes = viewModes.map((viewMode) => {
		const className = classNames("layout-switcher__button", {
			"layout-switcher__button--active": layout === viewMode.key,
		});

		return (
			<button
				key={viewMode.key}
				title={viewMode.title}
				type='button'
				className={className}
				onClick={() => setLayout(viewMode.key)}>
				{viewMode.icon}
			</button>
		);
	});

	const productsListItems = productsList?.Products?.map((product) => (
		<div key={product?.id} className='products-list__item'>
			<ProductCard product={product} />
		</div>
	));

	const rootClasses = classNames("products-view", {
		"products-view--loading": isLoading,
	});

	const viewOptionsClasses = classNames("view-options", {
		"view-options--offcanvas--always": offcanvas === "always",
		"view-options--offcanvas--mobile": offcanvas === "mobile",
	});

	let content;

	if (productsListItems?.length > 0) {
		content = (
			<div className='products-view__content'>
				<div className='products-view__options'>
					<div className={viewOptionsClasses}>
						<div className='view-options__filters-button'>
							<button
								type='button'
								className='filters-button'
								onClick={() => sidebarOpen()}>
								<Filters16Svg className='filters-button__icon' />
								<span className='filters-button__title'>فرز حسب</span>
								{!!filtersCount && (
									<span className='filters-button__counter'>
										{filtersCount}
									</span>
								)}
							</button>
						</div>
						<div className='view-options__layout'>
							<div className='layout-switcher'>
								<div className='layout-switcher__list'>{viewModes}</div>
							</div>
						</div>
						<div className='view-options__legend'>
							{`عرض ${productsList?.from}—${productsList?.to} من ${productsList?.total} عنصر`}
						</div>
						<div className='view-options__divider' />
						<div className='view-options__control'>
							<label htmlFor='view-options-sort'>ترتيب حسب</label>
							<div>
								<select
									id='view-options-sort'
									className='form-control form-control-sm'
									value={options.sort || productsList.sort}
									onChange={handleSortChange}>
									<option value=''>الافتراضي</option>
									<option value='asc'>الاسم (أ-ي)</option>
									<option value='desc'>الاسم (ي-أ)</option>
								</select>
							</div>
						</div>
						<div className='view-options__control'>
							<label htmlFor='view-options-limit'>عرض</label>
							<div>
								<select
									id='view-options-limit'
									className='form-control form-control-sm'
									value={options.limit || productsList.limit}
									onChange={handleLimitChange}>
									<option value='6'>6</option>
									<option value='12'>12</option>
									<option value='18'>18</option>
									<option value='24'>24</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div
					className='products-view__list products-list'
					data-layout={layout !== "list" ? grid : layout}
					data-with-features={
						layout === "grid-with-features" ? "true" : "false"
					}>
					<div className='products-list__body'>{productsListItems}</div>
				</div>

				<div className='products-view__pagination'>
					<ProductPagination
						current={options.page || productsList.page}
						siblings={2}
						total={productsList.pages}
						onPageChange={handlePageChange}
					/>
				</div>
			</div>
		);
	} else {
		content = (
			<div className='products-view__empty'>
				<div className='products-view__empty-title'>لاتوجد عناصر مطابقة</div>
				<div className='products-view__empty-subtitle'>
					حاول اعادة اختيار عناصر الفرز
				</div>
				<button
					type='button'
					className='btn btn-primary btn-sm'
					onClick={handleResetFilters}>
					احذف الفرز
				</button>
			</div>
		);
	}

	return (
		<div className={rootClasses}>
			<div className='products-view__loader' />
			{content}
		</div>
	);
}

ProductsView.propTypes = {
	/**
	 * Indicates that products is loading.
	 */
	isLoading: PropTypes.bool,
	/**
	 * ProductsList object.
	 */
	productsList: PropTypes.object,
	/**
	 * Products list options.
	 */
	options: PropTypes.object,
	/**
	 * Products list filters.
	 */
	filters: PropTypes.object,
	/**
	 * Category page dispatcher.
	 */
	dispatch: PropTypes.func,
	/**
	 * products list layout (default: 'grid')
	 * one of ['grid', 'grid-with-features', 'list']
	 */
	layout: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
	/**
	 * products list layout (default: 'grid')
	 * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
	 */
	grid: PropTypes.oneOf(["grid-3-sidebar", "grid-4-full", "grid-5-full"]),
	/**
	 * indicates when sidebar should be off canvas
	 */
	offcanvas: PropTypes.oneOf(["always", "mobile"]),
};

ProductsView.defaultProps = {
	layout: "grid",
	grid: "grid-3-sidebar",
	offcanvas: "mobile",
};

const mapDispatchToProps = {
	sidebarOpen,
};

export default connect(() => ({}), mapDispatchToProps)(ProductsView);
