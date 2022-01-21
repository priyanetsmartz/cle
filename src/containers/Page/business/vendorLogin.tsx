import { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import IntlMessages from "../../../components/utility/intlMessages";
import notification from '../../../components/notification';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import authAction from "../../../redux/auth/actions";
import Modal from "react-bootstrap/Modal";
import ForgottenPassword from '../business/bussinessForgotpassword';
import { vendorLogin } from '../../../redux/pages/vendorLogin';
import { useHistory } from "react-router-dom";
import { useIntl } from 'react-intl';
import { sessionService } from 'redux-react-session';
import { getCookie, removeCookie, setCookie } from '../../../helpers/session';
import { apiConfig } from '../../../settings';
var CryptoJS = require("crypto-js");
const { login, vendorrrr } = authAction;

function VendorLogin(props) {
  const history = useHistory();
  const [passwordShown, setPasswordShown] = useState(false);
  const intl = useIntl();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setError] = useState({
    errors: {}
  });
  const [isShow, setIsShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPopup, setForgotPopup] = useState(false);
  useEffect(() => {
    checkIfLoggedIn();
    if (getCookie("vendorremember_me") === "true") {
      setRememberMe(true);
      let bytes = CryptoJS.AES.decrypt(getCookie("vendorpassword"), apiConfig.encryptionkey);
      let decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      setLoginForm({ email: getCookie("vendorusername"), password: decryptedData })
    } else {
      setLoginForm({ email: '', password: '' })
    }
  }, [])

  const checkIfLoggedIn = async () => {
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''));
    if (vendor && vendor.vendor_id) {
      history.push(`/vendor/dashboard`);
    }
  }
  const handleChange = (e) => {
    const { id, value } = e.target
    setLoginForm(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const loginHadler = async () => {
    if (handleValidation()) {
      
      const { login } = props;
      const userInfo = {
        "type": "user",
        "username": loginForm.email,
        "password": loginForm.password,
        "rememberme": rememberMe
      }
      // login({ userInfo });
      const result: any = await vendorLogin(userInfo);
      if (result && result.data && result.data && !result.data.message) {
        setIsShow(true);
        // console.log(result.data)
        const vendorObj = {
          vendor_id: result.data[0].vendorData.vendor_id,
          vendor_name: result.data[0].vendorData.vendor_name,
          email: result.data[0].vendorData.email,
          telephone: result.data[0].vendorData.telephone,
          country_id: result.data[0].vendorData.country_id,
          street: result.data[0].vendorData.street,
          city: result.data[0].vendorData.city,
          type: "vendor",
          showpop: result.data[0].showPopUp
        }
        props.vendorrrr(vendorObj)
        await sessionService.saveSession(vendorObj)
        await sessionService.saveUser(vendorObj)

        if (rememberMe === true) {
          let ciphertext = CryptoJS.AES.encrypt(userInfo.password, apiConfig.encryptionkey).toString();
          //  console.log(ciphertext);

          //set username and password and remember me into cookie
          setCookie("vendorusername", userInfo.username);
          setCookie("vendorpassword", ciphertext);
          setCookie("vendorremember_me", userInfo.rememberme);

        } else {
          //remove username and password and remember me from cookie
          removeCookie("vendorusername");
          removeCookie("vendorpassword");
          removeCookie("vendorremember_me");
        }

        localStorage.removeItem('cartQuoteId');
        localStorage.removeItem('cartQuoteToken');
        // localStorage.setItem('cle_vendor', JSON.stringify(vendorObj));
        // history.push(`/vendor/profile`);
        // window.location.href = '/vendor/profile';
        setTimeout(() => {
          setIsShow(false);
          history.push(`/vendor/dashboard`);
        }, 3000);

      } else {
        setIsShow(false);
        notification("warning", "", "Password not matched");
      }
    } else {
      notification("warning", "", intl.formatMessage({ id: "valiemailpass" }));
    }
  }

  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

    //Email   
    if (typeof loginForm["email"] !== "undefined") {

      if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(loginForm["email"]))) {
        formIsValid = false;
        error["email"] = "Email is not valid";
      }
    }
    if (!loginForm["email"]) {
      formIsValid = false;
      error["email"] = "Email is required";
    }

    //email
    if (!loginForm["password"]) {
      formIsValid = false;
      error["password"] = 'Password is required';
    }
    setError({ errors: error });
    return formIsValid;
  }

  const handleOnChange = checkedValues => {
    const isChecked = checkedValues.target.checked;
    if (isChecked === true) {
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  };

  const handleForgetPopup = (e) => {
    e.preventDefault();
    // props.showSignin(true);
    setForgotPopup(true);
  }

  const hideModall = () => {
    setForgotPopup(false);
  }

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <>
      <section className="designer-alphabet-list">
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <h2 className="DC-section-title"><IntlMessages id="newloginseller" /></h2>
              <p className="login-desc"><IntlMessages id="newlogin-subseller" /></p>
            </div>
          </div>
          <div className="row m-5 login-register-inputs">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div className="login-sec">
                <h3><IntlMessages id="login.button" /></h3>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="login.email" /></label>
                  <input type="email" className="form-control" id="email"
                    value={loginForm.email}
                    onChange={handleChange} aria-describedby="emailHelp" />
                  <span className="error">{errors.errors["email"]}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label"><IntlMessages id="login.password" />*</label>
                  <div className="input-group">
                    <input type={passwordShown ? "text" : "password"} className="form-control" id="password"
                      value={loginForm.password}
                      onChange={handleChange}
                      aria-describedby="basic-addon2" />
                    <span className="input-group-text" id="basic-addon2" onClick={togglePasswordVisiblity}>
                      {passwordShown ? <svg xmlns="http://www.w3.org/2000/svg" width="22.869" height="18.296" viewBox="0 0 22.869 18.296">
                        <path id="eye" d="M11.436,14.29A5.126,5.126,0,0,1,6.33,9.534l-3.748-2.9A11.91,11.91,0,0,0,1.269,8.623a1.156,1.156,0,0,0,0,1.043,11.461,11.461,0,0,0,10.167,6.339,11.1,11.1,0,0,0,2.783-.374L12.365,14.2a5.151,5.151,0,0,1-.929.093ZM22.65,16.366,18.7,13.313a11.837,11.837,0,0,0,2.9-3.647,1.156,1.156,0,0,0,0-1.043A11.461,11.461,0,0,0,11.436,2.284,11.011,11.011,0,0,0,6.172,3.631L1.626.117a.572.572,0,0,0-.8.1l-.7.9a.572.572,0,0,0,.1.8L21.246,18.172a.572.572,0,0,0,.8-.1l.7-.9A.572.572,0,0,0,22.65,16.366Zm-6.565-5.074-1.4-1.086a3.386,3.386,0,0,0-4.149-4.357,1.7,1.7,0,0,1,.333,1.008,1.667,1.667,0,0,1-.055.357L8.179,5.182A5.085,5.085,0,0,1,11.436,4a5.143,5.143,0,0,1,5.146,5.146,5.024,5.024,0,0,1-.5,2.148Z" transform="translate(-0.001 0.003)" opacity="0.33" />
                      </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20.33" height="13.554" viewBox="0 0 20.33 13.554">
                          <path id="Icon_awesome-eye" data-name="Icon awesome-eye" d="M20.208,10.761A11.321,11.321,0,0,0,10.165,4.5,11.322,11.322,0,0,0,.123,10.762a1.142,1.142,0,0,0,0,1.03,11.321,11.321,0,0,0,10.042,6.261,11.322,11.322,0,0,0,10.042-6.262A1.142,1.142,0,0,0,20.208,10.761Zm-10.042,5.6a5.083,5.083,0,1,1,5.083-5.083A5.083,5.083,0,0,1,10.165,16.359Zm0-8.471a3.364,3.364,0,0,0-.893.134,1.689,1.689,0,0,1-2.361,2.361,3.381,3.381,0,1,0,3.255-2.5Z" transform="translate(0 -4.5)" fill="#ababab" />
                        </svg>
                      }
                    </span>
                  </div>
                  <span className="error">{errors.errors["password"]}</span>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="form-check">
                      <Checkbox
                        onChange={handleOnChange}
                        checked={rememberMe}
                      >
                        <IntlMessages id="login.RememberMe" />
                      </Checkbox>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="float-end">
                      <button className="btn btn-secondary float-end" onClick={loginHadler} style={{ "display": !isShow ? "inline-block" : "none" }}>
                        <IntlMessages id="login.button" />
                      </button>
                      <div className="spinner float-end" style={{ "display": isShow ? "inline-block" : "none" }}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                        <IntlMessages id="loading" />
                      </div>
                      <Link to="#" onClick={(e) => { handleForgetPopup(e); }} className="forgot-pswd-new float-end"><IntlMessages id="forgot_pass" />?</Link>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
                {/* <div className="or-bg-new">
                <div className="or-text-new">Or</div>
              </div>
              <div className="social-login">
                <GoogleLoginButton isVendor={true} />
                <FacebookLoginButton isVendor={true} />

              </div> */}
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>

        </div>
      </section>
      {/*  forgot passord popup */}
      <Modal show={forgotPopup} className="forgot-modal" onHide={hideModall}>
        <Modal.Body className="arabic-rtl-direction">
          <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideModall} aria-label="Close"></button>
          <ForgottenPassword />
        </Modal.Body>
      </Modal>
    </>
  )
}


function mapStateToProps(state) {
  return {
    auth: state.Auth.idToken,
    loading: state.Auth.loading,
    token: state.session.user
  }
}

export default connect(
  mapStateToProps,
  { login, vendorrrr }
)(VendorLogin);