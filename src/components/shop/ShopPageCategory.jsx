// react
import React, { useEffect, useReducer } from "react";

// third-party
import PropTypes from "prop-types";
import queryString from "query-string";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";

// application
import BlockLoader from "../blocks/BlockLoader";
import CategorySidebar from "./CategorySidebar";
import CategorySidebarItem from "./CategorySidebarItem";
import PageHeader from "../shared/PageHeader";
import ProductsView from "./ProductsView";
import shopApi from "../../api/shop";
import WidgetFilters from "../widgets/WidgetFilters";
import WidgetProducts from "../widgets/WidgetProducts";
import { sidebarClose } from "../../store/sidebar";

import { url, getCategoryParents } from "../../services/utils";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function parseQueryOptions(location) {
	const query = queryString.parse(location);
	const optionValues = {};

	if (typeof query.page === "string") {
		optionValues.page = parseFloat(query.page);
	}
	if (typeof query.limit === "string") {
		optionValues.limit = parseFloat(query.limit);
	}
	if (typeof query.sort === "string") {
		optionValues.sort = query.sort;
	}

	return optionValues;
}

function parseQueryFilters(location) {
	const query = queryString.parse(location);
	const filterValues = {};

	Object.keys(query).forEach((param) => {
		const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

		if (!mr) {
			return;
		}

		const filterSlug = mr[1];

		filterValues[filterSlug] = query[param];
	});

	return filterValues;
}

function parseQuery(location) {
	return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
	const params = {};

	if (options.page !== 1) {
		params.page = options.page;
	}

	if (options.limit !== 12) {
		params.limit = options.limit;
	}

	if (options.sort !== "default") {
		params.sort = options.sort;
	}

	Object.keys(filters)
		.filter((x) => x !== "category" && !!filters[x])
		.forEach((filterSlug) => {
			params[`filter_${filterSlug}`] = filters[filterSlug];
		});

	return queryString.stringify(params, { encode: false });
}

const initialState = {
	init: false,
	/**
	 * Indicates that the category is loading.
	 */
	categoryIsLoading: true,
	/**
	 * Category object.
	 */
	category: null,
	/**
	 * Indicates that the products list is loading.
	 */
	productsListIsLoading: true,
	/**
	 * Products list.
	 */
	productsList: null,
	/**
	 * Products list options.
	 *
	 * options.page:  number - Current page.
	 * options.limit: number - Items per page.
	 * options.sort:  string - Sort algorithm.
	 */
	options: {},
	/**
	 * Products list filters.
	 *
	 * filters[FILTER_SLUG]: string - filter value.
	 */
	filters: {},
};

function reducer(state, action) {
	switch (action.type) {
		case "FETCH_CATEGORY_SUCCESS":
			return {
				...state,
				init: true,
				categoryIsLoading: false,
				category: action.category,
			};
		case "FETCH_PRODUCTS_LIST":
			return { ...state, productsListIsLoading: true };
		case "FETCH_PRODUCTS_LIST_SUCCESS":
			return {
				...state,
				productsListIsLoading: false,
				productsList: action.productsList,
			};
		case "SET_OPTION_VALUE":
			return {
				...state,
				options: { ...state.options, page: 1, [action.option]: action.value },
			};
		case "SET_FILTER_VALUE":
			return {
				...state,
				options: { ...state.options, page: 1 },
				filters: { ...state.filters, [action.filter]: action.value },
			};
		case "RESET_FILTERS":
			return { ...state, options: { ...state.options, page: 1 }, filters: {} };
		case "RESET":
			return state.init ? initialState : state;
		default:
			throw new Error();
	}
}

function init(state) {
	const [options, filters] = parseQuery(window.location.search);

	return { ...state, options, filters };
}

