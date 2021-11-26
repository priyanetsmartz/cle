import { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import notification from '../../../components/notification';
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import Modal from "react-bootstrap/Modal";
import ForgottenPassword from '../forgotPassword';
import { vendorLogin } from '../../../redux/pages/vendorLogin';
import { useHistory } from "react-router-dom";
import FacebookLoginButton from '../../socialMediaLogin/FaceBook';
import GoogleLoginButton from '../../socialMediaLogin/Google';
const { login, logout ,vendorrrr} = authAction;

function VendorLogin(props) {
  const history = useHistory();
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
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setLoginForm(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const loginHadler = async () => {
    if (handleValidation()) {
      setIsShow(true);
      const { login } = props;
      const userInfo = {
        "type": "user",
        "username": loginForm.email,
        "password": loginForm.password,
        "rememberme": rememberMe
      }
      // login({ userInfo });
      const result: any = await vendorLogin(userInfo);
      if (result && result.data && result.data) {
        setIsShow(false);
        const vendorObj = {
          vendor_id: result.data[0].vendor_id,
          vendor_name: result.data[0].vendor_name,
          email: result.data[0].email,
          telephone: result.data[0].telephone,
          country_id: result.data[0].country_id,
          street : result.data[0].street,
          city : result.data[0].city,
        }
        props.vendorrrr(vendorObj)
        localStorage.setItem('cle_vendor', JSON.stringify(vendorObj));
       // history.push(`/vendor/profile`);
        window.location.href = '/vendor/profile';
        // setTimeout(() => {
        //   history.push(`/vendor/profile`);
        // }, 3000);

      }
    } else {
      notification("warning", "", "Please enter valid email and password");
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

  const hideModal = (e) => {
    setForgotPopup(false);
  }

  return (
    <section className="designer-alphabet-list">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h2 className="DC-section-title"><IntlMessages id="newloginseller" /></h2>
            <p className="login-desc"><IntlMessages id="newlogin-subseller" /></p>
          </div>
        </div>
        <div className="row m-5 login-register-inputs">
        <div className="col-md-2"></div>
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
                <label htmlFor="exampleInputPassword1" className="form-label"><IntlMessages id="login.password" /></label>
                <input type="password" className="form-control" id="password"
                  value={loginForm.password}
                  onChange={handleChange} />
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
                    <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                      <IntlMessages id="loading" />
                    </div>
                    {/* <Link onClick={(e) => { handleForgetPopup(e); }} className="forgot-pswd-new float-end"><IntlMessages id="forgot_pass" />?</Link> */}
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
          <div className="col-md-2"></div>
        </div>

      </div>
      <Modal show={forgotPopup} className="forgot-modal" onHide={hideModal}>
        <Modal.Header>
          <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideModal} aria-label="Close"></button></Modal.Header>
        <Modal.Body className="arabic-rtl-direction">
          <ForgottenPassword />
        </Modal.Body>
      </Modal>
    </section>
  )
}


function mapStateToProps(state) {
  return {
    auth: state.Auth.idToken,
    loading: state.Auth.loading,
  }
}

export default connect(
  mapStateToProps,
  { login ,vendorrrr}
)(VendorLogin);