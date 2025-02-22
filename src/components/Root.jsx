// react
import React, { Component } from "react";

// third-party
import PropTypes from "prop-types";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { ScrollContext } from "react-router-scroll-4";

// application
import languages from "../i18n";
import { localeChange } from "../store/locale";

// pages
import Layout from "./Layout";
import MadaPayment from "./PaymentMethod/MadaPayment/MadaPayment";
import ApplePay from "./PaymentMethod/ApplePay/ApplePay";

class Root extends Component {
	shouldUpdateScroll = (prevRouterProps, { location }) =>
		prevRouterProps && location?.pathname !== prevRouterProps.location.pathname;

	render() {
		const { locale } = this.props;
		const { messages } = languages[locale];

		return (
			<IntlProvider locale='ar' messages={messages}>
				<BrowserRouter basename={process.env.PUBLIC_URL}>
					<HelmetProvider>
						<Helmet htmlAttributes={{ lang: "ar", dir: "rtl" }} />
						<ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
							<Switch>
								<Route exact path='/madaPayment' component={MadaPayment} />
								<Route exact path='/applePay' component={ApplePay} />
								<Route
									path='/'
									render={(props) => (
										<Layout {...props} headerLayout='default' />
									)}
								/>
								<Redirect to='/' />
							</Switch>
						</ScrollContext>
					</HelmetProvider>
				</BrowserRouter>
			</IntlProvider>
		);
	}
}

Root.propTypes = {
	/** current locale */
	locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
	locale: state.locale,
});

const mapDispatchToProps = {
	localeChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
