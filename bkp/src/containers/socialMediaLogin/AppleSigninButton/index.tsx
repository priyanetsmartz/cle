import AppleSignin from 'react-apple-signin-auth';
import IntlMessages from "../../../components/utility/intlMessages";

/** Apple Signin button */
const MyAppleSigninButton = () => (
    <AppleSignin
        /** Auth options passed to AppleID.auth.init() */
        authOptions={{
            /** Client ID - eg: 'com.example.com' */
            clientId: 'com.example.web',
            /** Requested scopes, seperated by spaces - eg: 'email name' */
            scope: 'email name',
            /** Apple's redirectURI - must be one of the URIs you added to the serviceID - the undocumented trick in apple docs is that you should call auth from a page that is listed as a redirectURI, localhost fails */
            redirectURI: 'https://example.com',
            /** State string that is returned with the apple response */
            state: 'state',
            /** Nonce */
            nonce: 'nonce',
            /** Uses popup auth instead of redirection */
            usePopup: true,
    }} // REQUIRED
/** General props */
uiType = "dark"
/** className */
className = "apple-auth-btn"
/** Removes default style tag */
noDefaultStyle = { false}
/** Allows to change the button's children, eg: for changing the button text */
buttonExtraChildren = "Continue with Apple"
/** Extra controlling props */
/** Called upon signin success in case authOptions.usePopup = true -- which means auth is handled client side */
onSuccess = {(response) => console.log(response)} // default = undefined
/** Called upon signin error */
onError = {(error) => console.error(error)} // default = undefined
/** Skips loading the apple script if true */
skipScript = { false} // default = undefined
/** Apple image props */
iconprop = {{ style: { marginTop: '10px' } }} // default = undefined
/** render function - called with all props - can be used to fully customize the UI by rendering your own component  */
render = {(props) => <a {...props}>
<svg xmlns="http://www.w3.org/2000/svg" width="15.966" height="19" viewBox="0 0 15.966 19">
    <path id="apple-brands"
        d="M17.349,42.04a3.96,3.96,0,0,1,2.121-3.6,4.558,4.558,0,0,0-3.593-1.892c-1.506-.119-3.152.878-3.754.878-.636,0-2.1-.836-3.241-.836C6.515,36.632,4,38.482,4,42.244a10.572,10.572,0,0,0,.611,3.444c.543,1.557,2.5,5.374,4.547,5.311,1.069-.025,1.824-.759,3.215-.759,1.349,0,2.049.759,3.241.759,2.062-.03,3.835-3.5,4.352-5.061a4.2,4.2,0,0,1-2.617-3.9Zm-2.4-6.965A4,4,0,0,0,15.966,32a4.5,4.5,0,0,0-2.88,1.48A4.058,4.058,0,0,0,12,36.53,3.563,3.563,0,0,0,14.948,35.075Z"
        transform="translate(-4 -32)" />
</svg>
<span><IntlMessages id="signup.continue_apple" /></span></a>}
/>
);

export default MyAppleSigninButton;