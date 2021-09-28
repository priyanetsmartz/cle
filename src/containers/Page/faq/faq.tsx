import { useState, useEffect } from 'react';
import { connect } from "react-redux";

function Faq(props) {

    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="FAQ-head">FAQ Topics</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 FAQ-qus-sec">
                        <h5><i className="fas fa-truck"></i> <span>Delivery</span></h5>
                        <ul>
                            <li>Where's my order?</li>
                            <li>Shipping Methods</li>
                            <li>Premier Delivery Shipping</li>
                        </ul>
                        <div className="faq-view-all"><a href="">View all</a></div>
                    </div>
                    <div className="col-md-4 FAQ-qus-sec">
                        <h5><i className="fas fa-wallet"></i> <span>Returnes & Refunds</span></h5>
                        <ul>
                            <li>Our Returns Policy</li>
                            <li>How to return from the US</li>
                            <li>Can I exchange?</li>
                        </ul>
                        <div className="faq-view-all"><a href="">View all</a></div>
                    </div>
                    <div className="col-md-4 FAQ-qus-sec">
                        <h5><i className="fas fa-box"></i> <span>Order Issues</span></h5>
                        <ul>
                            <li>Can I cancel an order?</li>
                            <li>Missing Item</li>
                            <li>Wrong item received</li>
                        </ul>
                        <div className="faq-view-all"><a href="">View all</a></div>
                    </div>
                    <div className="col-md-4 FAQ-qus-sec">
                        <h5><i className="far fa-credit-card"></i> <span>Payments, Codes & Vouchers</span></h5>
                        <ul>
                            <li>Payment options</li>
                            <li>Help with a promo code</li>
                            <li>Student Promo Codes</li>
                        </ul>
                        <div className="faq-view-all"><a href="">View all</a></div>
                    </div>
                    <div className="col-md-4 FAQ-qus-sec">
                        <h5><i className="fas fa-tag"></i> <span>Products & Stock</span></h5>
                        <ul>
                            <li>Will an item be back in stock?</li>
                            <li>Product information</li>
                            <li>Size guide</li>
                        </ul>
                        <div className="faq-view-all"><a href="">View all</a></div>
                    </div>
                    <div className="col-md-4 FAQ-qus-sec">
                        <h5><i className="fas fa-cog"></i> <span>Technical</span></h5>
                        <ul>
                            <li>Trouble signing into my account</li>
                            <li>Changing account details</li>
                            <li>Forgotten your password?</li>
                        </ul>
                        <div className="faq-view-all"><a href="">View all</a></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function mapStateToProps(state) {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages

    };
};
export default connect(
    mapStateToProps,
    {}
)(Faq);