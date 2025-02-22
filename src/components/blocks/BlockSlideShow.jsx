// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import departmentsAria from "../../services/departmentsArea";
// import languages from '../../i18n';
import StroykaSlick from "../shared/StroykaSlick";

const slickSettings = {
	dots: true,
	arrows: false,
	infinite: true,
	speed: 400,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2500,
};

class BlockSlideShow extends Component {
	departmentsAreaRef = null;

	media = window.matchMedia("(min-width: 992px)");

	componentDidMount() {
		if (this.media.addEventListener) {
			this.media.addEventListener("change", this.onChangeMedia);
		} else {
			// noinspection JSDeprecatedSymbols
			this.media.addEventListener(this.onChangeMedia);
		}
	}

	componentWillUnmount() {
		departmentsAria.area = null;

		if (this.media.removeEventListener) {
			this.media.removeEventListener("change", this.onChangeMedia);
		} else {
			this.media.removeEventListener("change", this.onChangeMedia);
		}
	}

	onChangeMedia = () => {
		if (this.media.matches) {
			departmentsAria.area = this.departmentsAreaRef;
		}
	};

	setDepartmentsAreaRef = (ref) => {
		this.departmentsAreaRef = ref;

		if (this.media.matches) {
			departmentsAria.area = this.departmentsAreaRef;
		}
	};

	render() {
		const { withDepartments, silders } = this.props;
		// const { direction } = languages[locale];

		const blockClasses = classNames("block-slideshow block", {
			"block-slideshow--layout--full": !withDepartments,
			"block-slideshow--layout--with-departments": withDepartments,
		});

		const layoutClasses = classNames("col-12", {
			"col-lg-12": !withDepartments,
			"col-lg-9": withDepartments,
		});

		const slides = silders?.map((slide, index) => {
			const image = withDepartments ? slide : slide;

			return (
				<div key={index} className='block-slideshow__slide'>
					<div
						className='block-slideshow__slide-image block-slideshow__slide-image--desktop .block-slideshow__slide-image--mobile'
						style={{
							backgroundImage: `url(${image})`,
						}}
					/>
					{/**
                 <div
                        className="block-slideshow__slide-image block-slideshow__slide-image--mobile"
                        style={{
                            backgroundImage: `url(${image})`,
                        }}
                    />
                 */}
				</div>
			);
		});

		return (
			<div className={blockClasses}>
				<div className='container'>
					<div className='row'>
						{withDepartments && (
							<div
								className='col-3 d-lg-block d-none'
								ref={this.setDepartmentsAreaRef}
							/>
						)}

						<div className={layoutClasses}>
							<div className='block-slideshow__body'>
								<StroykaSlick {...slickSettings}>{slides}</StroykaSlick>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

BlockSlideShow.propTypes = {
	withDepartments: PropTypes.bool,
	/** current locale */
	locale: PropTypes.string,
};

BlockSlideShow.defaultProps = {
	withDepartments: false,
};

const mapStateToProps = (state) => ({
	locale: state.locale,
});

export default connect(mapStateToProps)(BlockSlideShow);
