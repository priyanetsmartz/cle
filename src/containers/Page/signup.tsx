import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { Button } from 'antd';
import AppleSigninButton from '../AppleSigninButton';

function RegistrationForm(props) {

    const responseGoogle = (response) => {
        console.log(response);
    }

    const responseFacebook = (response) => {
        console.log(response);
    }

    const componentClicked = (response) => {
        console.log(response);
    }

    const signup = (res) => {
        console.log(res);
        const googleresponse = {
            Name: res.profileObj.name,
            email: res.profileObj.email,
            token: res.googleId,
            Image: res.profileObj.imageUrl,
            ProviderId: 'Google'
        };
    }

    const [authOptions, setAuthOptions] = useState({
        clientId: 'com.example.web',
        scope: 'email name',
        redirectURI: 'https://example.com',
        state: '',
        nonce: 'nonce',
        usePopup: true,
        onSuccess: '',
        onError: '',
        iconProps: ''
    });
    const [extraProps, setExtraProps] = useState({
        uiType: 'dark',
        className: 'apple-auth-btn',
        noDefaultStyle: false,
        buttonExtraChildren: 'Continue with Apple',
    });
    const [codeString, setCodeString] = useState('');

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">

            <p>adasd</p>
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
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Register
                </button>
            </form>
            <GoogleLogin
                clientId="788786912619-k4tb19vgofvmn97q1vsti1u8fnf8j6pa.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle} ></GoogleLogin>
            <br />
            <FacebookLogin
                appId="1088597931155576"
                autoLoad={true}
                fields="name,email,picture"
                onClick={componentClicked}
                callback={responseFacebook} />
            <br />
            <AppleSigninButton />
            <br />
        </div>
    )
}

export default RegistrationForm;