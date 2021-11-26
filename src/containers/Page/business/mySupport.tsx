import React from 'react';
import IntlMessages from "../../../components/utility/intlMessages";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import ContactBannerFooter from './contact-banner';


function MySupport(props) {
  

    return (
        <>
            <div className="col-sm-9">

                <div className="my_orders_returns_sec">
                    <div className="width-100">
                        <h1><IntlMessages id="footer.customer" /></h1>
                        <h2><IntlMessages id="mysupport.weWantToBe" /></h2>
                    </div>

                    <section className="customer-s">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                <div className="customer-d">
                                    <div className="customer-d-wrap">
                                        <i className="fas fa-phone" aria-hidden="true"></i>
                                        <h4><IntlMessages id="myaccount.phoneNo" /></h4>
                                        <a href="tel:+966888002470"><p>(+966)888 002 470</p></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                <div className="customer-d">
                                    <div className="customer-d-wrap">
                                        <i className="fas fa-envelope" aria-hidden="true"></i>
                                        <h4><IntlMessages id="login.email" /></h4>
                                        <a href="mailto:contact@cle.com"><p>contact@cle.com</p></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                <div className="customer-d">
                                    <div className="customer-d-wrap">
                                        <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                                        <Link to="https://www.google.com/maps/search/?api=1&query=24.6537488,46.8341752" target="_blank">
                                            <h4><IntlMessages id="myaccount.address" /></h4></Link>

                                        <p>Istabul St, As Sulay <br />Riyadh 14322, Kingdom of Saudi Arabia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="support-form">
                        <div className="row">
                            <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2">
                                <iframe title="contact form" style={{ "height": "800px", "width": "99%", "border": "none" }} src='https://forms.zohopublic.com/cleportal692/form/ContactusTeaser/formperma/ChqWeIlStcsFpEqH1XolNHheBwaVh9Huwq8bZ6pXOIQ'></iframe>
                                {/* <h3><IntlMessages id="contact.reach" /></h3>
                                <p><IntlMessages id="contact.do_you_have_question" /></p>

                                {form && form.form_json[0] && form.form_json[0].map(item => {
                                    return item.type === 'textinput' ?
                                        <div className="col-sm-12" key={item.name}>
                                            <label htmlFor=""> <b>{item.label}</b></label>
                                            <input type="text"
                                                className={item.className}
                                                id={item.name}
                                                aria-describedby={item.name}
                                                placeholder={Capitalize(item.label)}
                                                value={state[item.name]}
                                                onChange={handleChange}
                                            />
                                            <span className="error">{errors.errors[item.name]}</span>
                                        </div> : item.type === 'textarea' ? <div className="col-sm-12" key={item.name}>
                                            <label htmlFor=""> <b>{item.label}</b></label>
                                            <textarea id={item.name} value={state.message} className={item.className} placeholder={Capitalize(item.label)} onChange={handleChange}></textarea>
                                            <span className="error">{errors.errors[item.name]}</span>
                                        </div> : <div className="col-sm-12" key={item.name}>
                                            <label htmlFor=""> <b>{item.label}</b></label>
                                            <select value={state.reason} onChange={handleChange} id={item.name} className={item.className}>
                                                <option value="">{item.label}</option>
                                                {item.values && item.values.map(opt => {
                                                    return (<option key={opt.value} value={opt.value}>{opt.label}</option>);
                                                })}
                                            </select>
                                            <span className="error">{errors.errors[item.name]}</span>
                                        </div>

                                })}

                                <div className="d-flex justify-content-end">
                                    <Link to="/" className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}> <IntlMessages id="contact.send" /></Link>
                                    <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></div>
                                </div> */}


                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* <ContactBannerFooter /> */}
        </>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(MySupport);