// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import Indicator from "../header/Indicator";
import { Menu18x14Svg, Search20Svg, Heart20Svg, Cart20Svg } from "../../svg";
import { mobileMenuOpen } from "../../store/mobile-menu";
import Search from "../header/Search";
import IndicatorAccount from "../header/IndicatorAccount";

class MobileHeader extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchOpen: false,
		};
		this.searchInput = React.createRef();
	}

	componentDidUpdate(prevProps, prevState) {
		const { searchOpen } = this.state;

		if (
			searchOpen &&
			searchOpen !== prevState.searchOpen &&
			this.searchInput.current
		) {
			this.searchInput.current.focus();
		}
	}

	handleOpenSearch = () => {
		this.setState(() => ({ searchOpen: true }));
	};

	handleCloseSearch = () => {
		this.setState(() => ({ searchOpen: false }));
	};

	render() {
		const { openMobileMenu, wishlist, cart, fetchedData } = this.props;
		const { searchOpen } = this.state;

		const searchClasses = classNames("mobile-header__search", {
			"mobile-header__search--open": searchOpen,
		});

		return (
			<div className='mobile-header'>
				<div className='mobile-header__panel'>
					<div className='container'>
						<div className='mobile-header__body'>
							<button
								type='button'
								className='mobile-header__menu-button'
								onClick={openMobileMenu}>
								<Menu18x14Svg />
							</button>
							<Link to={`/`} className='mobile-header__logo'>
								<img
									src={
										fetchedData?.logo || "https://placehold.co/40x40?text=Logo"
									}
									alt='logo'
								/>
							</Link>
							<Search
								context='mobile-header'
								className={searchClasses}
								inputRef={this.searchInput}
								onClose={this.handleCloseSearch}
							/>
							<div className='mobile-header__indicators'>
								<Indicator
									className='indicator--mobile indicator--mobile-search d-md-none'
									onClick={this.handleOpenSearch}
									icon={<Search20Svg />}
								/>
								<Indicator
									className='indicator--mobile d-sm-flex d-none'
									url={`wishlist`}
									value={wishlist?.length}
									icon={<Heart20Svg />}
								/>
								<Indicator
									className='indicator--mobile'
									url={`/cart`}
									value={cart?.qty}
									icon={<Cart20Svg />}
								/>

								<IndicatorAccount />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	cart: state.cart,
	wishlist: state.wishlist,
});

const mapDispatchToProps = {
	openMobileMenu: mobileMenuOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader);
