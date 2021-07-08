import React, { useState } from 'react';
import { connect } from "react-redux";
import IntlMessages from "../../components/utility/intlMessages";
import authAction from "../../redux/auth/actions";
const { login } = authAction;

function SignIn(props) {
  const [state, setState] = useState({
    email: "",
    password: ""
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
    const { login } = props;
    if (handleValidation()) {
      const userInfo = {
        "type": "user",
        "email": state.email,
        "password": state.password,
      }
      login({ userInfo });
    } else {
      console.log("Please enter valid username and password");
    }
  }


  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

    //Email   
    if (typeof state["email"] !== "undefined") {
      let lastAtPos = state["email"].lastIndexOf('@');
      let lastDotPos = state["email"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && state["email"].indexOf('@@') == -1 && lastDotPos > 2 && (state["email"].length - lastDotPos) > 2)) {
        formIsValid = false;
        error["email"] = "Email is not valid";
      }
    }
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

  
  return (
    <div>
      <IntlMessages id="title" />
      <form>
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1">Email address</label>
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
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
          />
          <span className="error">{errors.errors["password"]}</span>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          login
        </button>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  // errors: state.errors,
  // loginerror:state.errors.loginerror
});
export default connect(
  mapStateToProps,
  { login }
)(SignIn);
