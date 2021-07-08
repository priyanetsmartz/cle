import React from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import logo from "../../image/CLE-LOGO.svg";
function Header() {


    return (
        <div className="header-logo-menu">
            <div className="container">
                <div className="mt-5">
                    <img src={logo} />
                    <div className="hamburger">
                        <a data-bs-toggle="modal" href="#exampleModalToggle" role="button">
                            <span className="hb-first"></span>
                            <span className="hb-second"></span>
                            <span className="hb-third"></span>
                        </a>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        </div>
    );
}

export default Header;
