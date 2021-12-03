import { useState } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { SendNewsletter } from '../../../redux/pages/magazineList';
import notification from '../../../components/notification';
import { getCookie } from "../../../helpers/session";
import { Link } from "react-router-dom";


function BecomePartner(props) {
    const intl = useIntl();
    const language = getCookie('currentLanguage');
    const [radio, setRadio] = useState(intl.formatMessage({ id: "newsletter.option1" }));
    console.log(radio)
    const [isShow, setIsShow] = useState(false);
    const [state, setState] = useState({
        email: ""
    })
    const [errors, setError] = useState({
        errors: {}
    });

    const onValueChange = (e) => {
        setRadio(e.target.value);
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = async (e) => {
        let lang = props.languages ? props.languages : language;
        e.preventDefault();
        if (handleValidation()) {
            setIsShow(true);
            const userInfo = {
                "email": state.email,
                "type": radio
            }
            const result: any = await SendNewsletter({ userInfo }, lang);
            if (result.data[0].success === 1) {
                notification("success", "", result.data[0].message);
                setState(prevState => ({
                    ...prevState,
                    email: ""
                }))
                setIsShow(false);
            } else {
                setIsShow(false);
                notification("error", "", result.data[0].message);
            }
        } else {
            setIsShow(false);
            notification("warning", "", intl.formatMessage({ id: "requirederror" }));
        }
    }


    const handleValidation = () => {
        let error = {};
        let formIsValid = true;
        if (typeof state["email"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state["email"]))) {
                formIsValid = false;
                error["email"] =  intl.formatMessage({ id: "emailvalidation" });
            }
        }
        if (!state["email"]) {
            formIsValid = false;
            error["email"] = intl.formatMessage({ id: "emailrequired" });
        }

        setError({ errors: error });
        return formIsValid;
    }

    return (
        <section className="width-100 my-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="become-partner">
                            <div className="become-part-inner">
                                <h1><IntlMessages id="home.becomePartner" /></h1>
                                <p><IntlMessages id="home.howItWorks" /></p>
                                <p><IntlMessages id="home.seeMoreInfo" /></p>
                                <Link to="/contact-us"><IntlMessages id="home.checkout" /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="banner-content-2 text-center">
                            <h4><IntlMessages id="home.shopFirst" /></h4>
                            <p><IntlMessages id="home.signUpForExclusive" /></p>
                            <div className="wear-ckeckbox">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" checked={radio === intl.formatMessage({ id: "newsletter.option1" })} onChange={onValueChange} name="inlineRadioOptions" id="inlineRadio1" value={intl.formatMessage({ id: "newsletter.option1" })} />
                                    <label className="form-check-label" htmlFor="inlineRadio1"><IntlMessages
                                        id="newsletter.option1" /></label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" onChange={onValueChange} name="inlineRadioOptions" id="inlineRadio2" value={intl.formatMessage({ id: "newsletter.option2" })} />
                                    <label className="form-check-label" htmlFor="inlineRadio2"><IntlMessages
                                        id="newsletter.option2" /></label>
                                </div>
                            </div>
                            <form className="row g-3 newsletter-signup">
                                <div className="col-auto">
                                    <label htmlFor="inputEmail" className="visually-hidden"><IntlMessages id="home.yourMail" /></label>
                                    <input type="text"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder={intl.formatMessage({ id: 'newsletter.input' })}
                                        value={state.email}
                                        onChange={handleChange} />
                                </div>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-primary mb-3" style={{ "display": !isShow ? "inline-block" : "none" }} onClick={handleSubmitClick} ><IntlMessages id="newsletter.signup" /></button>
                                    <div className="tn btn-primary btn-sm shadow-none" style={{ "display": isShow ? "inline-block" : "none" }}>
                                        <span className="btn btn-primary mb-3" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                                </div>
                                <span className="error">{errors.errors["email"]}</span>
                            </form>
                            <div className="terms-text text-center">
                                <IntlMessages id="newsletter.foot" /> <Link to="/terms-and-conditions"><IntlMessages id="signup.terms_conditions" /></Link> <IntlMessages id="signup.and" />  <Link to="/privacy-policy"> <IntlMessages id="signup.privacy_policy" /></Link> <IntlMessages id="newsletter.optout" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
)(BecomePartner);