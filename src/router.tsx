import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';
import SinglePost from './containers/Page/singlePost';
import ForgottenPassword from './containers/Page/forgotPassword';
import BusinessResetPassword from './containers/Page/business/bussinessForgotpassword';
import PostComment from './containers/Page/postComments';
import { LastLocationProvider } from 'react-router-last-location';
import Pages from './containers/Page/pages';
import VendorRoute from "./components/all-route/vendorRoute";
import ProductRoutes from "./components/all-route/ProductRoutes";
import ProductHome from "./components/all-route/productHomeRoute"
import LoggedInRoute from "./components/all-route/LoggedinRoute";
import PriveRoute from "./components/all-route/priveRoute";
import AllPosts from './containers/Page/magazineCategory';
import ThankYou from './containers/Page/ThankYou';
import ResetPassword from './containers/Page/ResetPassoword';
import contact from "./containers/Page/contact";
import PasswordLinkExpired from "./containers/Page/PasswordLinkExpired";
import PriveUser from './containers/Page/PriveUser';
import Customer from './containers/Page/customer/customerSidebar';
import BusinessSidebar from './containers/Page/business/businessSidebar';
import ReturnPage from './containers/Page/customer/returnsDetails';
import Notifications from './containers/Page/customer/notifications';
import HomePage from './containers/Page/home/home';
import OrderDetails from './containers/Page/customer/orderDetails';
import Categories from './containers/Page/categories/categories';
import ProductDetails from './containers/Page/product/product-details/productDetails';
import VendorLogin from './containers/Page/business/vendorLogin';
import Checkout from './containers/Page/product/checkout/checkout';
import Faq from './containers/Page/faq/faq';
import FaqListing from './containers/Page/faq/faqListing';
import Search from './containers/Page/search';
import orderThankyou from './containers/Page/product/orderThankyou';
import Product from './containers/Page/product/product';
import Cart from './containers/Page/product/cart/cart';
import Loader from '../src/image/CLE_LogoMotionGraphics.gif';
import BussinessResetpassword from './containers/Page/business/bussinessResetpassword';
import RetunOrder from './containers/Page/business/returnOrder';
import VendorOrderDetails from './containers/Page/business/orderDetail';
import MyPayoutDetails from './containers/Page/business/payoutDetails';
import returnsDetails from './containers/Page/customer/returnsDetails';
import CreateReturn from './containers/Page/customer/createReturn';
import ReturnsSummary from './containers/Page/customer/ReturnsSummary';
import ProductIntegration from './containers/Page/business/productIntegration';
import ProductDetailsPrivate from './containers/Page/product/product-details/ProductDetailsPrivate';
import BussinessResetEmail from './containers/Page/business/BussinessResetEmail';
import CleXRoute from './components/all-route/CleXRoute';
import SellProduct from './containers/Page/CLEX/sellProduct';
import Howtosell from './containers/Page/CLEX/howtosell';
import Unsubscribe from './containers/Page/customer/unsubscribe';
import OrderAuth from './containers/Page/customer/OrderAuth';
const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Suspense fallback={<Loader />}>
        <LastLocationProvider>
          <Switch>
            <ProductRoutes exact path="/magazines/:magazinecategory" component={AllPosts} />
            <ProductRoutes exact path="/magazines" component={AllPosts} />
            <ProductRoutes exact path="/magazine/:slug" component={SinglePost} />
            <ProductRoutes exact path="/orderauth/:orderId" component={OrderAuth} />
            <ProductRoutes exact path="/help-center/:url_key" component={FaqListing} page='faq' />
            <ProductRoutes exact path="/vendor/forgot-password" component={BussinessResetpassword} />
            <ProductRoutes exact path="/vendor/settings/email" component={BussinessResetEmail} />
            <ProductRoutes exact path="/search/:searchText/:cat" component={Search} />
            <ProductRoutes exact path="/search/:brandname" component={Search} />
            <ProductRoutes exact path="/thankyou" component={orderThankyou} />
            <LoggedInRoute exact path="/order-details/:orderId" component={OrderDetails} />
            <ProductRoutes exact path="/products/:category/:subcat/:childcat/:greatchildcat/all" component={Product} />
            <ProductRoutes exact path="/products/:category/:subcat/:childcat/all" component={Product} />
            <ProductRoutes exact path="/products/:category/:subcat/all" component={Product} />
            <ProductRoutes exact path="/products/:category/all" component={Product} />

            <ProductHome exact path="/products/:category/:subcat/:childcat/:greatchildcat" component={Categories} />
            <ProductHome exact path="/products/:category/:subcat/:childcat" component={Categories} />
            <ProductHome exact path="/products/:category/:subcat/:id" component={Categories} />
            <ProductHome exact path="/products/:category/:subcat" component={Categories} />
            <ProductHome exact path="/products/:category" component={Categories} />

            <VendorRoute exact path="/product-details-preview/:vendorIdprev/:prodsku" component={ProductDetailsPrivate} />
            <ProductRoutes exact path="/product-details/:sku" component={ProductDetails} />
            <LoggedInRoute exact path="/notifications" component={Notifications} />
            <LoggedInRoute exact path="/customer/:tab" component={Customer} />
            <LoggedInRoute exact path="/customer/return-details/:returnId" component={returnsDetails} />
            <LoggedInRoute exact path="/customer/return-summary/:orderId" component={ReturnsSummary} />
            <LoggedInRoute exact path="/customer/create-return/:returnId" component={CreateReturn} />
            <ProductRoutes exact path="/unsubscribe" component={Unsubscribe} />
            <VendorRoute exact path="/vendor/:tab" component={BusinessSidebar} />
            <VendorRoute exact path="/vendor/returns-complaints/:returnId" component={RetunOrder} />
            <VendorRoute exact path="/vendor/sales-orders/:orderId" component={VendorOrderDetails} />
            <VendorRoute exact path="/product-integration" component={ProductIntegration} />
            <ProductHome exact path="/category/:categoryname" component={HomePage} />
            <ProductHome exact path="/" component={HomePage} />
            <ProductHome exact path="/:signup/:member" component={HomePage} />
            <ProductRoutes exact path="/return-order" component={ReturnPage} />
            


            <ProductRoutes exact path="/help-us/thank-you" component={ThankYou} />
            <ProductRoutes exact path="/contact-us" component={contact} />
            <ProductRoutes exact path="/help-center" component={Faq} page='faq' />
            <VendorRoute exact path="/vendor/payoutdetails/:payoutId" component={MyPayoutDetails} />


            <ProductRoutes exact path="/vendor-login" component={VendorLogin} />

            <ProductRoutes exact path="/forgot-password" component={ForgottenPassword} />
            <ProductRoutes exact path="/reset-password" component={ResetPassword} />
            <PriveRoute exact path="/prive-user" component={PriveUser} />
            <ProductRoutes exact path="/vendor-forgot-password" component={BusinessResetPassword} />
            <ProductRoutes exact path="/password-link-expired" component={PasswordLinkExpired} />
            <CleXRoute exact path="/sell-products" component={SellProduct} />
            <CleXRoute exact path="/how-to-sell" component={Howtosell} />
            <Route exact path="/post-comment">
              <PostComment />
            </Route>
            <ProductRoutes exact path="/products" component={Product} />
            <ProductRoutes exact path="/my-cart" component={Cart} />
            <ProductRoutes exact path="/checkout" component={Checkout} />
            <ProductRoutes path="/:id" component={Pages} />
          </Switch>
        </LastLocationProvider>
      </Suspense>
    </ConnectedRouter >
  );
}

export default PublicRoutes;
