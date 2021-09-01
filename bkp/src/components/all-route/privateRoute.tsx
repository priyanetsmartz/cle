import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

import Header from '../../containers/partials/header';
import Footer from '../../containers/partials/footer-new';
const localToken = localStorage.getItem('token');
const PrivateRoute = ({ component: Component, auth, token, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (auth && token === "4") || localToken === "4" ? (
                <>
                    <Header logo="black" {...props} />
                    <Component {...props} />
                    <Footer />
                </>
            ) : (
                <Redirect to="/" />
            )
        }
    />
);

function mapStateToProps(state) {
    // console.log(state.Auth);
    return {
        auth: state.Auth.idToken,
        token: state.Auth && state.Auth.userInfo ? state.Auth.userInfo.group_id : ""
    }
}
export default connect(mapStateToProps)(PrivateRoute);