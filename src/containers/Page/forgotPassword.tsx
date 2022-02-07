import React, { useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { SendMailForgotPass } from "../../redux/pages/allPages";
import notification from '../../components/notification';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
const { showSignin, showForgot } = appAction;
function ForgottenPassword(props) {
  let localData = localStorage.getItem('redux-react-session/USER_DATA');
  let localToken = JSON.parse((localData));
  const [deletePop, setDeletePop] = useState(false);
  // console.log(localToken)
  const intl = useIntl();
  const [state, setState] = useState({
    email1: localToken && localToken.token_email ? localToken.token_email : ""
  })
  const [showSuccess, setShowSuccess] = useState(false);
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
  const handlesigninClick = (e) => {
    e.preventDefault();
    props.showForgot(false);
    props.showSignin(true);
  }
  const handleSubmitClick = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setIsShow(true);
      let result: any = await SendMailForgotPass({ template: "email_reset", email: state.email1, websiteId: 1 });
      if (result.data && !result.data.message) {
        setShowSuccess(true)
       // notification("success", "", intl.formatMessage({ id: "forgotpassmail" }));
        setState(prevState => ({
          ...prevState,
          email1: ""
        }));
        setIsShow(false);
      } else {
        console.log(result.message)
        setState(prevState => ({
          ...prevState,
          email1: ""
        }));
        if (result.data.message === 'Request failed with status code 404' || result.data.message === 'No such entity with %fieldName = %fieldValue, %field2Name = %field2Value') {
          notification("error", "", intl.formatMessage({ id: "emailnotfound" }));
        } else {
          notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }

        setIsShow(false);
      }
    } else {

      notification("error", "", intl.formatMessage({ id: "emailvalidation" }));
    }
  }


  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

    if (typeof state["email1"] !== "undefined") {
      if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state["email1"]))) {
        formIsValid = false;
        error["email1"] = intl.formatMessage({ id: "emailvalidation" });
      }
    }
    if (!state["email1"]) {
      formIsValid = false;
      error["email1"] = intl.formatMessage({ id: "emailrequired" });
    }

    setError({ errors: error });
    return formIsValid;
  }
  const closePop = () => {
    setDeletePop(false);
  }


  return (
    <div className="container">
      <div className="row arabic-rtl-direction forgot">
        {!showSuccess && (
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12 text-center">
                <h3><IntlMessages id="forgot_pass" />?</h3>
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
                    id="email1"
                    aria-describedby="emailHelp"
                    placeholder={intl.formatMessage({ id: 'email_address' })}
                    value={state.email1}
                    onChange={handleChange}
                  />
                  <span className="error">{errors.errors["email1"]}</span>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-12">
                  {state.email1 === '' && (<Link to="#" onClick={(e) => { handlesigninClick(e); }} className="sign-in"><IntlMessages id="menu_Sign_in" /></Link>)}
                  <Link to={"/"} className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}>  <IntlMessages id="retrieve_password" /></Link>
                  <div className="spinner signup-btn" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                </div>
              </div>
            </form>
          </div>
        )}
        {showSuccess && (
          <div className="deletePopup successmail">
            <div className="modal-header flex-column">
              <i className="fas fa-envelope-open-text"></i>
              <h4 className="modal-title w-100 text-center">Check your email</h4>
            </div>
            <div className="modal-body">
              <p>Check your email for instructions on how to reset your password. We wish you a nice day!</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-secondary" onClick={(e) => { handlesigninClick(e); }} data-dismiss="modal"><IntlMessages id="menu_Sign_in" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {

  console.log(state?.App?.showForgot)

  return {}

}

export default connect(
  mapStateToProps,
  { showSignin, showForgot }
)(ForgottenPassword);


