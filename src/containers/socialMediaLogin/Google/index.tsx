import GoogleLogin from 'react-google-login';
import IntlMessages from "../../../components/utility/intlMessages";
import { apiConfig } from '../../../settings';
import { Link } from "react-router-dom";
import authAction from "../../../redux/auth/actions";
import appAction from "../../../redux/app/actions";
import { connect } from 'react-redux';
import { history } from "../../../redux/store";
import Login from "../../../redux/auth/Login";
import { setCookie } from '../../../helpers/session';
import notification from "../../../components/notification";
import { sessionService } from 'redux-react-session';

const loginApi = new Login();
const { showSignin, openSignUp } = appAction;
const { register, loginSuccess } = authAction;
/** Apple Signin button */
function GoogleLoginButton(props) {

    const responseGoogle = (response) => {
        if (response.accessToken) {
            let name = response.profileObj.name.split(" ");
            if (props.isVendor) {
                return saveVendorLogin(response, name);
            }
            // console.log(name[0],name[1])
            const userInfo = {
                "first_name": name[0],
                "last_name": name[1],
                "email": response.profileObj.email,
                "accessToken": response.accessToken,
                "type": props.userSetype,
            }
            fetchMyAPI(userInfo)

        }
    }

    const saveVendorLogin = (res, name) => {
        const vendorObj = {
            vendor_id: '', //need vendor id
            vendor_name: name[0],
            email: res.profileObj.email,
            telephone: '',
            country_id: '',
        }
        localStorage.setItem('cle_vendor', JSON.stringify(vendorObj));
        history.push(`/vendor/profile`);
    }

    async function fetchMyAPI(userInfo) {
        let result: any = await loginApi.getAuthRegister(userInfo.email);
        var jsonData = result.data[0];
        if (jsonData) {
         
            let id_token = jsonData.new_token;
            let data = {
                'cust_id': jsonData.entity_id,
                'token_email': userInfo.email,
                'token': jsonData.group_id,
                'id_token': jsonData.new_token
            }
            sessionService.saveSession({ id_token })
            sessionService.saveUser(data)
            setCookie("username", jsonData.email)
            props.loginSuccess(jsonData.new_token)


            if (jsonData.group_id === "4") {
                history.push("/prive-user");
            }
            notification("success", "", "Successfully Logged in");
        } else {
            const { register } = props;
            register({ userInfo });
        }

        props.showSignin(false);
        props.openSignUp(false);
    }

    return (
        <GoogleLogin
            clientId={apiConfig.googleClientId}
            render={renderProps => (
                <Link to="#" onClick={renderProps.onClick}>
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
                    <span><IntlMessages id="signup.continue_google" /></span></Link>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    )
}
function mapStateToProps(state) {
    let loginState = '';
    if (state && state.App && state.App.showLogin) {
        loginState = state.App.showLogin
    }
    return {
        loginState: loginState,
        userSetype: state.App.userType,
    }
}
export default connect(
    mapStateToProps,
    { register, showSignin, openSignUp, loginSuccess }
)(GoogleLoginButton);