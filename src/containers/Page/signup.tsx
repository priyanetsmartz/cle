import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import IntlMessages from "../../components/utility/intlMessages";
import authAction from "../../redux/auth/actions";
import appAction from "../../redux/app/actions";
import notification from '../../components/notification';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../image/CLE-logo-black.svg";
import FacebookLoginButton from '../socialMediaLogin/FaceBook';
import GoogleLoginButton from '../socialMediaLogin/Google';
import AppleSigninButton from '../socialMediaLogin/AppleSigninButton';
import { useIntl } from 'react-intl';
import { Link } from "react-router-dom";
const { register } = authAction;
const { showSignin, openSignUp, toggleOpenDrawer } = appAction;


function RegistrationForm(props) {
    const intl = useIntl();
    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        type: 1,
        storeId: ""
    })
    const [isLoaded, setIsLoaded] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [errors, setError] = useState({
        errors: {}
    });



    useEffect(() => {
        setIsLoaded(props.signupModel)
    }, [props.signupModel])

    useEffect(() => {
        setIsShow(props.loading);
    }, [props.loading])

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;
        if (!state["first_name"]) {
            formIsValid = false;
            error["first_name"] = 'First Name is required';
        }

        if (!state["last_name"]) {
            formIsValid = false;
            error["last_name"] = 'Last Name is required';
        }

        //Email   
        if (typeof state["email"] !== "undefined") {
            let lastAtPos = state["email"].lastIndexOf('@');
            let lastDotPos = state["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && state["email"].indexOf('@@') === -1 && lastDotPos > 2 && (state["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                error["email"] = "Email is not valid";
            }
        }
        if (!state["email"]) {
            formIsValid = false;
            error["email"] = "Email is required";
        }

        if (state["confirmPassword"] !== state["password"]) {
            formIsValid = false;
            error["confirmPassword"] = 'confirm password not matched';
        }

        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#^])([A-Za-z\d$@$!%*?&#^]{6,})$/.test(state["password"]))) {
            formIsValid = false;
            error["password"] = 'The password should contain at least one digit, one lower case, one upper case, Special Character from amongst these $@$!%*?&#^ and at least 6 from the mentioned characters.';
        }

        //password
        if (!state["password"]) {
            formIsValid = false;
            error["password"] = 'Password is required';
        }


        if (!state["confirmPassword"]) {
            formIsValid = false;
            error["confirmPassword"] = 'Confirm Password is required';
        }



        setError({ errors: error });
        setIsShow(false);
        return formIsValid;
    }
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const handlesigninClick = (e) => {
        e.preventDefault();
        props.openSignUp(false);
        //  props.toggleOpenDrawer(false);
        props.showSignin(true);
    }
    const handleContact = (e) => {
        props.openSignUp(false);
    }
    const handleSubmitClick = (e) => {
        setIsShow(true);
        e.preventDefault();
        const { register } = props;
        if (handleValidation()) {
            const userInfo = {
                "first_name": state.first_name,
                "last_name": state.last_name,
                "email": state.email,
                "password": state.password,
                "type": props.userSetype,
                "storeId": props.languages
            }
            register({ userInfo });
        } else {
            notification("warning", "", "Please enter required values");
        }
    }

    const hideModal = () => {
        setError({ errors: {} });
        setState({
            email: "",
            password: "",
            confirmPassword: "",
            type: 1,
            first_name: "",
            last_name: "",
            storeId: ""
        })
        const { openSignUp } = props;
        openSignUp(false);
    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const togglePasswordVisiblityConfirm = () => {
        setConfirmPasswordShown(confirmPasswordShown ? false : true);
    };
    return (
        <Modal show={isLoaded} onHide={hideModal}>
            <Modal.Header> <img src={logo} alt="logo" />
                <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideModal} aria-label="Close"></button></Modal.Header>
            <Modal.Body><h2><IntlMessages id="signup.sign_up" /></h2>
                <p><IntlMessages id="signup.be_the_first_one" /></p>
                <div className="row g-3">
                    <div className="col-sm-12">
                        <input type="text"
                            className="form-control"
                            id="first_name"
                            aria-describedby="nameHelp"
                            placeholder={intl.formatMessage({ id: 'register.first_name' })}
                            value={state.first_name}
                            onChange={handleChange}
                        />
                        <span className="error">{errors.errors["first_name"]}</span>
                    </div>
                    <div className="col-sm-12">
                        <input type="text"
                            className="form-control"
                            id="last_name"
                            aria-describedby="nameHelp"
                            placeholder={intl.formatMessage({ id: 'register.last_name' })}
                            value={state.last_name}
                            onChange={handleChange}
                        />
                        <span className="error">{errors.errors["last_name"]}</span>
                    </div>
                    <div className="col-sm-12">
                        <input type="email"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder={intl.formatMessage({ id: 'register.email' })}
                            value={state.email}
                            onChange={handleChange}
                        />
                        <span className="error">{errors.errors["email"]}</span>
                    </div>
                    <div className="input-group col-sm-12">
                        <input type={passwordShown ? "text" : "password"}
                            className="form-control"
                            id="password"
                            placeholder={intl.formatMessage({ id: 'register.password' })}
                            value={state.password}
                            onChange={handleChange}
                            aria-describedby="basic-addon2"
                        />
                        {/* <input type="text" className="form-control" placeholder="Create Password* (Min 6 Character)" aria-label="Create Password" aria-describedby="basic-addon2" /> */}
                        <span className="input-group-text" id="basic-addon2" onClick={togglePasswordVisiblity}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22.869" height="18.296" viewBox="0 0 22.869 18.296">
                                <path id="eye" d="M11.436,14.29A5.126,5.126,0,0,1,6.33,9.534l-3.748-2.9A11.91,11.91,0,0,0,1.269,8.623a1.156,1.156,0,0,0,0,1.043,11.461,11.461,0,0,0,10.167,6.339,11.1,11.1,0,0,0,2.783-.374L12.365,14.2a5.151,5.151,0,0,1-.929.093ZM22.65,16.366,18.7,13.313a11.837,11.837,0,0,0,2.9-3.647,1.156,1.156,0,0,0,0-1.043A11.461,11.461,0,0,0,11.436,2.284,11.011,11.011,0,0,0,6.172,3.631L1.626.117a.572.572,0,0,0-.8.1l-.7.9a.572.572,0,0,0,.1.8L21.246,18.172a.572.572,0,0,0,.8-.1l.7-.9A.572.572,0,0,0,22.65,16.366Zm-6.565-5.074-1.4-1.086a3.386,3.386,0,0,0-4.149-4.357,1.7,1.7,0,0,1,.333,1.008,1.667,1.667,0,0,1-.055.357L8.179,5.182A5.085,5.085,0,0,1,11.436,4a5.143,5.143,0,0,1,5.146,5.146,5.024,5.024,0,0,1-.5,2.148Z" transform="translate(-0.001 0.003)" opacity="0.33" />
                            </svg>
                        </span>
                        <span className="error">{errors.errors["password"]}</span>
                    </div>
                    <div className="input-group col-sm-12">
                        <input type={confirmPasswordShown ? "text" : "password"}
                            className="form-control"
                            placeholder={intl.formatMessage({ id: 'register.confirmPassword' })}
                            aria-label="Confirm Password"
                            aria-describedby="basic-addon2"
                            id="confirmPassword"
                            value={state.confirmPassword}
                            onChange={handleChange} />
                        <span className="input-group-text" id="basic-addon2" onClick={togglePasswordVisiblityConfirm}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22.869" height="18.296" viewBox="0 0 22.869 18.296">
                                <path id="eye"
                                    d="M11.436,14.29A5.126,5.126,0,0,1,6.33,9.534l-3.748-2.9A11.91,11.91,0,0,0,1.269,8.623a1.156,1.156,0,0,0,0,1.043,11.461,11.461,0,0,0,10.167,6.339,11.1,11.1,0,0,0,2.783-.374L12.365,14.2a5.151,5.151,0,0,1-.929.093ZM22.65,16.366,18.7,13.313a11.837,11.837,0,0,0,2.9-3.647,1.156,1.156,0,0,0,0-1.043A11.461,11.461,0,0,0,11.436,2.284,11.011,11.011,0,0,0,6.172,3.631L1.626.117a.572.572,0,0,0-.8.1l-.7.9a.572.572,0,0,0,.1.8L21.246,18.172a.572.572,0,0,0,.8-.1l.7-.9A.572.572,0,0,0,22.65,16.366Zm-6.565-5.074-1.4-1.086a3.386,3.386,0,0,0-4.149-4.357,1.7,1.7,0,0,1,.333,1.008,1.667,1.667,0,0,1-.055.357L8.179,5.182A5.085,5.085,0,0,1,11.436,4a5.143,5.143,0,0,1,5.146,5.146,5.024,5.024,0,0,1-.5,2.148Z"
                                    transform="translate(-0.001 0.003)" opacity="0.33" />
                            </svg>
                        </span>
                        <span className="error">{errors.errors["confirmPassword"]}</span>
                    </div>
                    <div className="d-grid gap-2">
                        <Link to="/" className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}> <IntlMessages id="signup.sign_up" /></Link>
                        <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  Loading...</div>
                    </div>
                </div>
                <div className="or-bg">
                    <div className="or-text"> <IntlMessages id="signup.or" /></div>
                </div>
                <div className="social-login">
                    <GoogleLoginButton />
                    {/* <AppleSigninButton /> */}
                    <FacebookLoginButton />
                </div>
                <p className="signup-policy-links"> <IntlMessages id="signup.by_registering_you_agree" />  <Link to="/terms-and-conditions" target="_blank" ><IntlMessages id="signup.terms_conditions" /></Link>  <IntlMessages id="signup.and" /> <Link to={"/privacy-policy"} target="_blank"><IntlMessages id="signup.privacy_policy" /></Link>.</p></Modal.Body>
            <Modal.Footer className="signup_footer"> <Link to="#" onClick={(e) => { handlesigninClick(e); }} className="sign-in-M"><IntlMessages id="signup.member_sign_in" /></Link><Link to="/contact-us" onClick={handleContact} className="B-partner"><IntlMessages id="signup.become_partner" /></Link></Modal.Footer>
        </Modal>
    )
}



const mapStateToProps = state => ({
    auth: state.Auth.idToken,
    errors: state.errors,
    loading: state.Auth.loading,
    userSetype: state.App.userType,
    languages: state.LanguageSwitcher.language
    // loginerror:state.errors.loginerror
});

export default connect(
    mapStateToProps,
    { register, showSignin, openSignUp, toggleOpenDrawer }
)(RegistrationForm);
