// react
import React from 'react';

function WidgetNewsletter() {
    return (
        <div className="widget-newsletter widget">
            <h4 className="widget-newsletter__title">اخبارنا</h4>
            <div className="widget-newsletter__text">
                Phasellus eleifend sapien felis, at sollicitudin arcu semper mattis. Mauris quis mi
                quis ipsum tristique lobortis. Nulla vitae est blandit rutrum.
            </div>
            <form className="widget-newsletter__form" action="">
                <label htmlFor="widget-newsletter-email" className="sr-only">البريد الالكتروني</label>
                <input id="widget-newsletter-email" type="text" className="form-control" placeholder="البريد الالكتروني" />
                <button type="submit" className="btn btn-primary mt-3">الاشتراك</button>
            </form>
        </div>
    );
}

export default WidgetNewsletter;
