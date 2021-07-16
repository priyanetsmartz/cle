import React from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
// import PropTypes from "prop-types";

import Header from '../../containers/partials/header';
// import Sidebar from '../../containers/partials/sidebar';
import Footer from '../../containers/partials/footer';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth === undefined ? (
        <>
          <Header  {...props}/>
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
// PrivateRoute.propTypes = {
//   auth: PropTypes.object.isRequired
// };

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}
export default connect(mapStateToProps)(PrivateRoute);