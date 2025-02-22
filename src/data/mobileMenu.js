export default [
	{
		type: "link",
		label: "الرئيسية",
		url: "/",
	},
	{
		type: "link",
		label: "المنتجات",
		url: "/products",
	},
	{
		type: "link",
		label: "الخدمات",
		url: "/services",
	},

	{
		type: "link",
		label: "المقالات",
		url: "/blog",
	},

	{
		type: "link",
		label: "المزيد",
		url: "/contact-us",

		children: [{ type: "link", label: "تواصل معنا", url: "/contact-us" }],
	},
];
