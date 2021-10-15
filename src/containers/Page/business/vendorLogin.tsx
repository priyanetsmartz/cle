import { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import notification from '../../../components/notification';
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
const { login, logout } = authAction;

function VendorLogin(props) {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setError] = useState({
    errors: {}
  });
  const [isShow, setIsShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setLoginForm(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const loginHadler = () => {
    if (handleValidation()) {
      setIsShow(true);
      const { login } = props;
      console.log(loginForm);
      const userInfo = {
        "type": "user",
        "email": loginForm.email,
        "password": loginForm.password,
        "rememberme": rememberMe
      }
      login({ userInfo });
    }else{
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

  return (
    <section className="designer-alphabet-list">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h2 className="DC-section-title"><IntlMessages id="newlogin" /></h2>
            <p className="login-desc"><IntlMessages id="newlogin-sub" /></p>
          </div>
        </div>
        <div className="row m-5 login-register-inputs">
          <div className="col-md-6 border-end">
            <div className="login-sec">
              <h3>Login</h3>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email"
                  value={loginForm.email}
                  onChange={handleChange} aria-describedby="emailHelp" />
                <span className="error">{errors.errors["email"]}</span>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
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
                    <Link to="#" className="forgot-pswd-new float-end">forgot your password?</Link>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
              <div className="or-bg-new">
                <div className="or-text-new">Or</div>
              </div>
              <div className="social-login">
                <Link to="#">

                  <svg id="google-icon" xmlns="http://www.w3.org/2000/svg" width="18.62" height="19"
                    viewBox="0 0 18.62 19">
                    <path id="Path_299" data-name="Path 299"
                      d="M139.67,108.7a8.141,8.141,0,0,0-.2-1.942H130.55v3.526h5.236a4.643,4.643,0,0,1-1.942,3.082l-.018.118,2.82,2.185.2.02a9.289,9.289,0,0,0,2.829-6.988"
                      transform="translate(-121.05 -98.992)" fill="#4285F4" />
                    <path id="Path_300" data-name="Path 300"
                      d="M22.412,163.991a9.055,9.055,0,0,0,6.291-2.3l-3-2.322a5.623,5.623,0,0,1-3.293.95,5.719,5.719,0,0,1-5.4-3.948l-.111.009-2.932,2.269-.038.107a9.493,9.493,0,0,0,8.487,5.236"
                      transform="translate(-12.912 -144.991)" fill="#34A853" />
                    <path id="Path_301" data-name="Path 301"
                      d="M4.1,77.5a5.848,5.848,0,0,1-.317-1.879,6.146,6.146,0,0,1,.306-1.879l-.005-.126L1.11,71.312l-.1.046a9.48,9.48,0,0,0,0,8.529L4.1,77.5"
                      transform="translate(0 -66.123)" fill="#FBBC05" />
                    <path id="Path_302" data-name="Path 302"
                      d="M22.412,3.673a5.265,5.265,0,0,1,3.673,1.414L28.766,2.47A9.127,9.127,0,0,0,22.412,0a9.493,9.493,0,0,0-8.487,5.236L17,7.621a5.743,5.743,0,0,1,5.415-3.948"
                      transform="translate(-12.912)" fill="#EB4335" />
                  </svg>
                  <span>Continue with Google</span></Link>
                <Link to="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15.966" height="19" viewBox="0 0 15.966 19">
                    <path id="apple-brands"
                      d="M17.349,42.04a3.96,3.96,0,0,1,2.121-3.6,4.558,4.558,0,0,0-3.593-1.892c-1.506-.119-3.152.878-3.754.878-.636,0-2.1-.836-3.241-.836C6.515,36.632,4,38.482,4,42.244a10.572,10.572,0,0,0,.611,3.444c.543,1.557,2.5,5.374,4.547,5.311,1.069-.025,1.824-.759,3.215-.759,1.349,0,2.049.759,3.241.759,2.062-.03,3.835-3.5,4.352-5.061a4.2,4.2,0,0,1-2.617-3.9Zm-2.4-6.965A4,4,0,0,0,15.966,32a4.5,4.5,0,0,0-2.88,1.48A4.058,4.058,0,0,0,12,36.53,3.563,3.563,0,0,0,14.948,35.075Z"
                      transform="translate(-4 -32)" />
                  </svg>
                  <span>Continue with Apple</span></Link>
                <Link to="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
                    <path id="facebook"
                      d="M16.883,7.758a9.415,9.415,0,0,1,4.8,1.3,9.6,9.6,0,0,1,2.4,14.494,9.68,9.68,0,0,1-5.361,3.2V19.929h1.863L21,17.245H18.181V15.488a1.528,1.528,0,0,1,.325-1.009,1.486,1.486,0,0,1,1.192-.453h1.7V11.674q-.037-.012-.7-.093a13.83,13.83,0,0,0-1.5-.093,3.75,3.75,0,0,0-2.694.961A3.714,3.714,0,0,0,15.5,15.206v2.039H13.35v2.684H15.5v6.829a9.447,9.447,0,0,1-5.81-3.2,9.585,9.585,0,0,1,2.4-14.494,9.418,9.418,0,0,1,4.8-1.3Z"
                      transform="translate(-7.383 -7.758)" fill="#3B5998" fillRule="evenodd" />
                  </svg>
                  <span>Continue with Facebook</span></Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="login-sec">
              <h3>Create an Account</h3>

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="inputFName" className="form-label">First Name*</label>
                  <input type="email" className="form-control" id="inputFName" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputLName" className="form-label">Last Name*</label>
                  <input type="text" className="form-control" id="inputLName" />
                </div>
                <div className="col-12">
                  <label htmlFor="inputPassword4" className="form-label">Create Password* (Min 6 characters)</label>
                  <input type="password" className="form-control" id="inputPassword4" />
                </div>
                <div className="col-12">
                  <label htmlFor="inputPassword4" className="form-label">Confirm Password*</label>
                  <input type="password" className="form-control" id="inputPassword4" />
                </div>
                <div className="col-12">
                  <label htmlFor="inputState" className="form-label">Country</label>
                  <select id="inputState" className="form-select">
                    <option value="">Choose...</option>
                    <option>...</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputNumber" className="form-label">Phone Number</label>
                  <input type="text" className="form-control" id="inputNumber" />
                </div>
                <div className="col-4">

                </div>
                <div className="col-8">
                  <div className="float-end">
                    <button type="submit" className="btn btn-secondary float-end">Register</button>
                    <p className="float-end text-end">By registering you agree with our <Link to="#">Terms & Conditions</Link>
                      and <Link to="#">Privacy Policy</Link>.</p>
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="col-12 d-grid">
                  <button type="submit" className="btn btn-secondary">Are you a business? Start here</button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
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
  { login }
)(VendorLogin);