import { useState } from 'react';
import IntlMessages from "../../../components/utility/intlMessages";
import { useLocation, useHistory } from "react-router";
import notification from '../../../components/notification';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
import { vendorResetEmail } from '../../../redux/pages/vendorLogin';
import { sessionService } from 'redux-react-session';

function BusinessResetPassword(props) {
    let history = useHistory();
    const pass = useLocation().search;
    const token = new URLSearchParams(pass).get("token");
    const intl = useIntl();

    const [state, setState] = useState({
        newEmail: ""
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
            let payload = {
                confirm: token,
                new_email: state.newEmail
            }
            let result: any = await vendorResetEmail(payload);
            if (result?.data) {
                notification("success", "", intl.formatMessage({ id: "newEmailUpdate" }));
                setState(prevState => ({
                    ...prevState,
                    confirm: "",
                    new_email: ""
                }))
                setIsShow(false);
                //vendor logout
                localStorage.removeItem('redux-react-session/USER-SESSION');
                localStorage.removeItem('redux-react-session/USER_DATA');
                history.replace('/vendor-login');

                await sessionService.deleteSession();
                await sessionService.deleteUser();
            } else {
                notification("error", "", intl.formatMessage({ id: "tokenExpired" }));
                history.push("/vendor-login");
            }
        } else {
            setIsShow(false);
        }
    }


    const handleValidation = () => {
        let error = {};
        let formIsValid = true;


        if (typeof state["newEmail"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state["newEmail"]))) {
                formIsValid = false;
                error["newEmail"] = intl.formatMessage({ id: "emailvalidation" });
            }
        }
        if (!state["newEmail"]) {
            formIsValid = false;
            error["newEmail"] = intl.formatMessage({ id: "emailrequired" });
        }
        setError({ errors: error });
        return formIsValid;
    }



    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h3><IntlMessages id="myaccount.newEmail" /></h3>
                    <br />
                    <form>
                        <div className="form-group text-left">
                            <label><IntlMessages id="myaccount.confirmNewEmailAddress" /></label>
                            <input type="email"
                                className="form-control"
                                id="newEmail"
                                placeholder="Confirm new Email"
                                value={state.newEmail}
                                onChange={handleChange}
                            />
                            <span className="error">{errors.errors["newEmail"]}</span>
                        </div>
                        <br />
                        <Link to={"/"} className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}>  <IntlMessages id="retrieve_password" /></Link>
                        <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default BusinessResetPassword;

