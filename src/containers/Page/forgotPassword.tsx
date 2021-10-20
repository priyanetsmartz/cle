import React, { useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { SendMailForgotPass } from "../../redux/pages/allPages";
import notification from '../../components/notification';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';

function ForgottenPassword(props) {
  const intl = useIntl();
  const [state, setState] = useState({
    email: ""
  })
  const [isShow, setIsShow] = useState(false);
  const [errors, setError] = useState({
    errors: {}
  });

  const handleChange = (e) => {
    const { id, value } = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmitClick = async (e) => {
    e.preventDefault();    
    if (handleValidation()) {
      setIsShow(true);
      let result: any = await SendMailForgotPass({ template: "email_reset", email: state.email, websiteId: 1 });
      if (result.data) {
        notification("success", "", "mail sent");
        setState(prevState => ({
          ...prevState,
          email: ""
        }));
        setIsShow(false);
      } else {
        setState(prevState => ({
          ...prevState,
          email: ""
        }));
        notification("error", "", "No data found!");
        setIsShow(false);
      }
    } else {

      notification("error", "", "Please enter valid email");
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
    <div className="container" style={{ marginTop: '150px' }}>
      <div className="row arabic-rtl-direction">
        <div className="col-md-6 offset-md-3">
          <div className="row">
            <div className="col-md-12">
              <h3><IntlMessages id="forgot_pass" /></h3>
              <p><IntlMessages id="forgotpass-subtitle" /></p>
            </div>
          </div>
          <br />
          <form>
            <div className="row">
              <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1"><IntlMessages id="email_address" /></label>
                <input type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder={intl.formatMessage({ id: 'email_address' })}
                  value={state.email}
                  onChange={handleChange}
                />
                <span className="error">{errors.errors["email"]}</span>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-12">
                <Link to={"/"} className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}>  <IntlMessages id="retrieve_password" /></Link>
                <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgottenPassword

