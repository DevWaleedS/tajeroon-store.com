// react
import React, { useCallback } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import Collapse from "../shared/Collapse";
import FilterCategory from "../filters/FilterCategory";
import FilterCheck from "../filters/FilterCheck";
import FilterColor from "../filters/FilterColor";
import FilterRadio from "../filters/FilterRadio";
import FilterRange from "../filters/FilterRange";
import getFilterHandler from "../../services/filters";
import { ArrowRoundedDown12x7Svg } from "../../svg";

const filterComponents = {
	category: FilterCategory,
	range: FilterRange,
	check: FilterCheck,
	radio: FilterRadio,
	color: FilterColor,
};

function WidgetFilters(props) {
	const { dispatch, filters, values, title, offcanvas } = props;

	const handleValueChange = useCallback(
		({ filter, value }) => {
			const handler = getFilterHandler(filter);

			if (handler) {
				dispatch({
					type: "SET_FILTER_VALUE",
					filter: filter.slug,
					value: handler.isDefaultValue(filter, value)
						? undefined
						: handler.serialize(value),
				});
			}
		},
		[dispatch]
	);

	const handleResetFilters = () => {
		dispatch({ type: "RESET_FILTERS" });
	};

	const filtersList = filters?.filters?.map((filter) => {
		let filterView;
		let { value } = filter;
		const handler = getFilterHandler(filter);

		if (handler && filter.slug in values) {
			value =
				handler.deserialize(values[filter.slug]) ||
				handler.getDefaultValue(filter);
		}

		const FilterComponent = filterComponents[filter.type];

		if (FilterComponent) {
			filterView = (
				<FilterComponent
					data={filter}
					value={value}
					onChangeValue={handleValueChange}
					activeCategory={filters?.filter_category}
				/>
			);
		}

		return (
			<div key={filter.slug} className='widget-filters__item'>
				<Collapse
					toggleClass='filter--opened'
					render={({ toggle, setItemRef, setContentRef }) => (
						<div className='filter filter--opened' ref={setItemRef}>
							<button type='button' className='filter__title' onClick={toggle}>
								{filter.name}
								<ArrowRoundedDown12x7Svg className='filter__arrow' />
							</button>
							<div className='filter__body' ref={setContentRef}>
								<div className='filter__container'>{filterView}</div>
							</div>
						</div>
					)}
				/>
			</div>
		);
	});

	const classes = classNames("widget-filters widget", {
		"widget-filters--offcanvas--always": offcanvas === "always",
		"widget-filters--offcanvas--mobile": offcanvas === "mobile",
	});

	return (
		<div className={classes}>
			<h4 className='widget-filters__title widget__title'>{title}</h4>

			<div className='widget-filters__list'>{filtersList}</div>

			<div className='widget-filters__actions d-flex mb-n2'>
				<button
					type='button'
					className='btn btn-secondary btn-sm'
					onClick={handleResetFilters}>
					احذف الفرز
				</button>
			</div>
		</div>
	);
}

WidgetFilters.propTypes = {
	/**
	 * widget title
	 */
	title: PropTypes.node,
	/**
	 * Category page dispatcher.
	 */
	dispatch: PropTypes.func,
	/**
	 * Products list filters.
	 */
	filters: PropTypes.array,
	/**
	 * Products list filter values.
	 */
	values: PropTypes.object,
	/**
	 * indicates when sidebar bar should be off canvas
	 */
	offcanvas: PropTypes.oneOf(["always", "mobile"]),
};

WidgetFilters.defaultProps = {
	offcanvas: "mobile",
};

export default WidgetFilters;
