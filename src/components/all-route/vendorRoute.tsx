import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';
import AppBreadcrumbs from "../../containers/partials/breadCrumbs";
let localData = localStorage.getItem('redux-react-session/USER_DATA');
let localToken = JSON.parse((localData));

const VendorRoute = ({ component: Component, token, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      ((localToken && localToken.type === "vendor") || (token && token.type === "vendor")) ? (
        <div className="sectiosn" id='topheaderrr'>
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
  //console.log(state.session)
  return {
    vendordata: state.Auth.vendorr,
    token: state.session.user
  }
}

export default withRouter(connect(mapStateToProps)(VendorRoute))