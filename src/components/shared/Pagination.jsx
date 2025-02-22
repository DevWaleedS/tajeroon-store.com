// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { ArrowRoundedLeft8x13Svg, ArrowRoundedRight8x13Svg } from '../../svg';

class Pagination extends Component {

    render() {
        const { postsPerPage, totalPosts, paginate, previousPage, nextPage, currentPage } = this.props;
        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
            pageNumbers.push(i);
        }

        const firstLinkClasses = classNames('page-item', {
            disabled: currentPage <= 1,
        });
        const lastLinkClasses = classNames('page-item', {
            disabled: currentPage >= totalPosts,
        });

        const pages = pageNumbers?.map((page, index) => {
            const classes = classNames('page-item', {
                active: page === currentPage,
            });

            return (
                <li key={index} className={classes}>
                    <button type="button" className="page-link" onClick={() => paginate(page)}>
                        {page}
                        {page === currentPage && <span className="sr-only">(current)</span>}
                    </button>
                </li>
            );
        });

        return (
            <ul className="pagination justify-content-center">
                <li className={firstLinkClasses}>
                    <button
                        type="button"
                        className="page-link page-link--with-arrow"
                        aria-label="Previous"
                        onClick={previousPage}
                    >
                        <ArrowRoundedLeft8x13Svg className="page-link__arrow page-link__arrow--left" aria-hidden="true" />
                    </button>
                </li>
                {pages}
                <li className={lastLinkClasses}>
                    <button
                        type="button"
                        className="page-link page-link--with-arrow"
                        aria-label="Next"
                        onClick={nextPage}
                    >
                        <ArrowRoundedRight8x13Svg className="page-link__arrow page-link__arrow--right" aria-hidden="true" />
                    </button>
                </li>
            </ul>
        );
    }
}

Pagination.propTypes = {
    /**
     * the number of sibling links
     */
    siblings: PropTypes.number,
    /**
     * current page number
     */
    current: PropTypes.number,
    /**
     * total pages
     */
    total: PropTypes.number,
    /**
     * total pages
     */
    onPageChange: PropTypes.func,
};

Pagination.defaultProps = {
    siblings: 1,
    current: 1,
    total: 1,
};

export default Pagination;
