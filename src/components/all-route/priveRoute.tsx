import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';
let localData = localStorage.getItem('redux-react-session/USER_DATA');
let localToken = JSON.parse((localData));
const PriveRoute = ({ component: Component, auth, tokenSession, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            ( (localToken && localToken.type === "user" && localToken.token === "4") || (tokenSession && tokenSession.type === "user" && tokenSession.token === "4")) ? (
                <div className="sectiosn prive-users isPriveUser" id='topheaderrr'>
                    <div className="section headerrr" id="headerrr" key='uniqueKey'>
                        <Header />
                    </div>
                    <Component {...props} />
                    <Footer />
                </div>
            ) : (
                <Redirect to="/" />
            )
        }
    />
);

function mapStateToProps(state) {
    return {
        auth: state.Auth.idToken,
        token: state.Auth && state.Auth.userInfo ? state.Auth.userInfo.group_id : "",
        tokenSession: state.session.user
    }
}
export default connect(mapStateToProps)(PriveRoute);