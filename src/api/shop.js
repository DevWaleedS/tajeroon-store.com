/* eslint-disable arrow-body-style */
// eslint-disable-next-line no-unused-vars
import qs from "query-string";

const shopApi = {
	/**
	 * Returns array of categories.
	 *
	 * @param {object?} options
	 * @param {number?} options.depth
	 *
	 * @return {Promise<Array<object>>}
	 */

	/**
	 * Returns category by slug.
	 *
	 * @param {string} slug
	 * @param {object?} options
	 * @param {number?} options.depth
	 *
	 * @return {Promise<object>}
	 */
	getCategoryBySlug: async (slug, options = {}) => {
		/**
		 * This is what your API endpoint might look like:
		 *
		 * https://example.com/api/categories/power-tools.json?depth=2
		 *
		 * where:
		 * - power-tools = slug
		 * - 2           = options.depth
		 */
		const response = await fetch(
			`https://backend.atlbha.sa/api/category/${slug}`
		);
		return await response.json();

		// This is for demonstration purposes only. Remove it and use the code above.
		//return getCategoryBySlug(slug, options);
	},
	/**
	 * Returns product.
	 *
	 * @param {string} slug
	 *
	 * @return {Promise<object>}
	 */
	getProductBySlug: async (slug) => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;

		const response = await fetch(
			`https://backend.atlbha.sa/api/productPage/${domain}/${slug}`
		);
		return await response.json();

		// This is for demonstration purposes only. Remove it and use the code above.
		// return getProductBySlug(slug);
	},
	/**
	 * Returns array of related products.
	 *
	 * @param {string}  slug
	 * @param {object?} options
	 * @param {number?} options.limit
	 *
	 * @return {Promise<Array<object>>}
	 */

	/**
	 * Return products list.
	 *
	 * @param {object?} options
	 * @param {number?} options.page
	 * @param {number?} options.limit
	 * @param {string?} options.sort
	 * @param {Object.<string, string>?} filters
	 *
	 * @return {Promise<object>}
	 */
	getProductsList: async (options = {}, filters = {}, is_service) => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;
		const price_from = filters?.price?.slice(0, filters?.price?.indexOf("-"));
		const price_to = filters?.price?.slice(
			Number(filters?.price?.indexOf("-")) + 1,
			filters?.price?.length
		);
		/**
		 * This is what your API endpoint might look like:
		 *
		 * https://example.com/api/products.json?page=2&limit=12&sort=name_desc&filter_category=screwdriwers&filter_price=500-1000
		 *
		 * where:
		 * - page            = options.page
		 * - limit           = options.limit
		 * - sort            = options.sort
		 * - filter_category = filters.category
		 * - filter_price    = filters.price
		 */
		// const params = { ...options };
		//
		// Object.keys(filters).forEach((slug) => {
		//     params[`filter_${slug}`] = filters[slug];
		// });
		//
		const response = await fetch(
			`https://backend.atlbha.sa/api/storeProductCategory?domain=${domain}${
				is_service ? "&is_service=1" : ""
			}${options?.limit ? `&limit=${options?.limit}` : ""}${
				options?.sort ? `&sort=${options?.sort}` : ""
			}${options?.page ? `&page=${options?.page}` : ""}${
				filters?.category ? `&filter_category=${filters?.category}` : ""
			}${price_from ? `&price_from=${Number(price_from)}` : ""}${
				price_to ? `&price_to=${Number(price_to)}` : ""
			}`
		);
		return await response.json();

		// This is for demonstration purposes only. Remove it and use the code above.
		//return getProductsList(options, filters);
	},
	/**
	 * Returns array of featured products.
	 *
	 * @param {object?} options
	 * @param {number?} options.limit
	 * @param {string?} options.category
	 *
	 * @return {Promise<Array<object>>}
	 */

	/**
	 * Returns array of latest products.
	 *
	 * @param {object?} options
	 * @param {number?} options.limit
	 * @param {string?} options.category
	 *
	 * @return {Promise<Array<object>>}
	 */

	/**
	 * Returns an array of top rated products.
	 *
	 * @param {object?} options
	 * @param {number?} options.limit
	 * @param {string?} options.category
	 *
	 * @return {Promise<Array<object>>}
	 */

	/**
	 * Returns an array of discounted products.
	 *
	 * @param {object?} options
	 * @param {number?} options.limit
	 * @param {string?} options.category
	 *
	 * @return {Promise<Array<object>>}
	 */

	/**
	 * Returns an array of most popular products.
	 *
	 * @param {object?} options
	 * @param {number?} options.limit
	 * @param {string?} options.category
	 *
	 * @return {Promise<Array<object>>}
	 */

	/**
	 * Returns search suggestions.
	 *
	 * @param {string}  query
	 * @param {object?} options
	 * @param {number?} options.limit
	 * @param {string?} options.category
	 *
	 * @return {Promise<Array<object>>}
	 */
	getSuggestions: async (query, options = {}) => {
		const domain = process.env.REACT_APP_STORE_DOMAIN;
		/**
		 * This is what your API endpoint might look like:
		 *
		 * https://example.com/api/search/suggestions.json?query=screwdriver&limit=5&category=power-tools
		 *
		 * where:
		 * - query    = query
		 * - limit    = options.limit
		 * - category = options.category
		 */
		const response = await fetch(
			`https://backend.atlbha.sa/api/productSearch?domain=${domain}&query=${query}${
				options?.category ? `&category=${options?.category}` : ""
			}`
		);
		return await response.json();

		// This is for demonstration purposes only. Remove it and use the code above.
		//return getSuggestions(query, options);
	},
};

export default shopApi;
