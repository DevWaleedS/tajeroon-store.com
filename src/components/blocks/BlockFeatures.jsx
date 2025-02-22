import React from "react";
import PropTypes from "prop-types";
import { Fi24Hours48Svg, FiFreeDelivery48Svg, FiPaymentSecurity48Svg, FiTag48Svg } from "../../svg";

export default function BlockFeatures(props) {
    const { layout } = props;

    return (
        <div className={`block block-features block-features--layout--${layout}`}>
            <div className="container">
                <div className="block-features__list">
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <FiFreeDelivery48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">خدمة التوصيل</div>
                        </div>
                    </div>
                    <div className="block-features__divider" />
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <Fi24Hours48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">التواصل معنا 24/7</div>
                        </div>
                    </div>
                    <div className="block-features__divider" />
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <FiPaymentSecurity48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">ضمان الجودة</div>
                        </div>
                    </div>
                    <div className="block-features__divider" />
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <FiTag48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">عروض خاصة</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

BlockFeatures.propTypes = {
    layout: PropTypes.oneOf(["classic", "boxed"]),
};

BlockFeatures.defaultProps = {
    layout: "classic",
};
