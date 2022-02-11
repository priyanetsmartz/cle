import { Route } from "react-router";
import { connect } from "react-redux";
// import PropTypes from "prop-types";

import Header from '../../containers/partials/header';

const WithFooter = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            <>
                <Header logo="white" {...props} />
                <Component {...props} />
            </>
        }
    />
);

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}
export default connect(mapStateToProps)(WithFooter);