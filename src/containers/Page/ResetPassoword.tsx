import React, { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { useLocation } from "react-router";
import { ValidateToken, SaveNewPass } from "../../redux/pages/allPages";
import notification from '../../components/notification';


function ResetPassword(props) {
    const pass = useLocation().search;
    const token = new URLSearchParams(pass).get("token");
    const customerId = new URLSearchParams(pass).get("customerId");
    const [state, setState] = useState({
        password: "",
        confirmPassword: ""
    })
    const [errors, setError] = useState({
        errors: {}
    });

    useEffect(() => {

        async function getData() {
            let result: any = await ValidateToken(token, customerId);
            if (result.data.length > 0) {

            } else {
                notification("error", "", "No data found!");
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
        if (handleValidation()) {
            let result: any = await SaveNewPass({ email: "", resetToken: token, newPassword: state.password });
            if (result.data.length > 0) {

            } else {
                notification("error", "", "Error");
            }
        } else {
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
        <div>
            <p><IntlMessages id="forgot_pass" /></p>
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

export default ResetPassword;

