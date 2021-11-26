import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
// import Header from '../../containers/partials/header';
import Footer from '../../containers/partials/footer-new';
import Header from '../../containers/partials/headerMenu';
import AppBreadcrumbs from "../../containers/partials/breadCrumbs";


const PriveRoute = ({ component: Component, auth, token, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (auth || token) ? (
                <div className="sectiosn" id='topheaderrr'>
                    <div className="section headerrr" id="headerrr" key='uniqueKey'>
                        <Header />
                    </div>
                    <div className='customwrapper' >
                        <AppBreadcrumbs />
                        <Component {...props} />
                    </div>
                    <Footer />
                </div>
            ) : (
                <Redirect to="/" />
            )
        }
    />
);

function mapStateToProps(state) {
    // console.log(state.Auth.idToken)
    return {
        auth: state.Auth.idToken,
        token: state.session.user
    }
}

export default withRouter(connect(mapStateToProps)(PriveRoute))