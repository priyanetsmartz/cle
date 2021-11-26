import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { useLocation, useHistory } from "react-router";
import { ValidateToken, SaveNewPass } from "../../redux/pages/allPages";
import notification from '../../components/notification';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
function ResetPassword(props) {
    let history = useHistory();
    const pass = useLocation().search;
    const token = new URLSearchParams(pass).get("token");
    const customerId = new URLSearchParams(pass).get("id");
    const intl = useIntl();
    // console.log(token, customerId);

    const [state, setState] = useState({
        password: "",
        confirmPassword: ""
    })
    const [isShow, setIsShow] = useState(false);
    const [errors, setError] = useState({
        errors: {}
    });

    useEffect(() => {
        async function getData() {
            try {
                let result: any = await ValidateToken(token, customerId);
                if (result) {

                }
            } catch (err) {
                history.push("password-link-expired");
            }
        }
        getData()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])

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
            let result: any = await SaveNewPass({ email: "", resetToken: token, newPassword: state.password });
            //   console.log(result);
            if (result.data) {
                notification("success", "", intl.formatMessage({ id: "resetPassword" }));
                setState(prevState => ({
                    ...prevState,
                    password: "",
                    confirmPassword: ""
                }))
                setIsShow(false);
                history.push("/");
            } else {
                notification("error", "", intl.formatMessage({ id: "tokenExpired" }));
                history.push("/");
            }
        } else {
            setIsShow(false);
            notification("error", "", intl.formatMessage({ id: "validPass" }));
        }
    }


    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!state["password"]) {
            formIsValid = false;
            error["password"] = intl.formatMessage({ id: "passwordreq" });
        }

        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#^])([A-Za-z\d$@$!%*?&#^]{8,})$/.test(state["password"]))) {
            formIsValid = false;
            error["password"] = intl.formatMessage({ id: "passwordvalidation" });
        }

        if (!state["confirmPassword"]) {
            formIsValid = false;
            error["confirmPassword"] = intl.formatMessage({ id: "confirmpasswordreq" });
        }

        if (state["confirmPassword"] !== state["password"]) {
            formIsValid = false;
            error["confirmPassword"] = intl.formatMessage({ id: "confirmpasswordnotmatched" });
        }

        setError({ errors: error });
        return formIsValid;
    }



    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h3><IntlMessages id="reset_pass" /></h3>
                    <br />
                    <form>
                        <div className="form-group text-left">
                            <label><IntlMessages id="register.password" /></label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                value={state.password}
                                onChange={handleChange}
                            />
                            <span className="error">{errors.errors["password"]}</span>
                        </div>
                        <br />
                        <div className="form-group text-left">
                            <label><IntlMessages id="register.confirmPassword" /></label>
                            <input type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Enter Confirm Password"
                                value={state.confirmPassword}
                                onChange={handleChange}
                            />
                            <span className="error">{errors.errors["confirmPassword"]}</span>
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

export default ResetPassword;

