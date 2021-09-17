import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';
// import About from './containers/Page/about';
// import Magazine from './containers/Page/magazine';
import SinglePost from './containers/Page/singlePost';
import ForgottenPassword from './containers/Page/forgotPassword';
import PostComment from './containers/Page/postComments';
import Pages from './containers/Page/pages';
import MainRoute from "./components/all-route/MainRoute";
import ProductRoutes from "./components/all-route/ProductRoutes";
import ProductHome from "./components/all-route/productHomeRoute"
import PrivateRoute from "./components/all-route/LoggedinRoute";
import HomeRoute from './components/all-route/HomeRoute';
import PriveRoute from "./components/all-route/priveRoute";
import AllPosts from './containers/Page/magazineCategory';
import NewHome from './containers/Page/anewpage';
import ThankYou from './containers/Page/ThankYou';
import ResetPassword from './containers/Page/ResetPassoword';
import profile from './containers/Page/profile';
import contact from "./containers/Page/contact";
import PasswordLinkExpired from "./containers/Page/PasswordLinkExpired";
import PriveUser from './containers/Page/PriveUser';
import Customer from './containers/Page/customer/customer';
import HomePage from './containers/Page/home/home';
import OrderDetails from './containers/Page/customer/orderDetails';
import Categories from './containers/Page/categories/categories';
import ProductDetails from './containers/Page/product/product-details/productDetails';
import VendorLogin from './containers/Page/business/vendorLogin';
import DesignerCategories from './containers/Page/designer/designer';
import Checkout from './containers/Page/product/checkout/checkout';
// import New from './containers/Page/new';

import Product from './containers/Page/product/product';
import Cart from './containers/Page/product/cart/cart';

const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <ProductRoutes exact path="/order-details/:orderId" component={OrderDetails} />
        <ProductRoutes exact path="/products/:category/:subcat" component={Categories} />
        <ProductRoutes exact path="/products/:category" component={Categories} />
        <ProductRoutes exact path="/product-details/:sku" component={ProductDetails} />
        <PrivateRoute exact path="/customer/:tab" component={Customer} />
        <ProductHome exact path="/home" component={HomePage} />
        <PrivateRoute exact path="/designer-categories" component={DesignerCategories} />
        <MainRoute exact path="/magazines/:category" component={AllPosts} />
        <MainRoute exact path="/magazine/:slug" component={SinglePost} />
        <MainRoute exact path="/magazines" component={AllPosts} />
        <HomeRoute exact path="/:signup/:member" component={NewHome} />
        <HomeRoute exact path="/" component={NewHome} />
        <MainRoute exact path="/help-us/thank-you" component={ThankYou} />
        <MainRoute exact path="/contact-us" component={contact} />
        {/* <PrivateRoute exact path="/customer-orders" component={CustomerOrders} /> */}



        <MainRoute exact path="/business-login" component={VendorLogin} />
        <MainRoute exact path="/forgot-password" component={ForgottenPassword} />
        <MainRoute exact path="/reset-password" component={ResetPassword} />
        <PriveRoute exact path="/prive-user" component={PriveUser} />
        <PrivateRoute exact path="/profile" component={profile} />
        <MainRoute exact path="/password-link-expired" component={PasswordLinkExpired} />
        <Route exact path="/post-comment">
          <PostComment />
        </Route>
        <ProductRoutes exact path="/products" component={Product} />
        <ProductRoutes exact path="/my-cart" component={Cart} />
        <ProductRoutes exact path="/checkout" component={Checkout} />
        <MainRoute path="/:id" component={Pages} />
        {/* <Route exact path="/page-not-found" component={NotFound} /> */}
      </Switch>
    </ConnectedRouter >
  );
}

export default PublicRoutes;
