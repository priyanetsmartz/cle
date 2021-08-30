import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Header from '../../containers/partials/header';
import Footer from '../../containers/partials/footer-new';
const localToken = localStorage.getItem('id_token');

const PriveRoute = ({ component: Component, auth, token, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (auth || localToken) ? (
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
    console.log(state.Auth.idToken)
    return {
        auth: state.Auth.idToken
    }
}

export default withRouter(connect(mapStateToProps)(PriveRoute))