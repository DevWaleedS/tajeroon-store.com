import React from "react";
import { connect } from "react-redux";
import { FormControl } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {
	updateStock,
	updatePrice,
	updateOptionId,
	updateDiscountPrice,
} from "../../store/product";

function ServicesOptions(props) {
	const { attributes, selectedValues, updateSelectOptions } = props;

	// to handle the period of the service

	// handle period by days
	const handlePeriodByDays = (period) => {
		const numPeriod = Number(period);

		if (numPeriod === 1) return <span className='text-success'>يوم واحد</span>;
		if (numPeriod === 2) return <span className='text-success'>يومين</span>;
		if (numPeriod >= 3 && numPeriod <= 10)
			return <span className='text-success'>{period} أيام</span>;
		return <span className='text-success'>{period} يوم</span>;
	};

	// handle period by hours
	const handlePeriodByHours = (hours) => {
		const numPeriod = Number(hours);
		if (numPeriod === 1)
			return <span className='text-success'>ساعة واحدة</span>;
		if (numPeriod === 2) return <span className='text-success'>ساعتين</span>;
		if (numPeriod >= 3 && numPeriod <= 10)
			return <span className='text-success'>{hours} ساعات</span>;
		return <span className='text-success'>{hours} ساعة</span>;
	};

	return (
		<div className='services-options'>
			<h5 className='service_option_name'>{attributes[0]?.name}</h5>
			{attributes?.map((attribute, index) => (
				<FormControl key={`attribute-${attribute.id || index}`}>
					<div className='checkbox_service_options'>
						{attribute?.values?.map((item, index) => (
							<div
								key={`item-${item.id}`}
								className='service_option  d-flex align-items-start justify-content-start'>
								<Checkbox
									sx={{
										color: "#1dbbbe",
										padding: "0 4px",
										"&.Mui-checked": {
											color: "#1dbbbe",
										},
									}}
									type='checkbox'
									id={`checkbox-${item.id}`}
									className='input'
									name='product-option'
									checked={selectedValues.some((val) => val.id === item.id)}
									onChange={() => updateSelectOptions(item, index)}
								/>

								<label htmlFor={`checkbox-${item.id}`}>
									<div className='service_title'>{item?.value?.[0]} </div>
									<div className='service_price_period'>
										مقابل{" "}
										<span className='text-success'>
											{item?.value?.[3]} ر.س إضافية
										</span>{" "}
										{item?.value?.[1] && item?.value?.[2] ? (
											<>
												علي سعر الخدمة ، و سيزيد مدة التنفيذ{" "}
												{handlePeriodByDays(item?.value?.[1])}
												<span className='text-success'> و </span>
												{handlePeriodByHours(item?.value?.[2])}{" "}
											</>
										) : item?.value?.[1] && !item?.value?.[2] ? (
											<>
												علي سعر الخدمة ، و سيزيد مدة التنفيذ{" "}
												{handlePeriodByDays(item?.value?.[1])}
											</>
										) : !item?.value?.[1] && item?.value?.[2] ? (
											<>
												علي سعر الخدمة ، و سيزيد مدة التنفيذ{" "}
												{handlePeriodByHours(item?.value?.[2])}
											</>
										) : null}
									</div>
								</label>
							</div>
						))}
					</div>
				</FormControl>
			))}
		</div>
	);
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
	updateStock,
	updatePrice,
	updateDiscountPrice,
	updateOptionId,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServicesOptions);
