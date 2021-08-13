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
import Test from './containers/Page/test';
import New from './containers/Page/new';
import One from './containers/Page/one'
const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        {/* <MainRoute exact path="/" component={Home} /> */}

        {/* <Route exact path="/learn" component={Magazine} /> */}
                
       
        <MainRoute exact path="/magazines/:category" component={AllPosts} />
        <MainRoute exact path="/magazine/:slug" component={SinglePost} />
        <MainRoute exact path="/magazines" component={AllPosts} />
        <WithFooter exact path="/:signup/:member" component={NewHome} />
        <WithFooter exact path="/" component={NewHome} />
        {/* <Route exact path="/test/:signup/:member" component={Test } /> */}
        <WithFooter exact path="/test1" component={New} />
        <WithFooter exact path="/:signup/:member" component={One} />
        <WithFooter exact path="/one" component={One} />
        <Route exact path="/test" component={Test} />
        <MainRoute exact path="/help-us/thank-you" component={ThankYou} />
        <MainRoute exact path="/contact-us" component={contact} />
        <MainRoute exact path="/customer-details" component={CustomerDetails} />
        <MainRoute exact path="/forgot-password" component={ForgottenPassword} />
        <MainRoute exact path="/reset-password" component={ResetPassword} />
        <PrivateRoute exact path="/prive-user" component={PriveUser} />
        <MainRoute exact path="/profile" component={profile} />
        <MainRoute exact path="/password-link-expired" component={PasswordLinkExpired} />
        <Route exact path="/post-comment">
          <PostComment />
        </Route>
        <MainRoute path="/:id" component={Pages} />

        {/* <Route exact path="/page-not-found" component={NotFound} /> */}
      </Switch>
    </ConnectedRouter >
  );
}

export default PublicRoutes;
