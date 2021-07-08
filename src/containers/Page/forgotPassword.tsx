import React, { useState } from 'react';
import { connect } from "react-redux";
import authAction from "../../redux/auth/actions";
const { forgotPassowd } = authAction;

function ForgottenPassword(props) {
  const [state, setState] = useState({
    email: ""
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
    const { forgotPassowd } = props;
    if (state.email.length) {
      let lastAtPos = state.email.lastIndexOf('@');
      let lastDotPos = state.email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && state.email.indexOf('@@') == -1 && lastDotPos > 2 && (state.email.length - lastDotPos) > 2)) {
        return console.log("Please enter valid email");
      }
      const userInfo = {
        "type": "user",
        "email": state.email,
      }
      console.log(userInfo);
      forgotPassowd({ userInfo });
    } else {
      console.log("Please enter valid email");
    }
  }

  return (
    <div>
      <p>Forgot Password</p>
      <br />
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
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Retrieve Password
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

