// react
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import BlockLoader from "../blocks/BlockLoader";
import { translateCityNameFunc } from "../../Utilities/UtilitiesFunctions";

export default function SelectAddress({
    fetchedData,
    loading,
    cities,
    citiesLoading,
    setSelectedAddressId,
    selectedAddressId,
    setAddAddress,
    addressError,
    setDefaultAddressDisabled,
    setAddAddressClicked,
    shippingSelect,
}) {
    const scrollRef = useRef(null);

    const [addressSlidesLength, setAddressSlidesLength] = useState(0);

    const scrollToDiv = (direction) => {
        const scrollContainer = scrollRef.current;

        if (scrollContainer) {
            if (direction === "left") {
                scrollContainer.scrollLeft -= scrollContainer.offsetWidth / addressSlidesLength;
            } else if (direction === "right") {
                scrollContainer.scrollLeft += scrollContainer.offsetWidth / addressSlidesLength;
            }
        }
    };

    function translateProvinceName(name) {
        const unique = cities?.filter((obj) => obj?.region?.name_en === name);
        return unique?.[0]?.region?.name || name;
    }

    const getDefaultAddress = () =>
        fetchedData?.data?.orderAddress?.filter((address) => address?.default_address === 1);

    const defaultAddress = getDefaultAddress()?.map((address, index) => (
        <React.Fragment key={index}>
            <div
                className={`addresses-list__item card address-card ${
                    selectedAddressId === address?.id ? "selected" : ""
                }`}
                onClick={() => setSelectedAddressId(address?.id)}
            >
                {address?.default_address === 1 && <div className="address-card__badge">الافتراضي</div>}

                <div className="address-card__body">
                    <div className="address-card__name">{translateCityNameFunc(cities, address?.city)}</div>
                    <div className="address-card__row">{translateProvinceName(address?.district)}</div>
                    <div className="address-card__row">{address?.street_address}</div>
                    <div className="address-card__row">{address?.postal_code}</div>
                </div>
            </div>
            <div className="addresses-list__divider" />
        </React.Fragment>
    ));

    const getAllAddresses = () =>
        fetchedData?.data?.orderAddress?.filter((address) => address?.id !== getDefaultAddress()?.[0]?.id);

    const addresses = getAllAddresses()?.map((address, index) => (
        <React.Fragment key={index}>
            <div
                className={`addresses-list__item card address-card ${
                    selectedAddressId === address?.id ? "selected" : ""
                }`}
                onClick={() => {
                    setSelectedAddressId(address?.id);
                }}
            >
                {address?.default_address === 1 && <div className="address-card__badge">الافتراضي</div>}

                <div className="address-card__body">
                    <div className="address-card__name">{translateCityNameFunc(cities, address?.city)}</div>
                    <div className="address-card__row">{translateProvinceName(address?.district)}</div>
                    <div className="address-card__row">{address?.street_address}</div>
                    <div className="address-card__row">{address?.postal_code}</div>
                </div>
            </div>
            <div className="addresses-list__divider" />
        </React.Fragment>
    ));

    // IM SET THIS TO CALC THE OFFSET FOR ADDRESS SLIDES
    useEffect(() => {
        if (defaultAddress?.length !== 0 || addresses?.length !== 0) {
            setAddressSlidesLength(addresses?.length + defaultAddress?.length);
        }
    }, [defaultAddress?.length, addresses?.length]);

    return (
        <div className="addresses-list">
            <Helmet>
                <title>{`العناوين — ${localStorage.getItem("store-name")}`}</title>
            </Helmet>
            {loading && citiesLoading ? (
                <div className="w-100 d-flex flex-row justify-content-center">
                    <BlockLoader />
                </div>
            ) : (
                <div className="addresses">
                    <div
                        className="slider-address"
                        ref={scrollRef}
                        style={{
                            overflowX: `${
                                (defaultAddress?.length !== 0 && addresses?.length !== 0) ||
                                (defaultAddress?.length === 0 && addresses?.length > 1) ||
                                (addresses?.length === 0 && defaultAddress?.length > 1)
                                    ? "scroll"
                                    : "hidden"
                            }`,
                        }}
                    >
                        <div
                            onClick={() => {
                                if (shippingSelect !== null) {
                                    setAddAddress(true);
                                    setDefaultAddressDisabled(false);
                                    setAddAddressClicked(true);
                                } else {
                                    toast.warning("يرجى اختيار شركة شحن أولاً", { theme: "colored" });
                                }
                            }}
                            className="addresses-list__item addresses-list__item--new"
                        >
                            <div className="addresses-list__plus" />
                            <div className="btn btn-secondary btn-sm">اضافة عنوان</div>
                        </div>
                        <div className="addresses-list__divider" />
                        {defaultAddress}
                        {addresses}
                    </div>
                    {((defaultAddress?.length !== 0 && addresses?.length !== 0) ||
                        (defaultAddress?.length === 0 && addresses?.length > 1) ||
                        (addresses?.length === 0 && defaultAddress?.length > 1)) && (
                        <div className="nav-btns">
                            <button className="left" onClick={() => scrollToDiv("left")}>
                                <i className="fas fa-angle-left"></i>
                            </button>
                            <button className="right" onClick={() => scrollToDiv("right")}>
                                <i className="fas fa-angle-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}
            {addressError && (
                <div className="mt-3">
                    <span style={{ fontSize: "0.85rem", fontWeight: "500" }} className="text-danger">
                        يرجى اضافة عنوان
                    </span>
                </div>
            )}
        </div>
    );
}
