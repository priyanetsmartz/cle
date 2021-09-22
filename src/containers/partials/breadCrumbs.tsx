import React, { useEffect } from "react";
import Breadcrumbs from 'react-router-dynamic-breadcrumbs';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
const routesList = {
  '/': 'Home',
  '/customer/:tab': ':tab',
  '/products/:category/:subcat': ':subcat',
  '/product-details/:sku': ':sku',
  '/my-cart': 'my-cart'
}
function AppBreadcrumbs(props) {
  const location = useLocation();
  useEffect(() => {
  });

  return (
    <Router>
      <Breadcrumbs mappedRoutes={routesList}
        WrapperComponent={(props: any) =>
          <ol className="breadcrumb">{props.children}</ol>}
        ActiveLinkComponent={(props: any) =>
          <li className="breadcrumb-item active" >{props.children}</li>}
        LinkComponent={(props: any) =>
          <li className="breadcrumb-item">{props.children}</li>
        } />
    </Router>
  );
}

export default AppBreadcrumbs