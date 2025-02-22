// react
import React, { useState } from "react";

// third-party
import classNames from "classnames";
import {
	matchPath,
	Redirect,
	Switch,
	Route,
	useHistory,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";

// application
import PageHeader from "../shared/PageHeader";

// pages
import AccountPageAddresses from "./AccountPageAddresses";
import AccountPageDashboard from "./AccountPageDashboard";
import AccountPageAddAddress from "./AccountPageAddAddress";
import AccountPageEditAddress from "./AccountPageEditAddress";
import AccountPageOrderDetails from "./AccountPageOrderDetails";
import AccountPageOrders from "./AccountPageOrders";
import AccountPageReturnsOrders from "./AccountPageReturnsOrders";
import InactiveAccountPage from "./InactiveAccountPage";
// import AccountPagePassword from './AccountPagePassword';
import AccountPageProfile from "./AccountPageProfile";
import useFetch from "../../hooks/useFetch";

export default function AccountLayout(props) {
	const history = useHistory();
	const [pageTitle, setPageTitle] = useState("لوحة التحكم");
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.sa/api/profileCustomer"
	);
	localStorage.setItem(
		"name",
		`${fetchedData?.data?.users?.name} ${fetchedData?.data?.users?.lastname}`
	);
	localStorage.setItem("email", fetchedData?.data?.users?.email);
	localStorage.setItem("image", fetchedData?.data?.users?.image);
	const { match, location } = props;

	const breadcrumb = [
		{ title: "الرئيسية", url: `/` },
		{ title: pageTitle, url: "" },
	];

	const links = [
		{ title: "لوحة التحكم", url: `dashboard` },
		{ title: "تعديل الملف الشخصي", url: `profile` },
		{ title: "المقارنات", url: `shop/compare` },
		{ title: " طلباتي", url: `orders` },
		{ title: " مرتجعاتي", url: `returnOrders` },
		{ title: "العناوين", url: `addresses` },
		{ title: "تعطيل الحساب", url: `inactive-account` },
	].map((link) => {
		const url = `${match.url}/${link.url}`;
		const isActive = matchPath(location.pathname, { path: url, exact: true });
		const classes = classNames("account-nav__item", {
			"account-nav__item--active ": isActive,
		});

		return (
			<li key={link.url} className={classes}>
				<button
					onClick={() => {
						setPageTitle(link.title);
						history.push(link?.title === "المقارنات" ? `compare` : url);
					}}>
					{link.title}
				</button>
			</li>
		);
	});

	return (
		<React.Fragment>
			<PageHeader header={pageTitle} breadcrumb={breadcrumb} />
			<Helmet>
				<title>{`الرئيسية — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>
			<div className='block'>
				<div className='container'>
					<div className='row'>
						<div className='col-12 col-lg-3 d-flex'>
							<div className='account-nav flex-grow-1'>
								<h4 className='account-nav__title'>معلوماتي</h4>
								<ul>{links}</ul>
							</div>
						</div>
						<div className='col-12 col-lg-9 mt-4 mt-lg-0'>
							<Switch>
								<Redirect
									exact
									from={match.path}
									to={`${match.path}/dashboard`}
								/>
								<Route
									exact
									path={`${match.path}/dashboard`}
									render={() => (
										<AccountPageDashboard
											fetchedData={fetchedData}
											loading={loading}
										/>
									)}
								/>
								<Route
									exact
									path={`${match.path}/profile`}
									render={() => (
										<AccountPageProfile
											fetchedData={fetchedData}
											loading={loading}
											reload={reload}
											setReload={setReload}
										/>
									)}
								/>

								<Route
									exact
									path={`${match.path}/orders`}
									component={AccountPageOrders}
								/>
								<Route
									exact
									path={`${match.path}/returnOrders`}
									component={AccountPageReturnsOrders}
								/>
								<Route
									exact
									path={`${match.path}/inactive-account`}
									render={() => (
										<InactiveAccountPage
											user={fetchedData?.data?.users}
											loading={loading}
											reload={reload}
											setReload={setReload}
										/>
									)}
								/>
								<Route
									exact
									path={`${match.path}/orders/:orderId`}
									component={AccountPageOrderDetails}
								/>
								<Route
									exact
									path={`${match.path}/addresses`}
									component={AccountPageAddresses}
								/>
								<Route
									exact
									path={`${match.path}/addresses/add-address`}
									component={AccountPageAddAddress}
								/>
								<Route
									exact
									path={`${match.path}/addresses/:id`}
									component={AccountPageEditAddress}
								/>
							</Switch>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
