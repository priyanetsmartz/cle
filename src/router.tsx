import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';
import SinglePost from './containers/Page/singlePost';
import ForgottenPassword from './containers/Page/forgotPassword';
import PostComment from './containers/Page/postComments';
import Pages from './containers/Page/pages';
import VendorRoute from "./components/all-route/vendorRoute";
import ProductRoutes from "./components/all-route/ProductRoutes";
import ProductHome from "./components/all-route/productHomeRoute"
import PrivateRoute from "./components/all-route/LoggedinRoute";
import PriveRoute from "./components/all-route/priveRoute";
import AllPosts from './containers/Page/magazineCategory';
import ThankYou from './containers/Page/ThankYou';
import ResetPassword from './containers/Page/ResetPassoword';
import contact from "./containers/Page/contact";
import PasswordLinkExpired from "./containers/Page/PasswordLinkExpired";
import PriveUser from './containers/Page/PriveUser';
import Customer from './containers/Page/customer/customerSidebar';
import BusinessSidebar from './containers/Page/business/businessSidebar';
import ReturnPage from './containers/Page/customer/allReturns';
import Notifications from './containers/Page/customer/notifications';
import HomePage from './containers/Page/home/home';
import OrderDetails from './containers/Page/customer/orderDetails';
import Categories from './containers/Page/categories/categories';
import ProductDetails from './containers/Page/product/product-details/productDetails';
import VendorLogin from './containers/Page/business/vendorLogin';
import Checkout from './containers/Page/product/checkout/checkout';
import ExploreDesigner from './containers/Page/designer/exploreDesigner';
import Faq from './containers/Page/faq/faq';
import FaqListing from './containers/Page/faq/faqListing';
import Search from './containers/Page/search';
import orderThankyou from './containers/Page/product/orderThankyou';
import Product from './containers/Page/product/product';
import Cart from './containers/Page/product/cart/cart';


const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <ProductRoutes exact path="/search/:searchText/:cat" component={Search} />
        <ProductRoutes exact path="/search/:brandname" component={Search} />
        <ProductRoutes exact path="/thankyou" component={orderThankyou} />
        <ProductRoutes exact path="/order-details/:orderId" component={OrderDetails} />
        <ProductRoutes exact path="/products/:category/:subcat/:childcat/:greatchildcat/all" component={Product} />
        <ProductRoutes exact path="/products/:category/:subcat/:childcat/all" component={Product} />
        <ProductRoutes exact path="/products/:category/:subcat/all" component={Product} />
        <ProductRoutes exact path="/products/:category/all" component={Product} />
        
        <ProductHome exact path="/products/:category/:subcat/:childcat/:greatchildcat" component={Categories} />
        <ProductHome exact path="/products/:category/:subcat/:childcat" component={Categories} />
        <ProductHome exact path="/products/:category/:subcat/:id" component={Categories} />
        <ProductHome exact path="/products/:category/:subcat" component={Categories} />
        <ProductHome exact path="/products/:category" component={Categories} />

        <ProductRoutes exact path="/product-details/:sku" component={ProductDetails} />
        <PrivateRoute exact path="/notifications" component={Notifications} />
        <PrivateRoute exact path="/customer/:tab" component={Customer} />
        <VendorRoute exact path="/vendor/:tab" component={BusinessSidebar} />    
        <ProductHome exact path="/category/:categoryname" component={HomePage} />   
        <ProductHome exact path="/" component={HomePage} />
        <ProductHome exact path="/:signup/:member" component={HomePage} />
        <ProductRoutes exact path="/return-order" component={ReturnPage} />

        <PrivateRoute exact path="/explore-desginer" component={ExploreDesigner} />
        <ProductRoutes exact path="/magazines/:category" component={AllPosts} />
        <ProductRoutes exact path="/magazine/:slug" component={SinglePost} />
        <ProductRoutes exact path="/magazines" component={AllPosts} />
    

        <ProductRoutes exact path="/help-us/thank-you" component={ThankYou} />
        <ProductRoutes exact path="/contact-us" component={contact} />
        <ProductRoutes exact path="/faq" component={Faq} />
        <ProductRoutes exact path="/faq-listing" component={FaqListing} />

        <ProductRoutes exact path="/vendor-login" component={VendorLogin} />
        <ProductRoutes exact path="/forgot-password" component={ForgottenPassword} />
        <ProductRoutes exact path="/reset-password" component={ResetPassword} />
        <PriveRoute exact path="/prive-user" component={PriveUser} />

        <ProductRoutes exact path="/password-link-expired" component={PasswordLinkExpired} />
        <Route exact path="/post-comment">
          <PostComment />
        </Route>
        <ProductRoutes exact path="/products" component={Product} />
        <ProductRoutes exact path="/my-cart" component={Cart} />
        <ProductRoutes exact path="/checkout" component={Checkout} />
        <ProductRoutes path="/:id" component={Pages} />
      </Switch>
    </ConnectedRouter >
  );
}

export default PublicRoutes;
