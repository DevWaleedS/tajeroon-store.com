import React from "react";
import { Pagination } from "@mui/material";

const DisplayedPosts = ({ layout, postsList, search, fetchedData, currentPage, setCurrentPage }) => {
    return (
        <div className="col-12 col-lg-8">
            <div className="block">
                <div className="posts-view">
                    <div className={`posts-view__list posts-list posts-list--layout--${layout}`}>
                        <div className="posts-list__body">{postsList}</div>
                    </div>
                    <div className="posts-view__pagination">
                        {search ? (
                            ""
                        ) : (
                            <>
                                {fetchedData?.data?.page_count === 1 ? (
                                    ""
                                ) : (
                                    <Pagination
                                        count={fetchedData?.data?.page_count}
                                        page={currentPage}
                                        onChange={(event, value) => {
                                            setCurrentPage(value);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayedPosts;
