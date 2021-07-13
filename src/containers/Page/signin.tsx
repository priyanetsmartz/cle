import { Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import notification from '../../components/notification';
import IntlMessages from "../../components/utility/intlMessages";
import { getCookie } from '../../helpers/session';
import authAction from "../../redux/auth/actions";
import { Link } from "react-router-dom";
import history from './history';

const { login, logout } = authAction;

function SignIn(props) {
  const [state, setState] = useState({
    email: "",
    password: ""
  })
  const [errors, setError] = useState({
    errors: {}
  });

  const [rememberMe, setRememberMe] = useState(false);


  useEffect(() => {
    if (getCookie("remember_me") === "true") {
      setRememberMe(true);
      setState({ email: getCookie("username"), password: getCookie("password") })
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleOnChange = checkedValues => {
    const isChecked = checkedValues.target.checked;
    if (isChecked == true) {
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
      error["email"] = "Username is required";
    }

    //email
    if (!state["password"]) {
      formIsValid = false;
      error["password"] = 'Password is required';
    }
    setError({ errors: error });
    return formIsValid;
  }

  const logout = () => {
    // Clear access token and ID token from local storage
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }


  return (
    <div>
      <IntlMessages id="title" />
      <form>
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1"><IntlMessages id="login.email" /></label>
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
          <label htmlFor="exampleInputPassword1"><IntlMessages id="login.password" /></label>
          <input type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
          />
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
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          <IntlMessages id="login.button" />
        </button>

        <Link
          className="isoDropdownLink"
          onClick={logout}       >
          <IntlMessages id="logout" />
        </Link>
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
  { login, logout }
)(SignIn);
