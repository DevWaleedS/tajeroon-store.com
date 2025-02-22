// react
import React, { useState } from "react";

// application
import { Search20Svg } from "../../svg";

function WidgetSearch({ getSearchData }) {
    const [search, setSearch] = useState("");

    return (
        <div className="widget-search">
            <form className="widget-search__body">
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        getSearchData(e.target.value);
                    }}
                    className="widget-search__input"
                    placeholder="البحث عن..."
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                />
                <button className="widget-search__button" type="submit">
                    <Search20Svg />
                </button>
            </form>
        </div>
    );
}

export default WidgetSearch;
