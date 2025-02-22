import React from "react";
import Collapse from "../../shared/Collapse";

const RenderShippingList = ({
    paymentSelect,
    shippingType,
    shippingSelect,
    setShippingSelect,
    changeShippingPrice,
    SelectShippingTypeFunc,
    error,
    defaultAddress,
    setDefaultAddress,
    setShipping,
    daysDefinition,
}) => {
    // this part to handle display only other shipping company if user select madfu  a payment gateway
    const selectedPaymentId = JSON.parse(paymentSelect)?.id;
    const filteredShippingCompanies =
        selectedPaymentId === 5
            ? shippingType?.data?.shipping_company?.filter((shipping) => shipping?.id !== 1)
            : shippingType?.data?.shipping_company;

    const shippingData = filteredShippingCompanies?.map((shipping) => {
        const renderShipping = ({ setItemRef, setContentRef }) => (
            <li className="payment-methods__item" ref={setItemRef}>
                <label className="payment-methods__item-header">
                    <div className="d-flex flex-row align-items-center">
                        <span className="payment-methods__item-radio input-radio">
                            <span className="input-radio__body">
                                <input
                                    type="radio"
                                    className="input-radio__input"
                                    name="checkout_shipping_method"
                                    value={Number(shipping?.id)}
                                    checked={Number(shippingSelect) === Number(shipping?.id)}
                                    onChange={(e) => {
                                        setShippingSelect(e.target.value);
                                        changeShippingPrice(Number(shipping?.price));
                                        SelectShippingTypeFunc(e.target.value);

                                        if (+e.target.value === +defaultAddress?.shippingtype_id?.id) {
                                            setDefaultAddress(defaultAddress);
                                        } else {
                                            setShipping({
                                                id: null,
                                                district: "",
                                                city: "",
                                                address: "",
                                                postCode: "",
                                                notes: "",
                                                defaultAddress: true,
                                            });
                                        }
                                    }}
                                />
                                <span className="input-radio__circle" />
                            </span>
                        </span>
                        <div className="d-flex flex-row align-items-center" style={{ gap: "5px" }}>
                            <span className="payment-methods__item-title">{shipping?.name}</span>
                            {shipping?.time !== "0" && shipping?.price !== "0" && (
                                <span style={{ fontSize: "0.8rem", color: "#919191" }}>
                                    {shipping?.time !== null && shipping?.time !== 0
                                        ? `مدة التوصيل : ${daysDefinition(shipping?.time)}`
                                        : ""}
                                </span>
                            )}
                        </div>
                    </div>
                    <img
                        src={shipping?.image}
                        alt={shipping?.name}
                        width="40"
                        height="20"
                        style={{ objectFit: "contain" }}
                    />
                </label>
                <div className="payment-methods__item-container" ref={setContentRef}>
                    <div className="payment-methods__item-description text-muted"></div>
                </div>
            </li>
        );

        return (
            <Collapse
                key={Number(shipping?.id)}
                open={false}
                toggleClass="shipping-methods__item--active"
                render={renderShipping}
            />
        );
    });

    return (
        filteredShippingCompanies?.length !== 0 && (
            <div className="payment-methods">
                <h6>يرجى اختيار شركة الشحن</h6>
                <ul className="payment-methods__list">{shippingData}</ul>
                {error?.shippingType && (
                    <span style={{ fontSize: "0.85rem", fontWeight: "500" }} className="text-danger">
                        {error?.shippingType}
                    </span>
                )}
            </div>
        )
    );
};

export default RenderShippingList;
