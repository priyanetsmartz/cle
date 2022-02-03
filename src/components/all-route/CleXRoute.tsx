import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';

let localData = localStorage.getItem('redux-react-session/USER_DATA');
let localToken = JSON.parse((localData));

const CleRoute = ({ component: Component, auth, tokenSession, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            ( (localToken && localToken.type === "user") || (tokenSession && tokenSession.type === "user")) ? (
                <div className="sectiosn" id='topheaderrr'>
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
    // console.log(state.session.user.token);
    return {
        auth: state.Auth.idToken,
        token: state.Auth && state.Auth.userInfo ? state.Auth.userInfo.group_id : "",
        tokenSession: state.session.user
    }
}
export default connect(mapStateToProps)(CleRoute);