import React from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
// import PropTypes from "prop-types";

import Header from '../../containers/partials/header';
import Footer from '../../containers/partials/footer-new';

const WithFooter = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            auth === undefined ? (
                <>
                    <Header  {...props} />
                    {/* <Sidebar /> */}
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
    return {
        auth: state.auth
    }
}
export default connect(mapStateToProps)(WithFooter);