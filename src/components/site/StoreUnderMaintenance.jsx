// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

function StoreUnderMaintenance({ title, message }) {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Helmet>
                <title>{`المتجر تحت الصيانة — ${localStorage.getItem("store-name")}`}</title>
            </Helmet>

            <div className="container">
                <div className="not-found">
                    <div className="not-found__content">
                        <h1 className="not-found__title" style={{ fontSize: "40px" }}>
                            {title}
                        </h1>

                        <p className="not-found__text" style={{ fontSize: "20px" }}>
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreUnderMaintenance;
