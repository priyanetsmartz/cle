import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';
import AppBreadcrumbs from "../../containers/partials/breadCrumbs";
const vendorLocal = localStorage.getItem('cle_vendor');
// console.log(vendor.id)
let vendor = vendorLocal ? JSON.parse(vendorLocal) : '';

const VendorRoute = ({ component: Component, vendordata, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (vendordata || (vendor && vendor.vendor_id)) ? (
        <div className="sectiosn"  id='topheaderrr'>
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
  //console.log(state)
  return {
    vendordata: state.Auth.vendorr
  }
}

export default withRouter(connect(mapStateToProps)(VendorRoute))