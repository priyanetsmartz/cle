import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import IntlMessages from "../../../components/utility/intlMessages";
import { apiConfig } from '../../../settings';
import { Link } from "react-router-dom";
import authAction from "../../../redux/auth/actions";
import { connect } from 'react-redux';
const { register } = authAction;
/** Apple Signin button */
function FacebookLoginButton(props) {

    const responseFacebook = (response) => {
       // console.log(response);
        const { register } = props;
        if (response.accessToken) {
            const userInfo = {
                "firstname": response.name,
                "email": response.email,
                "accessToken": response.accessToken,
                "type": 3,
            }
            // console.log(userInfo);
            register({ userInfo });
        }
    }

    return (
        <FacebookLogin
            appId={apiConfig.facebookKey}
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            render={renderProps => (
                <Link to="#" onClick={renderProps.onClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
                        <path id="facebook"
                            d="M16.883,7.758a9.415,9.415,0,0,1,4.8,1.3,9.6,9.6,0,0,1,2.4,14.494,9.68,9.68,0,0,1-5.361,3.2V19.929h1.863L21,17.245H18.181V15.488a1.528,1.528,0,0,1,.325-1.009,1.486,1.486,0,0,1,1.192-.453h1.7V11.674q-.037-.012-.7-.093a13.83,13.83,0,0,0-1.5-.093,3.75,3.75,0,0,0-2.694.961A3.714,3.714,0,0,0,15.5,15.206v2.039H13.35v2.684H15.5v6.829a9.447,9.447,0,0,1-5.81-3.2,9.585,9.585,0,0,1,2.4-14.494,9.418,9.418,0,0,1,4.8-1.3Z"
                            transform="translate(-7.383 -7.758)" fill="#3B5998" fillRule="evenodd" />
                    </svg>
                    <span><IntlMessages id="signup.continue_facebook" /></span></Link>
            )}
        />
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
)(FacebookLoginButton);
