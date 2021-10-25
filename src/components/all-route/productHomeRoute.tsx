import { Route } from "react-router";
import { connect } from "react-redux";
// import PropTypes from "prop-types";

// import Header from '../../containers/partials/header';
import Header from '../../containers/partials/headerMenu';
import Footer from '../../containers/partials/footer-new';

const ProductHome = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            <>
                <Component {...props} />
            </>
        }
    />
);

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}
export default connect(mapStateToProps)(ProductHome);