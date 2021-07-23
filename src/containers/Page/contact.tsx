import React, {  useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import notification from '../../components/notification';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
// import history from './history';
import { Link } from "react-router-dom";
import { siteConfig } from '../../settings/';
import { useIntl } from 'react-intl';
const { openSignUp } = appAction;

function ContactUS(props) {
    const intl = useIntl();
    const [state, setState] = useState({
        name: "",
        email: "",
        message: ""
    })
    const [errors, setError] = useState({
        errors: {}
    });
    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        //Email   
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

        //password
        if (!state["name"]) {
            formIsValid = false;
            error["name"] = 'Name is required';
        }

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = 'Message is required';
        }


        setError({ errors: error });
        return formIsValid;
    }
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    // const selectType = (e) => {
    //     const value = e.target.value;
    //     setState(prevState => ({
    //         ...prevState,
    //         ['type']: value
    //     }))
    // }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        //  const { register } = props;
        if (handleValidation()) {
            // const userInfo = {
            //     "name": state.name,
            //     "email": state.email,
            //     "password": state.message
            // }
            // // register({ userInfo });
        } else {
            notification("warning", "", "Please enter required values");
        }
    }
    return (
        <div className="container about-inner"  >
            <figure className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                    <text id="Contact Us" data-name="Contact Us" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                        strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                        <tspan x="-423.555" y="0">Contact Us</tspan>
                    </text>
                </svg>
            </figure>
            <div className="row" style={{ marginTop: "80px" }}>
                <div className="col-md-5 offset-md-1">
                    <div className="blue-back-image" style={{ background: "#fff" }}>
                        <div className="about-inner-pic">
                            <div className="row g-3">
                                <h3>Reach to Us</h3>
                                <div className="col-sm-12">
                                    <input type="email"
                                        className="form-control"
                                        id="name"
                                        aria-describedby="namw"
                                        placeholder={intl.formatMessage({ id: 'contact.name' })}
                                        value={state.name}
                                        onChange={handleChange}
                                    />
                                    <span className="error">{errors.errors["name"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <input type="text"
                                        className="form-control"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder={intl.formatMessage({ id: 'contact.email' })}
                                        value={state.email}
                                        onChange={handleChange}
                                    />
                                    <span className="error">{errors.errors["email"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <input type="text"
                                        className="form-control"
                                        id="message"
                                        aria-describedby="message"
                                        placeholder={intl.formatMessage({ id: 'contact.message' })}
                                        value={state.message}
                                        onChange={handleChange}
                                    />
                                    <span className="error">{errors.errors["message"]}</span>
                                </div>
                                <div className="d-grid gap-2">
                                    <Link to="/" className="signup-btn" onClick={handleSubmitClick}> <IntlMessages id="contact.send" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 offset-md-1">
                    <div className="about-content">
                        <h3>Contact us</h3>
                        <ul className="footer-address">
                            <li><IntlMessages id="footer.address" /><br />
                                <IntlMessages id="footer.address2" /><br />
                                <a href="tel:(+966) 920 002 470">(+966) 920 002 470</a></li>
                            <li>
                                <Link to={{ pathname: siteConfig.facebookLink }} target="_blank" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21.42" height="21.419" viewBox="0 0 21.42 21.419">
                                        <path id="facebook" d="M18.093,7.758A10.614,10.614,0,0,1,23.5,9.229,10.818,10.818,0,0,1,26.2,25.568a10.912,10.912,0,0,1-6.043,3.609v-7.7h2.1l.475-3.025h-3.18V16.472a1.722,1.722,0,0,1,.366-1.138,1.675,1.675,0,0,1,1.344-.511h1.921v-2.65q-.041-.013-.784-.105a15.591,15.591,0,0,0-1.692-.105,4.228,4.228,0,0,0-3.038,1.083,4.187,4.187,0,0,0-1.141,3.108v2.3H14.11v3.025h2.42v7.7a10.65,10.65,0,0,1-6.549-3.609,10.805,10.805,0,0,1,2.706-16.34,10.617,10.617,0,0,1,5.406-1.471Z" transform="translate(-7.383 -7.758)" fill="#2E2BAA" fillRule="evenodd" />
                                    </svg>
                                </Link>
                                <Link to={{ pathname: siteConfig.instagram }} target="_blank" >
                                    <svg id="instagram" xmlns="http://www.w3.org/2000/svg" width="21.419" height="21.419" viewBox="0 0 21.419 21.419">
                                        <g id="Group_34" data-name="Group 34">
                                            <g id="Group_33" data-name="Group 33" transform="translate(0)">
                                                <path id="Path_15" data-name="Path 15" d="M16.069,0H5.36A5.371,5.371,0,0,0,0,5.355v10.71A5.371,5.371,0,0,0,5.36,21.419h10.71a5.371,5.371,0,0,0,5.355-5.355V5.355A5.371,5.371,0,0,0,16.069,0Zm3.57,16.065a3.574,3.574,0,0,1-3.57,3.57H5.36a3.574,3.574,0,0,1-3.57-3.57V5.355a3.574,3.574,0,0,1,3.57-3.57h10.71a3.573,3.573,0,0,1,3.57,3.57v10.71Z" transform="translate(-0.005)" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                        <g id="Group_36" data-name="Group 36" transform="translate(15.173 3.57)">
                                            <g id="Group_35" data-name="Group 35">
                                                <ellipse id="Ellipse_1" data-name="Ellipse 1" cx="1.339" cy="1.339" rx="1.339" ry="1.339" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                        <g id="Group_38" data-name="Group 38" transform="translate(5.355 5.355)">
                                            <g id="Group_37" data-name="Group 37">
                                                <path id="Path_16" data-name="Path 16" d="M107.76,102.4a5.355,5.355,0,1,0,5.355,5.355A5.354,5.354,0,0,0,107.76,102.4Zm0,8.925a3.57,3.57,0,1,1,3.57-3.57A3.57,3.57,0,0,1,107.76,111.325Z" transform="translate(-102.405 -102.4)" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                    </svg>
                                </Link>
                                <Link to={{ pathname: siteConfig.linkedin }} target="_blank" >
                                    <svg id="_x31_0.Linkedin" xmlns="http://www.w3.org/2000/svg" width="21.472" height="21.472" viewBox="0 0 21.472 21.472">
                                        <path id="Path_17" data-name="Path 17" d="M52.176,49.981V42.117c0-3.865-.832-6.817-5.341-6.817a4.66,4.66,0,0,0-4.214,2.308h-.054V35.649H38.3V49.981h4.455V42.869c0-1.879.349-3.677,2.657-3.677,2.281,0,2.308,2.12,2.308,3.784v6.978h4.455Z" transform="translate(-30.704 -28.51)" fill="#2E2BAA" />
                                        <path id="Path_18" data-name="Path 18" d="M11.3,36.6h4.455V50.932H11.3Z" transform="translate(-10.951 -29.461)" fill="#2E2BAA" />
                                        <path id="Path_19" data-name="Path 19" d="M12.577,10a2.59,2.59,0,1,0,2.577,2.577A2.577,2.577,0,0,0,12.577,10Z" transform="translate(-10 -10)" fill="#2E2BAA" />
                                    </svg>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        state
    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(ContactUS);