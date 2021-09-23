import React from "react";
import Breadcrumbs from 'react-router-dynamic-breadcrumbs';
import { BrowserRouter as Router } from 'react-router-dom';

function AppBreadcrumbs(props) {

  const routesList = {
    '/': 'Home',
    '/customer/:tab': ':tab',
    '/products/:category/:subcat': ':subcat',
    '/product-details/:sku': ':sku',
    '/my-cart': 'my-cart'
  }
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