// react
import React from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";

// application
import MobileLinks from "./MobileLinks";
import { Cross20Svg } from "../../svg";

import { localeChange } from "../../store/locale";
import { mobileMenuClose } from "../../store/mobile-menu";

function MobileMenu(props) {
	const {
		mobileMenuState,
		closeMobileMenu,
		fetchedData,

		servicesData,
		productsData,
	} = props;

	const morePgae = fetchedData?.pages?.filter((page) =>
		page?.pageCategory?.some((category) => category?.name === "المزيد")
	);

	const links = [
		{
			type: "main-link",
			label: "الرئيسية",
			url: `/`,
		},

		{
			type: fetchedData?.categories?.length !== 0 && "menu",
			label: fetchedData?.categories?.length !== 0 && "التصنيفات",
			url: "",
			children: fetchedData?.categories?.map((item) => ({
				type: "main-link",
				label: item?.name,
				classBg: true,
				url: `/${
					item?.is_service
						? "services/services_filter"
						: "products/products_filter"
				}/${item?.id}/${encodeURIComponent(
					item?.name.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-").toLowerCase()
				)}`,
				children: item?.subcategory?.map((sub) => ({
					type: "main-link",
					label: sub?.name,
					classBg: true,
					url: `/${
						item?.is_service
							? "services/services_filter"
							: "products/products_filter"
					}/${sub?.id}/${encodeURIComponent(
						sub?.name.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-").toLowerCase()
					)}`,
				})),
			})),
		},
		// Add Products link conditionally

		...(productsData?.length > 0
			? [
					{
						type: "main-link",
						label: "المنتجات",
						url: `/products`,
					},
			  ]
			: []),

		// Add services link conditionally
		...(servicesData?.length > 0
			? [
					{
						type: "main-link",
						label: "الخدمات",
						url: `/services`,
					},
			  ]
			: []),

		{
			type: "main-link",
			label: "المقالات",
			url: `/blog`,
		},
		{
			type: "main-link",
			label: "تواصل معنا",
			url: `/contact-us`,
		},

		{
			type: morePgae?.length !== 0 && "menu",
			label: morePgae?.length !== 0 && "المزيد",
			url: "",
			children: morePgae?.map((item) => ({
				type: "main-link",
				label: item?.title,
				url: `/terms/${encodeURIComponent(
					item?.title.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, "-").toLowerCase()
				)}/${item?.id}`,
			})),
		},
		{
			type: "menu",
			label: "التسوق",
			url: "",
			children: [
				{
					type: "main-link",
					label: "المقارنات",
					url: `/compare`,
				},
				{
					type: "main-link",
					label: "المفضله",
					url: `/wishlist`,
				},
			],
		},

		{
			type: "menu",
			label: "حسابي",
			url: "",
			children: [
				{
					type: "main-link",
					label: "لوحة التحكم",
					url: `/account/dashboard`,
				},
			],
		},
	];

	const classes = classNames("mobilemenu", {
		"mobilemenu--open": mobileMenuState.open,
	});

	return (
		<div className={classes}>
			{/* eslint-disable-next-line max-len */}
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
			<div className='mobilemenu__backdrop' onClick={closeMobileMenu} />
			<div className='mobilemenu__body'>
				<div className='mobilemenu__header'>
					<div className='mobilemenu__title'>القائمة</div>
					<button
						type='button'
						className='mobilemenu__close'
						onClick={closeMobileMenu}>
						<Cross20Svg />
					</button>
				</div>
				<div className='mobilemenu__content'>
					<MobileLinks links={links} closeMobileMenu={closeMobileMenu} />
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = (state) => ({
	mobileMenuState: state.mobileMenu,
});

const mapDispatchToProps = {
	closeMobileMenu: mobileMenuClose,
	changeLocale: localeChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);
