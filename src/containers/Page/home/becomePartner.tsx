import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { SendNewsletter} from '../../../redux/pages/magazineList';
import notification from '../../../components/notification';
import { getCookie } from "../../../helpers/session";


function BecomePartner(props) {
    const intl = useIntl();
    const language = getCookie('currentLanguage');
    const [radio, setRadio] = useState('Womenswear');
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
            notification("warning", "", "Please enter required values");
        }
    }

    
    const handleValidation = () => {
        let error = {};
        let formIsValid = true;
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
                                <h1>How to become a partner</h1>
                                <p>Here's How it works!</p>
                                <p>See more information in our Terms and Conditions.</p>
                                <a href="">Check out</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="banner-content-2 text-center">
                            <h4>Shop the sale first</h4>
                            <p>Sign up for exclusive early Sale access and tailored new arrivals.</p>
                            <div className="wear-ckeckbox">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" checked={radio === "Womenswear"} onChange={onValueChange} name="inlineRadioOptions" id="inlineRadio1" value="Womenswear" />
                                    <label className="form-check-label" htmlFor="inlineRadio1"><IntlMessages
                                            id="newsletter.option1" /></label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" onChange={onValueChange} name="inlineRadioOptions" id="inlineRadio2" value="Menswear" />
                                        <label className="form-check-label" htmlFor="inlineRadio2"><IntlMessages
                                            id="newsletter.option2" /></label>
                                </div>
                            </div>
                            <form className="row g-3 newsletter-signup">
                                <div className="col-auto">
                                    <label htmlFor="inputEmail" className="visually-hidden">Your Email</label>
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
                                By signing up you agree with our <a href="">Terms & Conditions</a> and <a href="">Privacy Policy</a>. To opt out, click Unsubscribe in our emails.
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