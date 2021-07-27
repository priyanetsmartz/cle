import React, { useState } from 'react';
import { connect } from "react-redux";
import authAction from "../../redux/auth/actions";
import IntlMessages from "../../components/utility/intlMessages";
import { SendMailForgotPass } from "../../redux/pages/allPages";
import notification from '../../components/notification';


function ForgottenPassword(props) {
  const [state, setState] = useState({
    email: ""
  })
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
      let result: any = await SendMailForgotPass({ template: "email_reset", email: state.email, websiteId: 1 });
      if (result) {
        notification("success", "", "mail sent");
        setState(prevState => ({
          ...prevState,
          email: ""
        }));
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
    <div>
      <p><IntlMessages id="forgot_pass" /></p>
      <br />
      <form>
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
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          <IntlMessages id="retrieve_password" />
        </button>
      </form>
    </div>
  );
}

export default ForgottenPassword

