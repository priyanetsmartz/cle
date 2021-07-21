import { Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import notification from '../../components/notification';
import IntlMessages from "../../components/utility/intlMessages";
import { getCookie } from '../../helpers/session';
import authAction from "../../redux/auth/actions";
import { Link } from "react-router-dom";
import appAction from "../../redux/app/actions";
import history from './history';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../image/CLE-logo-black.svg";
import FacebookLoginButton from '../socialMediaLogin/FaceBook';
import GoogleLoginButton from '../socialMediaLogin/Google';
import AppleSigninButton from '../socialMediaLogin/AppleSigninButton';
import { useIntl } from 'react-intl';
const { showSignin } = appAction;
const { login, logout } = authAction;

function SignIn(props) {
  const [state, setState] = useState({
    email: "",
    password: ""
  })
  const [errors, setError] = useState({
    errors: {}
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  useEffect(() => {
    if (getCookie("remember_me") === "true") {
      setRememberMe(true);
      setState({ email: getCookie("username"), password: getCookie("password") })
    }
  }, []);

  // useEffect(() => {
  //   if (!props.auth && props.loading) {
  //     setIsLoaded(props.showLogin)
  //   } else {
  //     setIsLoaded(false)
  //   }
  // }, [props.auth])

  useEffect(() => {
    setIsLoaded(props.showLogin)
  }, [props.showLogin])


  const handleChange = (e) => {
    const { id, value } = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleOnChange = checkedValues => {
    const isChecked = checkedValues.target.checked;
    if (isChecked === true) {
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  };


  const handleSubmitClick = (e) => {
    e.preventDefault();
    const { login } = props;
    if (handleValidation()) {
      const userInfo = {
        "type": "user",
        "email": state.email,
        "password": state.password,
        "rememberme": rememberMe
      }
      login({ userInfo });
    } else {
      notification("warning", "", "Please enter valid username and password");
    }
  }


  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

    //Email   
    // if (typeof state["email"] !== "undefined") {
    //   let lastAtPos = state["email"].lastIndexOf('@');
    //   let lastDotPos = state["email"].lastIndexOf('.');

    //   if (!(lastAtPos < lastDotPos && lastAtPos > 0 && state["email"].indexOf('@@') == -1 && lastDotPos > 2 && (state["email"].length - lastDotPos) > 2)) {
    //     formIsValid = false;
    //     error["email"] = "Email is not valid";
    //   }
    // }
    if (!state["email"]) {
      formIsValid = false;
      error["email"] = "Email is required";
    }

    //email
    if (!state["password"]) {
      formIsValid = false;
      error["password"] = 'Password is required';
    }
    setError({ errors: error });
    return formIsValid;
  }
  
  const hideModal = () => {
    const { showSignin } = props;
    showSignin(false);
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const intl = useIntl();

  return (
    <Modal show={isLoaded} onHide={hideModal}>
      <Modal.Header> <img src={logo} alt="logo" />
        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideModal} aria-label="Close"></button></Modal.Header>
      <Modal.Body><h2><IntlMessages id="login.title" /></h2>
        <p><IntlMessages id="login.subtitle" /></p>
        <div className="row g-3">
          <div className="col-sm-12">
            {/* <input type="text" className="form-control" placeholder="Email Address*" aria-label="Email" /> */}
            <input type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder={intl.formatMessage({ id: "login.email" })}
              value={state.email}
              onChange={handleChange}
            />
            <span className="error">{errors.errors["email"]}</span>
          </div>
          <div className="input-group col-sm-12">
            <input type={passwordShown ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder={intl.formatMessage({ id: "login.password" })}
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
          <div className="form-group text-left">
            <div className="checkbox ">
              <Checkbox
                onChange={handleOnChange}
                checked={rememberMe}
              >
                <IntlMessages id="login.RememberMe" />
              </Checkbox>
            </div>
          </div>
          <div className="d-grid gap-2">
            <Link to={"#"} className="signup-btn" onClick={handleSubmitClick}> <IntlMessages id="login.button" /></Link>
          </div>
        </div>
        <div className="or-bg">
          <div className="or-text"><IntlMessages id="signup.or" /></div>
        </div>
        <div className="social-login">
          <GoogleLoginButton />
          <AppleSigninButton />
          <FacebookLoginButton />
        </div>
        <p className="signup-policy-links"> <IntlMessages id="signup.by_registering_you_agree" /> <Link to={"/terms-and-conditions"}><IntlMessages id="signup.terms_conditions" /></Link>  <IntlMessages id="signup.and" /> <Link to={"/privacy-policy-cookie-restriction-mode"}><IntlMessages id="signup.privacy_policy" /></Link>.</p></Modal.Body>
      <Modal.Footer><Link to={"#"} className="sign-in-M"><IntlMessages id="signup.member_sign_in" /></Link><Link to={"#"} className="B-partner"><IntlMessages id="signup.become_partner" /></Link></Modal.Footer>
    </Modal>
  );
}

function mapStateToProps(state) {
 // console.log(state);
  return {
    auth: state.Auth.idToken,
    loading: state.Auth.loading
  }
}

export default connect(
  mapStateToProps,
  { login, logout, showSignin }
)(SignIn);
