// react
import React, { useEffect, useState } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";

// third-party
import classNames from "classnames";

// application
import { WhatsappIcon } from "../../svg";

export default function Whatsapp({ WhatsappNumber, storeName, logo }) {
    const [show, setShow] = useState(false);

    const showFrom = 300;
    const classes = classNames("whatsapp", {
        "whatsapp--show": show,
    });

    const chatMessage = () => {
        return <p>مرحبا بك، كيف يمكننا مساعدتك؟</p>;
    };

    useEffect(() => {
        let state = false;
        const onScroll = () => {
            const newState = window.pageYOffset >= showFrom;

            if (state !== newState) {
                setShow((state = newState));
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll, { passive: true });
    }, [setShow]);

    return (
        <div className={classes}>
            <div className="whatsapp__body">
                <div className="whatsapp__start">
                    {/*
                  <a
                        href={`https://api.whatsapp.com/send?phone=${
                            WhatsappNumber?.startsWith("+966")
                                ? WhatsappNumber?.slice(1)
                                : WhatsappNumber?.startsWith("00966")
                                ? WhatsappNumber?.slice(2)
                                : WhatsappNumber
                        }
                        `}
                        target="_blank"
                             className="whatsapp__button"
                        rel="noreferrer"
                    >
                        <WhatsappIcon title="يمكنك مراسلتنا عبر الواتساب" />
                    </a>
                */}

                    <FloatingWhatsApp
                        className="whatsapp__button"
                        chatboxClassName="avatar_padding chatBody"
                        buttonStyle={{ width: "40px", height: "40px" }}
                        buttonClassName="floating-whatsapp-button"
                        avatar={logo}
                        accountName={`${storeName}`}
                        statusMessage={"يمكنك التحدث الى خدمه العملاء لتقديم المساعدة أثناء الشراء أونلاين"}
                        chatMessage={chatMessage().props.children}
                        placeholder={"...يرجي ترك رسالتك"}
                        allowEsc
                        allowClickAway
                        notification
                        notificationSound
                        phoneNumber={
                            WhatsappNumber?.startsWith("+966")
                                ? WhatsappNumber?.slice(1)
                                : WhatsappNumber?.startsWith("00966")
                                ? WhatsappNumber?.slice(2)
                                : WhatsappNumber
                        }
                    />
                </div>
                <div className="whatsapp__container container" />
                <div className="whatsapp__end" />
            </div>
        </div>
    );
}
