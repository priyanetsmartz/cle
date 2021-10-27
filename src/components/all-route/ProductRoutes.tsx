import React from "react";
import { Route } from "react-router";
import { connect } from "react-redux";
import AppBreadcrumbs from "../../containers/partials/breadCrumbs";
import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';

const ProductRoutes = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      <>
        <Header />
        <AppBreadcrumbs />
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