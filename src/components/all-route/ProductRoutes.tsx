import { Route } from "react-router";
import { connect } from "react-redux";
import AppBreadcrumbs from "../../containers/partials/breadCrumbs";
import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';
import FaqHeader from '../../containers/Page/faq/faq-header';
const ProductRoutes = ({ component: Component, auth, ...rest }) => (

  <Route
    {...rest}
    render={props =>
      <div className="sectiosn" id='topheaderrr' >
        <div className="section headerrr" id="headerrr" key='uniqueKey'>
          <Header />
        </div>
        {/* {console.log(props.location.pathname)} */}
        <div className='customwrapper' >
          {(!props.location.pathname.includes('help-center')) && (
            <AppBreadcrumbs />
          )}
          {/* <AppBreadcrumbs /> */}
          <Component {...props} />
        </div>
        <Footer />
      </div>
    }
  />
);

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}
export default connect(mapStateToProps)(ProductRoutes);