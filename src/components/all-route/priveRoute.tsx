import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';

const PriveRoute = ({ component: Component, auth, token,tokenSession, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (auth && token === "4") || tokenSession.token === "4" ? (
                <div className="sectiosn"  id='topheaderrr'>
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
    // console.log(state.Auth);
    return {
        auth: state.Auth.idToken,
        token: state.Auth && state.Auth.userInfo ? state.Auth.userInfo.group_id : "",
        tokenSession: state.session.user
    }
}
export default connect(mapStateToProps)(PriveRoute);