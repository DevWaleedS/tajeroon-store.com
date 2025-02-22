export default [
	{
		title: "الرئيسية",
		url: `/`,
	},

	{
		title: "المنتجات",
		url: `/products`,
	},

	{
		title: "الخدمات",
		url: `/services`,
	},
	{
		title: "المقالات",
		url: `/blog`,
	},
	{
		title: "تواصل معنا",
		url: `/contact-us`,
	},

	{
		title: "المزيد",
		url: `/`,
		submenu: {
			type: "menu",
			menu: [{ title: "تواصل معنا", url: `/contact-us` }],
		},
	},
];
