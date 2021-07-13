import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import IntlMessages from "../../components/utility/intlMessages";
import { Button, Select } from 'antd';
import AppleSigninButton from '../AppleSigninButton';
import authAction from "../../redux/auth/actions";
import notification from '../../components/notification';
import Login from "../../redux/auth/Login";
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
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">

            <p>adasd</p>
            <br />
            <FacebookShareButton
                url={'https://www.npmjs.com/package/react-share'}
                quote={'Sample text to share'}>
                <Button>Facebook</Button>
            </FacebookShareButton>

            <TwitterShareButton
                url={'https://www.npmjs.com/package/react-share'}
                title={'Sample text to share'}>
                <Button>Twitter</Button>
            </TwitterShareButton>

            <br />
            <br />
            <form>
                <form>
                    <div className="form-group text-left">
                        <label htmlFor="exampleInputEmail1"><IntlMessages id="register.email" /></label>
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
                        <label htmlFor="exampleInputPassword1"><IntlMessages id="register.password" /></label>
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
                        <label htmlFor="exampleInputPassword1"><IntlMessages id="register.confirmPassword" /></label>
                        <input type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={state.confirmPassword}
                            onChange={handleChange}
                        />
                        <span className="error">{errors.errors["confirmPassword"]}</span>
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="exampleInputPassword1"><IntlMessages id="register.confirmPassword" /></label>
                        <select value={state.type} onChange={selectType}>
                            <option key="-1" value="--">---</option>
                            {types.map(item => {
                                return (<option key={item.id} value={item.id}>{item.code}</option>);
                            })}
                        </select>
                        <span className="error">{errors.errors["confirmPassword"]}</span>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmitClick}
                    >
                        <IntlMessages id="register.button" />
                    </button>
                </form>
            </form>
            <GoogleLogin
                clientId="788786912619-k4tb19vgofvmn97q1vsti1u8fnf8j6pa.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle} ></GoogleLogin>
            <br />
            <FacebookLogin
                appId="1088597931155576"
                autoLoad={false}
                fields="name,email,picture"
                onClick={componentClicked}
                callback={responseFacebook} />
            <br />
            <AppleSigninButton />
            <br />
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
