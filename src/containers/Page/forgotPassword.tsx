import React, { useState } from 'react';
import { connect } from "react-redux";
import authAction from "../../redux/auth/actions";
import IntlMessages from "../../components/utility/intlMessages";
const { forgotPassowd } = authAction;

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

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const { forgotPassowd } = props;
    if (handleValidation()) {
      const userInfo = {
        "type": "user",
        "email": state.email
      }
      forgotPassowd({ userInfo });
    } else {
      console.log("Please enter valid email");
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
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  // loginerror:state.errors.loginerror
});
export default connect(
  mapStateToProps,
  { forgotPassowd }
)(ForgottenPassword);

