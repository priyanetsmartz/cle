import React, { useState, useEffect } from 'react';
import IntlMessages from "../../../components/utility/intlMessages";
import notification from '../../../components/notification';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getCookie } from "../../../helpers/session";
import { getContactUsForm, SubmitContactUs } from '../../../redux/pages/allPages';



function MySupport(props) {
    const name = localStorage.getItem('token_name');
    const email = localStorage.getItem('token_email');
    const language = getCookie('currentLanguage');
    const [isShow, setIsShow] = useState(false);
    const [state, setState] = useState({
        name: name ? name : '',
        email: email ? email: '',
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

    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        //  const { register } = props;
        if (handleValidation()) {
            setIsShow(true);
            let data: any = {};
            form.form_json[0].forEach(el => {
                data[el.name] = {
                    value: state[el.name],
                    label: el.label,
                    type: el.type
                }
            });

            payload.response_json = JSON.stringify(data);
            payload.form_id = form.form_id;
            payload.store_id = form.store_id;
            payload.form_name = form.title;
            payload.form_code = form.code;
            setPayload(payload);
            let result: any = await SubmitContactUs({ answer: payload });
            if (result) {
                notification("success", "", "Message sent!");
                setIsShow(false);
                setState(prevState => ({
                    ...prevState,
                    name: name ? name: '',
                    email: email ? email: '',
                    reason: "",
                    message: ""
                }))
            }
        } else {
            setIsShow(false);
            notification("warning", "", "Please enter required values");
        }
    }


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
                                        <h4><IntlMessages id="register.email" /></h4>
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

                                        <p>Istabul St, As Sulay <br />Riyadh 14322, Kingdom of Saudi Arabia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="support-form">
                        <div className="row">
                            <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2">
                                <h3><IntlMessages id="contact.reach" /></h3>
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
                                </div>


                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <section className="container-fluid help-center">
                <div className="row">
                    <div className="col-xs-12 col-md-12 col-lg-12">
                        <h3><IntlMessages id="mysupport.checkHelp" /></h3>
                        <p><IntlMessages id="mysupport.findTheAnswer" /></p>
                        {/* on check out redirect user to help center page */}
                        <button type="submit" className="btn btn-primary"><IntlMessages id="home.checkout" /></button>
                    </div>
                </div>
            </section>
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