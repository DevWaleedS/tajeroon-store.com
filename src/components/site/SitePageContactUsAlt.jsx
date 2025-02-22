// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

// application
import PageHeader from "../shared/PageHeader";

function SitePageContactUsAlt() {
    const breadcrumb = [
        { title: "الرئيسية", url: "" },
        { title: "تواصل معنا", url: "" },
    ];

    return (
        <React.Fragment>
            <Helmet>
                <title>{`تواصل معنا — ${localStorage.getItem("store-name")}`}</title>
            </Helmet>

            <PageHeader header="تواصل معنا" breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="card mb-0 contact-us">
                        <div className="contact-us__map">
                            <iframe
                                title="Google Map"
                                src="https://maps.google.com/maps?q=Holbrook-Palmer%20Park&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                            />
                        </div>
                        <div className="card-body">
                            <div className="contact-us__container">
                                <div className="row">
                                    <div className="col-12 col-lg-6 pb-4 pb-lg-0">
                                        <h4 className="contact-us__header card-title">عنواننا</h4>

                                        <div className="contact-us__address">
                                            <p>
                                                715 Fake Ave, Apt. 34, New York, NY 10021 USA
                                                <br />
                                                البريد الالكتروني: stroyka@example.com
                                                <br />
                                                رقم الهاتف: +1 754 000-00-00
                                            </p>

                                            <p>
                                                <strong>اوقات الدوام</strong>
                                                <br />
                                                الاثنين الى الجمعة: 8am-8pm
                                                <br />
                                                السبت: 8am-6pm
                                                <br />
                                                الأحد: 10am-4pm
                                            </p>

                                            <p>
                                                <strong>ملاحظة</strong>
                                                <br />
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                                                suscipit suscipit mi, non tempor nulla finibus eget. Lorem ipsum dolor
                                                sit amet, consectetur adipiscing elit.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <h4 className="contact-us__header card-title">اترك لنا رسالة</h4>

                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="form-name">اسمك بالكامل</label>
                                                    <input
                                                        type="text"
                                                        id="form-name"
                                                        className="form-control"
                                                        placeholder="اسمك بالكامل"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="form-email">البريد الالكتروني</label>
                                                    <input
                                                        type="email"
                                                        id="form-email"
                                                        className="form-control"
                                                        placeholder="البريد الالكتروني"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-subject">موضوع الرسالة</label>
                                                <input
                                                    type="text"
                                                    id="form-subject"
                                                    className="form-control"
                                                    placeholder="موضوع الرسالة"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-message">الرسالة</label>
                                                <textarea id="form-message" className="form-control" rows="4" />
                                            </div>
                                            <button type="submit" className="btn btn-primary">
                                                ارسال
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SitePageContactUsAlt;
