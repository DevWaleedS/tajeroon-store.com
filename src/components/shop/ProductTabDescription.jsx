// react
import React from 'react';

function ProductTabDescription({ desc }) {
    return (
        <div
            className="typography"
            dangerouslySetInnerHTML={{
                __html: desc,
            }}
        >
        </div>
    );
}

export default ProductTabDescription;