function ShopPageCategory(props) {
	const { productId } = useParams();

	console.log(productId);
	const { columns, viewMode, sidebarPosition } = props;
	const offcanvas = columns === 3 ? "mobile" : "always";
	const [state, dispatch] = useReducer(reducer, initialState, init);

	// Replace current url.
	useEffect(() => {
		const query = buildQuery(state.options, state.filters);
		const location = `${window.location.pathname}${query ? "?" : ""}${query}`;

		window.history.replaceState(null, "", location);
	}, [state.options, state.filters]);

	// Load category.
	useEffect(() => {
		let request;
		let canceled = false;

		dispatch({ type: "RESET", productId });

		if (productId) {
			request = shopApi.getCategoryBySlug(productId);
		} else {
			request = Promise.resolve(null);
		}

		request.then((category) => {
			if (canceled) {
				return;
			}

			dispatch({
				type: "FETCH_CATEGORY_SUCCESS",
				category: category?.data?.category,
			});
		});

		return () => {
			canceled = true;
		};
	}, [dispatch, productId]);

	// Load products.
	useEffect(() => {
		let canceled = false;

		dispatch({ type: "FETCH_PRODUCTS_LIST" });

		shopApi
			.getProductsList(state.options, {
				...state.filters,
				category: productId,
			})
			.then((productsList) => {
				if (canceled) {
					return;
				}

				dispatch({ type: "FETCH_PRODUCTS_LIST_SUCCESS", productsList });
			});

		return () => {
			canceled = true;
		};
	}, [dispatch, productId, state.options, state.filters]);

	if (
		state.categoryIsLoading ||
		(state.productsListIsLoading && !state.productsList)
	) {
		return <BlockLoader />;
	}

	const breadcrumb = [
		{ title: "الرئيسية", url: url.home() },
		{ title: "المنتجات", url: url.catalog() },
	];
	let pageTitle = "";
	let content;

	if (state.category) {
		getCategoryParents(state.category).forEach((parent) => {
			breadcrumb.push({ title: parent.name, url: url.category(parent) });
		});

		breadcrumb.push({
			title: state.category.name,
			url: url.category(state.category),
		});

		pageTitle = state.category.name;
	}

	const productsView = (
		<ProductsView
			isLoading={state.productsListIsLoading}
			productsList={state?.productsList?.data}
			options={state.options}
			filters={state.filters}
			dispatch={dispatch}
			layout={viewMode}
			grid={`grid-${columns}-${columns > 3 ? "full" : "sidebar"}`}
			offcanvas={offcanvas}
		/>
	);

	const sidebarComponent = (
		<CategorySidebar offcanvas={offcanvas}>
			<CategorySidebarItem>
				<WidgetFilters
					title='فرز حسب'
					offcanvas={offcanvas}
					filters={state?.productsList?.data}
					values={state.filters}
					dispatch={dispatch}
				/>
			</CategorySidebarItem>
			{offcanvas !== "always" && (
				<CategorySidebarItem className='d-none d-lg-block'>
					<WidgetProducts
						title='المنتجات المضافة مؤخراً'
						products={state?.productsList?.data?.lastProducts}
					/>
				</CategorySidebarItem>
			)}
		</CategorySidebar>
	);

	if (columns > 3) {
		content = (
			<div className='container'>
				<div className='block'>{productsView}</div>
				{sidebarComponent}
			</div>
		);
	} else {
		const sidebar = (
			<div className='shop-layout__sidebar'>{sidebarComponent}</div>
		);

		content = (
			<div className='container'>
				<div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
					{sidebarPosition === "start" && sidebar}
					<div className='shop-layout__content'>
						<div className='block'>{productsView}</div>
					</div>
					{sidebarPosition === "end" && sidebar}
				</div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<Helmet>
				{pageTitle !== "" ? (
					<title>{`المنتجات - ${pageTitle}`}</title>
				) : (
					<title>{`المنتجات`}</title>
				)}
			</Helmet>

			<PageHeader header={pageTitle} breadcrumb={breadcrumb} />

			{content}
		</React.Fragment>
	);
}

ShopPageCategory.propTypes = {
	/**
	 * Category slug.
	 */
	categoryId: PropTypes.number,
	/**
	 * number of product columns (default: 3)
	 */
	columns: PropTypes.number,
	/**
	 * mode of viewing the list of products (default: 'grid')
	 * one of ['grid', 'grid-with-features', 'list']
	 */
	viewMode: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
	/**
	 * sidebar position (default: 'start')
	 * one of ['start', 'end']
	 * for LTR scripts "start" is "left" and "end" is "right"
	 */
	sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ShopPageCategory.defaultProps = {
	columns: 3,
	viewMode: "grid",
	sidebarPosition: "start",
};

const mapStateToProps = (state) => ({
	sidebarState: state.sidebar,
	page: state.category,
});

const mapDispatchToProps = () => ({
	sidebarClose,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);
