import React, { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { useLocation, useHistory } from "react-router";
import { ValidateToken, SaveNewPass } from "../../redux/pages/allPages";
import notification from '../../components/notification';
import { Link } from "react-router-dom";

function ResetPassword(props) {
    let history = useHistory();
    const pass = useLocation().search;
    const token = new URLSearchParams(pass).get("token");
    const customerId = new URLSearchParams(pass).get("id");
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
            console.log(result);
            if (result.data) {
                notification("success", "", "Password updated!");
                setState(prevState => ({
                    ...prevState,
                    password: "",
                    confirmPassword: ""
                }))
                setIsShow(false);
                history.push("/");
            } else {
                notification("error", "", "Token Expired!");
                history.push("/");
            }
        } else {
            setIsShow(false);
            console.log("Please enter valid password");
        }
    }


    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!state["password"]) {
            formIsValid = false;
            error["password"] = "Password is required";
        }

        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#^])([A-Za-z\d$@$!%*?&#^]{8,})$/.test(state["password"]))) {
            formIsValid = false;
            error["password"] = 'The password should contain at least one digit, one lower case, one upper case, Special Character from amongst these $@$!%*?&#^ and at least 6 from the mentioned characters.';
        }

        if (!state["confirmPassword"]) {
            formIsValid = false;
            error["confirmPassword"] = "Confirm Password is required";
        }

        if (state["confirmPassword"] !== state["password"]) {
            formIsValid = false;
            error["confirmPassword"] = 'Confirm Password not matched';
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
                        <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  Loading...</div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default ResetPassword;

