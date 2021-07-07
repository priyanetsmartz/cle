import React, { useState } from 'react';
import { connect } from "react-redux";
import IntlMessages from "../../components/utility/intlMessages";
import authAction from "../../redux/auth/actions";
const { login } = authAction;

function SignIn(props) {
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
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
    if (state.email.length && state.password.length) {
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
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Register
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
  { login }
)(SignIn);
