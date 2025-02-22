const domain = window?.location?.pathname?.split("/")[1];
export const url = {
	home: () => `/${domain}`,

	catalog: () => `/products`,

	category: (category) => `/catalog/${category.slug}`,

	product: (product) => `/${product?.name}`,
};

export function getCategoryParents(category) {
	return category.parent
		? [...getCategoryParents(category.parent), category.parent]
		: [];
}
