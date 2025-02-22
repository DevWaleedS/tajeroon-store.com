// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import { ArrowRoundedLeft7x11Svg, ArrowRoundedRight7x11Svg } from "../../svg";

function BlockHeader(props) {
	const { title, groups, onPrev, onNext, onGroupClick, activeId } = props;
	let { arrows } = props;

	if (arrows) {
		arrows = (
			<div className='block-header__arrows-list'>
				<button
					className='block-header__arrow block-header__arrow--left'
					type='button'
					onClick={onPrev}>
					<ArrowRoundedLeft7x11Svg />
				</button>
				<button
					className='block-header__arrow block-header__arrow--right'
					type='button'
					onClick={onNext}>
					<ArrowRoundedRight7x11Svg />
				</button>
			</div>
		);
	}

	let groupsList;

	if (groups.length > 0) {
		groupsList = groups?.map((group, index) => {
			const classes = classNames("block-header__group", {
				"block-header__group--active": group?.id === activeId,
			});

			return (
				<li key={index}>
					<button
						type='button'
						className={classes}
						onClick={() => onGroupClick(group?.id)}>
						{group?.name}
					</button>
				</li>
			);
		});

		groupsList = (
			<ul className='block-header__groups-list'>
				<li>
					<button
						type='button'
						className={
							activeId === 0
								? "block-header__group block-header__group--active"
								: "block-header__group"
						}
						onClick={() => onGroupClick(0)}>
						الكل
					</button>
				</li>
				{groupsList}
			</ul>
		);
	}

	return (
		<div className='block-header'>
			<h2 className='block-header__title'>{title}</h2>
			<div className='block-header__divider' />
			{groupsList}
			{arrows}
		</div>
	);
}

BlockHeader.propTypes = {
	title: PropTypes.string,
	arrows: PropTypes.bool,
	groups: PropTypes.array,
	onNext: PropTypes.func,
	onPrev: PropTypes.func,
	onGroupClick: PropTypes.func,
};
BlockHeader.defaultProps = {
	groups: [],
	onGroupClick: () => {},
};

export default BlockHeader;
