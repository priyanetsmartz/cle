import { Route } from "react-router";
import { connect } from "react-redux";


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