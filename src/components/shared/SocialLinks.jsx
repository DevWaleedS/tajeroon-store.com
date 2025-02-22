// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

import { JacoIcon } from "../../svg/index.js";

function SocialLinks(props) {
    const { shape, className, fetchedData } = props;

    const classes = classNames(className, "social-links", {
        "social-links--shape--circle": shape === "circle",
        "social-links--shape--rounded": shape === "rounded",
    });

    const items = [
        { type: "facebook", url: fetchedData?.facebook, icon: "fab fa-facebook-f" },
        { type: "twitter", url: fetchedData?.twiter, icon: "fa-brands fa-x-twitter" },
        { type: "youtube", url: fetchedData?.youtube, icon: "fab fa-youtube" },
        { type: "instagram", url: fetchedData?.instegram, icon: "fab fa-instagram" },
        { type: "snapchat", url: fetchedData?.snapchat, icon: "fab fa-snapchat" },
        { type: "tiktok", url: fetchedData?.tiktok, icon: "fab fa-tiktok" },
        { type: "jaco", url: fetchedData?.jaco, icon: <JacoIcon /> },
    ].map(
        (item) =>
            item?.url && (
                <li key={item.type} className="social-links__item">
                    <a
                        className={`social-links__link social-links__link--type--${item.type}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {item?.type === "jaco" ? <>{item.icon}</> : <i className={item.icon} />}
                    </a>
                </li>
            )
    );

    return (
        <div className={classes}>
            <ul className="social-links__list">{items}</ul>
        </div>
    );
}

SocialLinks.propTypes = {
    /**
     * rating value
     */
    shape: PropTypes.oneOf(["circle", "rounded"]),
    className: PropTypes.string,
};
SocialLinks.defaultProps = {
    shape: null,
};

export default SocialLinks;
