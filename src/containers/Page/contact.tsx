import React, { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";

import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
// import { Link } from "react-router-dom";
import { getCookie } from "../../helpers/session";
import { getContactUsForm, SubmitContactUs } from '../../redux/pages/allPages';
const { openSignUp } = appAction;

function ContactUS(props) {
    const language = getCookie('currentLanguage');
    const [isShow, setIsShow] = useState(false);
    const [state, setState] = useState({
        name: "",
        email: "",
        reason: "",
        message: ""
    })
    const [errors, setError] = useState({
        errors: {}
    });

    const [form, setForm] = useState({
        "title": "",
        "form_id": null,
        "store_id": "",
        "form_json": [],
        "code": ""
    });
    const [payload, setPayload] = useState({
        "answer_id": null,
        "form_id": null,
        "store_id": null,
        "created_at": "",
        "ip": "122.173.115.186",
        "response_json": "",
        "customer_id": null,
        "admin_response_email": "",
        "response_message": "",
        "recipient_email": "",
        "customer_name": "",
        "admin_response_status": "0",
        "referer_url": "",
        "form_name": null,
        "form_code": null
    });

    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let result: any = await getContactUsForm(lang);
            setForm(result.data[0]);
        }
        getData()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages, language]);


    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        //Email   
        if (typeof state["email"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state["email"]))) {
                formIsValid = false;
                error["email"] = "Email is not valid";
            }
        }
        if (!state["email"]) {
            formIsValid = false;
            error["email"] = "Email is required";
        }

        if (!state["reason"]) {
            formIsValid = false;
            error["reason"] = "Reason is required";
        }

        if (!state["name"]) {
            formIsValid = false;
            error["name"] = 'Name is required';
        }

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = 'Message is required';
        }


        setError({ errors: error });
        return formIsValid;
    }

    return (
        <div className="container about-inner inner-pages"  >
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
                                    <a href="tel:+966555028568"><p>+966 55 502 8568</p></a>
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
                                    <a href="https://www.google.com/maps/search/?api=1&query=24.6537488,46.8341752" target="_blank">
                                        <h4><IntlMessages id="myaccount.address" /></h4></a>

                                    <p>6934 AlWaqit - AlMuhammadia Unit No 1<br />
                                        Riyadh 12361 - 4883<br />
                                        KSA</p><br />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="support-form">
                    <div className="row">
                        <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2">
                            <iframe title="contact form" style={{ "height": "800px", "width": "99%", "border": "none" }} src='https://forms.zohopublic.com/cleportal692/form/ContactusTeaser/formperma/ChqWeIlStcsFpEqH1XolNHheBwaVh9Huwq8bZ6pXOIQ'></iframe>                      
                        </div>
                    </div>
                </section>
            </div>
        </div>
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
    { openSignUp }
)(ContactUS);