import React, { useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { SendMailForgotPass } from "../../redux/pages/allPages";
import notification from '../../components/notification';
import { Link } from "react-router-dom";

function ForgottenPassword(props) {
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
    setIsShow(true);
    if (handleValidation()) {
      let result: any = await SendMailForgotPass({ template: "email_reset", email: state.email, websiteId: 1 });
      if (result) {
        notification("success", "", "mail sent");
        setState(prevState => ({
          ...prevState,
          email: ""
        }));
        setIsShow(false);
      } else {
        notification("error", "", "No data found!");
      }
    } else {

      notification("error", "", "Please enter valid email");
    }
  }


  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

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

    setError({ errors: error });
    return formIsValid;
  }



  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="row">
            <div className="col-md-12">
              <h3><IntlMessages id="forgot_pass" /></h3>
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
                  placeholder="Enter email"
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
                <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  Loading...</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgottenPassword

