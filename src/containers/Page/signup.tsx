import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { FacebookShareButton, TwitterShareButton } from "react-share";
import IntlMessages from "../../components/utility/intlMessages";
import { Button, Select } from 'antd';
import AppleSigninButton from '../AppleSigninButton';
import authAction from "../../redux/auth/actions";
import notification from '../../components/notification';
import Login from "../../redux/auth/Login";
import CleLogoBlack from "../../image/CLE-logo-black.svg";
const { register } = authAction;
const loginApi = new Login();

function RegistrationForm(props) {

    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        type: -1
    })
    const [errors, setError] = useState({
        errors: {}
    });
    const [types, SetTypes] = useState([])
    interface customerType {
        items?: {
            code?: string
            id?: number
            tax_class_id?: number
            tax_class_name?: string
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function loadData(value = "") {
        const results: any = await loginApi.getCustomerType();
        var jsonData = results.data.items;
        SetTypes(jsonData);
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

        if (state["confirmPassword"] !== state["password"]) {
            formIsValid = false;
            error["confirmPassword"] = 'confirm password not matched';
        }

        //password
        if (!state["password"]) {
            formIsValid = false;
            error["password"] = 'Password is required';
        }

        if (!state["confirmPassword"]) {
            formIsValid = false;
            error["confirmPassword"] = 'Confirm Password is required';
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

    const selectType = (e) => {
        const value = e.target.value;
        console.log(value);
        setState(prevState => ({
            ...prevState,
            ['type']: value
        }))
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        const { register } = props;
        if (handleValidation()) {
            const userInfo = {
                "email": state.email,
                "password": state.password,
                "type": state.type
            }
            console.log(userInfo);
            register({ userInfo });
        } else {
            notification("warning", "", "Please enter required values");
        }
    }
    const responseGoogle = (response) => {
        console.log(response);
    }

    const responseFacebook = (response) => {
        console.log(response);
    }

    const componentClicked = (response) => {
        console.log(response);
    }

    // const signup = (res) => {
    //    // console.log(res);
    //     const googleresponse = {
    //         Name: res.profileObj.name,
    //         email: res.profileObj.email,
    //         token: res.googleId,
    //         Image: res.profileObj.imageUrl,
    //         ProviderId: 'Google'
    //     };
    // }

    // const [authOptions, setAuthOptions] = useState({
    //     clientId: 'com.example.web',
    //     scope: 'email name',
    //     redirectURI: 'https://example.com',
    //     state: '',
    //     nonce: 'nonce',
    //     usePopup: true,
    //     onSuccess: '',
    //     onError: '',
    //     iconProps: ''
    // });
    // const [extraProps, setExtraProps] = useState({
    //     uiType: 'dark',
    //     className: 'apple-auth-btn',
    //     noDefaultStyle: false,
    //     buttonExtraChildren: 'Continue with Apple',
    // });
    // const [codeString, setCodeString] = useState('');

    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <img src={CleLogoBlack} />
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                </div>
                <div className="modal-body signup_inner">
                    <h2>Sign Up</h2>
                    <p>& be the first one to know about our launch</p>
                    <div className="row g-3">
                        <div className="col-sm-12">
                            <input type="text" className="form-control" placeholder="Email Address*" aria-label="Email" id="email"
                                aria-describedby="emailHelp"
                                value={state.email}
                                onChange={handleChange} />
                            {/* <span className="error">{errors.errors["email"]}</span> */}
                        </div>
                        <div className="input-group col-sm-12">
                            <input type="password" className="form-control" placeholder="Create Password* (Min 6 Character)"
                                aria-label="Create Password" aria-describedby="basic-addon2" id="password"
                                value={state.password}
                                onChange={handleChange} />
                            {/* <span className="error">{errors.errors["password"]}</span> */}
                            <span className="input-group-text" id="basic-addon2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22.869" height="18.296" viewBox="0 0 22.869 18.296">
                                    <path id="eye"
                                        d="M11.436,14.29A5.126,5.126,0,0,1,6.33,9.534l-3.748-2.9A11.91,11.91,0,0,0,1.269,8.623a1.156,1.156,0,0,0,0,1.043,11.461,11.461,0,0,0,10.167,6.339,11.1,11.1,0,0,0,2.783-.374L12.365,14.2a5.151,5.151,0,0,1-.929.093ZM22.65,16.366,18.7,13.313a11.837,11.837,0,0,0,2.9-3.647,1.156,1.156,0,0,0,0-1.043A11.461,11.461,0,0,0,11.436,2.284,11.011,11.011,0,0,0,6.172,3.631L1.626.117a.572.572,0,0,0-.8.1l-.7.9a.572.572,0,0,0,.1.8L21.246,18.172a.572.572,0,0,0,.8-.1l.7-.9A.572.572,0,0,0,22.65,16.366Zm-6.565-5.074-1.4-1.086a3.386,3.386,0,0,0-4.149-4.357,1.7,1.7,0,0,1,.333,1.008,1.667,1.667,0,0,1-.055.357L8.179,5.182A5.085,5.085,0,0,1,11.436,4a5.143,5.143,0,0,1,5.146,5.146,5.024,5.024,0,0,1-.5,2.148Z"
                                        transform="translate(-0.001 0.003)" opacity="0.33" />
                                </svg>
                            </span>
                        </div>
                        <div className="input-group col-sm-12">
                            <input type="password" className="form-control" placeholder="Confirm Password* (Min 6 Character)"
                                aria-label="Confirm Password" aria-describedby="basic-addon2" id="confirmPassword"
                                value={state.confirmPassword}
                                onChange={handleChange} />
                            {/* <span className="error">{errors.errors["confirmPassword"]}</span> */}
                            <span className="input-group-text" id="basic-addon2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22.869" height="18.296" viewBox="0 0 22.869 18.296">
                                    <path id="eye"
                                        d="M11.436,14.29A5.126,5.126,0,0,1,6.33,9.534l-3.748-2.9A11.91,11.91,0,0,0,1.269,8.623a1.156,1.156,0,0,0,0,1.043,11.461,11.461,0,0,0,10.167,6.339,11.1,11.1,0,0,0,2.783-.374L12.365,14.2a5.151,5.151,0,0,1-.929.093ZM22.65,16.366,18.7,13.313a11.837,11.837,0,0,0,2.9-3.647,1.156,1.156,0,0,0,0-1.043A11.461,11.461,0,0,0,11.436,2.284,11.011,11.011,0,0,0,6.172,3.631L1.626.117a.572.572,0,0,0-.8.1l-.7.9a.572.572,0,0,0,.1.8L21.246,18.172a.572.572,0,0,0,.8-.1l.7-.9A.572.572,0,0,0,22.65,16.366Zm-6.565-5.074-1.4-1.086a3.386,3.386,0,0,0-4.149-4.357,1.7,1.7,0,0,1,.333,1.008,1.667,1.667,0,0,1-.055.357L8.179,5.182A5.085,5.085,0,0,1,11.436,4a5.143,5.143,0,0,1,5.146,5.146,5.024,5.024,0,0,1-.5,2.148Z"
                                        transform="translate(-0.001 0.003)" opacity="0.33" />
                                </svg>
                            </span>
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor="type">Type</label>
                            <select value={state.type} onChange={selectType}>
                                <option key="-1" value="--">---</option>
                                {types.map(item => {
                                    return (<option key={item.id} value={item.id}>{item.code}</option>);
                                })}
                            </select>
                            {/* <span className="error">{errors.errors["type"]}</span> */}
                        </div>

                        <div className="d-grid gap-2">
                            <a className="signup-btn" onClick={handleSubmitClick}>Sign up</a>
                        </div>
                    </div>
                    <div className="or-bg">
                        <div className="or-text">Or</div>
                    </div>
                    <div className="social-login">
                        <GoogleLogin
                            clientId="788786912619-k4tb19vgofvmn97q1vsti1u8fnf8j6pa.apps.googleusercontent.com"
                            render={renderProps => (
                                <a onClick={renderProps.onClick}>
                                    <svg id="google-icon" xmlns="http://www.w3.org/2000/svg" width="18.62" height="19"
                                        viewBox="0 0 18.62 19">
                                        <path id="Path_299" data-name="Path 299"
                                            d="M139.67,108.7a8.141,8.141,0,0,0-.2-1.942H130.55v3.526h5.236a4.643,4.643,0,0,1-1.942,3.082l-.018.118,2.82,2.185.2.02a9.289,9.289,0,0,0,2.829-6.988"
                                            transform="translate(-121.05 -98.992)" fill="#4285F4" />
                                        <path id="Path_300" data-name="Path 300"
                                            d="M22.412,163.991a9.055,9.055,0,0,0,6.291-2.3l-3-2.322a5.623,5.623,0,0,1-3.293.95,5.719,5.719,0,0,1-5.4-3.948l-.111.009-2.932,2.269-.038.107a9.493,9.493,0,0,0,8.487,5.236"
                                            transform="translate(-12.912 -144.991)" fill="#34A853" />
                                        <path id="Path_301" data-name="Path 301"
                                            d="M4.1,77.5a5.848,5.848,0,0,1-.317-1.879,6.146,6.146,0,0,1,.306-1.879l-.005-.126L1.11,71.312l-.1.046a9.48,9.48,0,0,0,0,8.529L4.1,77.5"
                                            transform="translate(0 -66.123)" fill="#FBBC05" />
                                        <path id="Path_302" data-name="Path 302"
                                            d="M22.412,3.673a5.265,5.265,0,0,1,3.673,1.414L28.766,2.47A9.127,9.127,0,0,0,22.412,0a9.493,9.493,0,0,0-8.487,5.236L17,7.621a5.743,5.743,0,0,1,5.415-3.948"
                                            transform="translate(-12.912)" fill="#EB4335" />
                                    </svg>
                                    Continue with Google</a>
                            )}
                            buttonText="Login"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />

                        <AppleSigninButton />

                        <FacebookLogin
                            appId="1088597931155576"
                            autoLoad={false}
                            callback={responseFacebook}
                            render={renderProps => (
                                <a onClick={renderProps.onClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
                                        <path id="facebook"
                                            d="M16.883,7.758a9.415,9.415,0,0,1,4.8,1.3,9.6,9.6,0,0,1,2.4,14.494,9.68,9.68,0,0,1-5.361,3.2V19.929h1.863L21,17.245H18.181V15.488a1.528,1.528,0,0,1,.325-1.009,1.486,1.486,0,0,1,1.192-.453h1.7V11.674q-.037-.012-.7-.093a13.83,13.83,0,0,0-1.5-.093,3.75,3.75,0,0,0-2.694.961A3.714,3.714,0,0,0,15.5,15.206v2.039H13.35v2.684H15.5v6.829a9.447,9.447,0,0,1-5.81-3.2,9.585,9.585,0,0,1,2.4-14.494,9.418,9.418,0,0,1,4.8-1.3Z"
                                            transform="translate(-7.383 -7.758)" fill="#3B5998" fillRule="evenodd" />
                                    </svg>
                                    Continue with Facebook</a>
                            )}
                        />
                    </div>
                    <p className="signup-policy-links">By registering you agree with our <a href="">Terms & Conditions</a> and <a
                        href="">Privacy Policy</a>.</p>
                </div>
                <div className="modal-footer signup_footer">
                    <a href="" className="sign-in-M">Member Sign In</a><a href="" className="B-partner">Become Partner</a>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    // loginerror:state.errors.loginerror
});

export default connect(
    mapStateToProps,
    { register }
)(RegistrationForm);
