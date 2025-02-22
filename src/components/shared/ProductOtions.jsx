import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { FormControl } from '@mui/material';
import { updateStock, updatePrice, updateDiscountPrice, updateOptionId } from "../../store/product";
import { findMatchingSubArray } from '../../Utilities/UtilitiesFunctions';

function ProductOtions(props) {
    const { product, attributes, selectedValues, updateSelectOptions, updateStock, updatePrice, updateDiscountPrice, updateOptionId, setImageIndex, itemProduct } = props;

    const changeIamge = (imageIndex) => {
        if (setImageIndex) {
            setImageIndex(imageIndex);
        }
    }

    useEffect(() => {
        if (selectedValues?.filter(value => value !== "")?.length > 0 && product?.product_has_options === 1 && product?.amount === 1) {
            const optionNames = product?.options?.map((option) => option);
            const matchingSubArray = findMatchingSubArray(optionNames, selectedValues?.filter(value => value !== ""));
            updateOptionId(Number(matchingSubArray?.id));
            updatePrice(Number(matchingSubArray?.price));
            updateDiscountPrice(Number(matchingSubArray?.discount_price));
            updateStock(Number(matchingSubArray?.quantity));
        } else {
            updateOptionId(null);
            updatePrice(Number(product?.selling_price));
            updateDiscountPrice(Number(product?.discount_price));
            updateStock(Number(product?.stock));
        }
    }, [product, product?.amount, selectedValues, selectedValues?.length, product?.stock, product?.options, product?.selling_price, product?.discount_price, updateSelectOptions]);

    return (
        <div className="product-options">
            {attributes?.map((attribute, index) => (
                <FormControl key={index} sx={{ m: 0, width: "100%", display: "flex", flexDirection: "cloumn", alignItems: "start", gap: "0.5rem" }}>
                    <label>يرجى اختيار {attribute?.name} <span>*</span></label>
                    {attribute?.type === "نص و صورة" ?
                        <div className="radio-options">
                            {attribute?.values?.map(
                                (item, itemIndex) => item !== "" &&
                                    <div
                                        key={itemIndex}
                                        className={`option-image ${selectedValues?.[index] === item?.value?.[0] ? 'active' : ''}`}
                                        onClick={() => changeIamge(itemIndex + 1)}
                                    >
                                        <label htmlFor={item?.id}>
                                            <div className="image">
                                                <img src={item?.value?.[2]} alt={item?.value?.[0]} />
                                            </div>
                                            <span>{item?.value?.[0]}</span>
                                        </label>
                                        <input
                                            id={item?.id}
                                            type='radio'
                                            className='input'
                                            name='product-option'
                                            value={item?.value?.[0]}
                                            onChange={(e) => updateSelectOptions(e, index, itemProduct)}
                                        />
                                    </div>
                            )}
                        </div>
                        :
                        attribute?.type === "نص و لون" ?
                            <div className="radio-options">
                                {attribute?.values?.map(
                                    (item, itemIndex) => item !== "" &&
                                        <div className={`option-color ${selectedValues?.[index] === item?.value?.[0] ? 'active' : ''}`} key={itemIndex}>
                                            <label htmlFor={item?.id}>
                                                {item?.value?.[0]}
                                                <span style={{ backgroundColor: `${item?.value?.[2]}` }}></span>
                                            </label>
                                            <input
                                                id={item?.id}
                                                type='radio'
                                                className='input'
                                                name='product-option'
                                                value={item?.value?.[0]}
                                                onChange={(e) => updateSelectOptions(e, index, itemProduct)}
                                            />
                                        </div>
                                )}
                            </div>
                            :
                            <div className="radio-options">
                                {attribute?.values?.map(
                                    (item, itemIndex) => item !== "" &&
                                        <div className={`option ${selectedValues?.[index] === item?.value?.[0] ? 'active' : ''}`} key={itemIndex}>
                                            <label htmlFor={item?.id}>{item?.value?.[0]}</label>
                                            <input
                                                id={item?.id}
                                                type='radio'
                                                className='input'
                                                name='product-option'
                                                value={item?.value?.[0]}
                                                onChange={(e) => updateSelectOptions(e, index, itemProduct)}
                                            />
                                        </div>
                                )}
                            </div>
                    }
                </FormControl>
            ))}
        </div>
    )
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
    updateStock,
    updatePrice,
    updateDiscountPrice,
    updateOptionId,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductOtions);
