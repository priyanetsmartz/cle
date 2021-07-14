import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import authAction from "../../redux/auth/actions";
import SignUp from '../Page/signup';
import SignIn from '../Page/signin';
// const { login, logout, } = authAction;

function Footer(props) {

    // const logout = () => {
    //     // Clear access token and ID token from local storage
    //     localStorage.removeItem('id_token');
    //     localStorage.removeItem('expires_at');
    //     // navigate to the home route
    //     history.replace('/');
    // }


    return (
        <>
            <SignIn showLogin={props.showLogin} />
            <SignUp signupModel={props.signupModel} />
        </>
    );
}

function mapStateToProps(state) {
    let showLogin = '', signupModel = '';   
    if (state && state.App) {
        showLogin = state.App.showLogin;
        signupModel = state.App.showSignUp
    }
    return {
        showLogin: showLogin,
        signupModel: signupModel
    }
};
export default connect(
    mapStateToProps,
    {}
)(Footer);
