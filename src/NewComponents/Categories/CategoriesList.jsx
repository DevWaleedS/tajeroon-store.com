import React from 'react';

const CategoriesList = ({ categories, activeCategoryId, onCategoryClick }) => {
    return (
        <ul className="block-header__groups-list">
            <li>
                <button
                    type="button"
                    className={`block-header__group ${activeCategoryId === null ? 'block-header__group--active' : ''}`}
                    onClick={() => onCategoryClick(null)}
                >
                    الكل
                </button>
            </li>
            {categories?.data?.categories?.length > 0 ? (
                categories.data.categories.map((category) => (
                    <li key={`category-${category.id}`}>
                        <button
                            type="button"
                            className={`block-header__group ${activeCategoryId === category.id ? 'block-header__group--active' : ''}`}
                            onClick={() => onCategoryClick(category.id)}
                        >
                            {category.name}
                        </button>
                    </li>
                ))
            ) : (
                <li>
                    <span className="block-header__group">لا توجد فئات</span>
                </li>
            )}
        </ul>
    );
};

export default CategoriesList;
