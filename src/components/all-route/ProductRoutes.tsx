import React from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

import Header from '../../containers/partials/headeMenu';
import Footer from '../../containers/partials/footer-new';

const ProductRoutes = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      <>
        <Header />
        <Component {...props} />
        <Footer />
      </>
    }
  />
);

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}
export default connect(mapStateToProps)(ProductRoutes);