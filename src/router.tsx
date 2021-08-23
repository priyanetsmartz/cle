import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';
// import About from './containers/Page/about';
// import Magazine from './containers/Page/magazine';
import SinglePost from './containers/Page/singlePost';
import ForgottenPassword from './containers/Page/forgotPassword';
import PostComment from './containers/Page/postComments';
import Pages from './containers/Page/pages';
import MainRoute from "./components/all-route/MainRoute";
import WithFooter from "./components/all-route/withFooter";
import HomeRoute from './components/all-route/HomeRoute';
import PrivateRoute from "./components/all-route/privateRoute";
import AllPosts from './containers/Page/magazineCategory';
import NewHome from './containers/Page/anewpage';
import ThankYou from './containers/Page/ThankYou';
import ResetPassword from './containers/Page/ResetPassoword';
import profile from './containers/Page/profile';
import contact from "./containers/Page/contact";
import PasswordLinkExpired from "./containers/Page/PasswordLinkExpired";
import PriveUser from './containers/Page/PriveUser';
import CustomerDetails from './containers/Page/customer/customerDetails'
import CustomerOrders from './containers/Page/customer/customerOrders'
// import New from './containers/Page/new';
import One from './containers/Page/one';
import Product from './containers/Page/product/product';
import Cart from './containers/Page/product/cart';

const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <MainRoute exact path="/magazines/:category" component={AllPosts} />
        <MainRoute exact path="/magazine/:slug" component={SinglePost} />
        <MainRoute exact path="/magazines" component={AllPosts} />
        <HomeRoute exact path="/:signup/:member" component={NewHome} />
        <HomeRoute exact path="/" component={NewHome} />
        <MainRoute exact path="/help-us/thank-you" component={ThankYou} />
        <MainRoute exact path="/contact-us" component={contact} />
        <MainRoute exact path="/customer-details" component={CustomerDetails} />
        <MainRoute exact path="/customer-orders" component={CustomerOrders} />
        <MainRoute exact path="/forgot-password" component={ForgottenPassword} />
        <MainRoute exact path="/reset-password" component={ResetPassword} />
        <PrivateRoute exact path="/prive-user" component={PriveUser} />
        <MainRoute exact path="/profile" component={profile} />
        <MainRoute exact path="/password-link-expired" component={PasswordLinkExpired} />
        <Route exact path="/post-comment">
          <PostComment />
        </Route>
        <WithFooter exact path="/products" component={Product} />
        <WithFooter exact path="/my-cart" component={Cart} />
        <MainRoute path="/:id" component={Pages} />
        {/* <Route exact path="/page-not-found" component={NotFound} /> */}
      </Switch>
    </ConnectedRouter >
  );
}

export default PublicRoutes;
