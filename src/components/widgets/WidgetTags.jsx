// react
import React from "react";

// third-party
import { Link } from "react-router-dom";

function WidgetTags({ tags }) {
	return (
		<div className='widget-tags widget'>
			<h4 className='widget__title'>العلامات</h4>
			<div className='tags tags--lg'>
				<div className='tags__list'>
					{tags?.map(
						(tag, index) => tag !== "" && <span key={index}>{tag}</span>
					)}
				</div>
			</div>
		</div>
	);
}

export default WidgetTags;
