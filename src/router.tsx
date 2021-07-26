import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';
// import About from './containers/Page/about';
import Magazine from './containers/Page/magazine';
import SinglePost from './containers/Page/singlePost';
import ForgottenPassword from './containers/Page/forgotPassword';
import PostComment from './containers/Page/postComments';
import Pages from './containers/Page/pages';
import MainRoute from "./components/all-route/MainRoute";
import WithFooter from "./components/all-route/withFooter";
import AllPosts from './containers/Page/magazineCategory';
import newHome from './containers/Page/anewpage';
import ThankYou from './containers/Page/ThankYou';
import ResetPassword from './containers/Page/ResetPassoword';
import profile from './containers/Page/profile';
import contact from "./containers/Page/contact";

const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        {/* <MainRoute exact path="/" component={Home} /> */}

        <MainRoute exact path="/magazine" component={Magazine} />
        <WithFooter exact path="/magazines/:category" component={AllPosts} />
        <WithFooter exact path="/magazines" component={AllPosts} />
        <WithFooter exact path="/magazine/:slug" component={SinglePost} />
        <WithFooter exact path="/:signup/:member" component={newHome} />
        <WithFooter exact path="/" component={newHome} />
        <MainRoute exact path="/help-us/thank-you" component={ThankYou} />
        <WithFooter exact path="/contact-us" component={contact} />
        <WithFooter exact path="/forgot-password" component={ForgottenPassword} />
        <WithFooter exact path="/reset-password" component={ResetPassword} />
        <MainRoute exact path="/profile" component={profile} />
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
