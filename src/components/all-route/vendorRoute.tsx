import React from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';
const vendorLocal = localStorage.getItem('cle_vendor');
const VendorRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      vendorLocal ? (
        <>
          <Header />
          <Component {...props} />
          <Footer />
        </>
      ) : (
        <Redirect to="/" />
      )
    }
  />
);


export default VendorRoute;