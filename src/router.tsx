import React from "react";
import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';

import Home from './containers/Page/home';
import NotFound from './containers/Page/404';
import Magazine from './containers/Page/magazine';
import SinglePost from './containers/Page/singlePost';
import ForgottenPassword from './containers/Page/forgotPassword';
import PostComment from './containers/Page/postComments';
import PartnerShip from './containers/Page/partnerShip';
import Pages from './containers/Page/pages';
import MainRoute from "./components/all-route/MainRoute";
import WithFooter from "./components/all-route/withFooter";
import AllPosts from './containers/Page/magazineCategory';
import newHome from './containers/Page/anewpage';
import HelpUs from './containers/Page/helpUs';
import ThankYou from './containers/Page/ThankYou';
import ResetPassword from './containers/Page/ResetPassoword';
import SocialCheckout from './containers/Page/SocialCheckout';
import newpage from './containers/Page/new-home';
const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <MainRoute exact path="/" component={Home} />
          <WithFooter exact path="/home" component={newHome} />
          <WithFooter exact path="/new-home" component={newpage} />
          {/* <MainRoute exact path="/partnership" component={PartnerShip} /> */}
          <MainRoute exact path="/help-us" component={HelpUs} />
          <MainRoute exact path="/help-us/thank-you" component={ThankYou} />
          <MainRoute exact path="/magazine" component={Magazine} />
          <WithFooter exact path="/magazine/see-all" component={AllPosts} />
          <WithFooter exact path="/magazine/:slug" component={SinglePost} />
          <MainRoute exact path="/checkout-us" component={SocialCheckout} />
          <WithFooter exact path="/forgot-password" component={ForgottenPassword} />
          <WithFooter exact path="/reset-password" component={ResetPassword} />
          <Route exact path="/post-comment">
            <PostComment />
          </Route>
          <MainRoute path="/:id" component={Pages} />
         
          {/* <Route exact path="/page-not-found" component={NotFound} /> */}
        </Switch>
      </div>
    </ConnectedRouter >
  );
}

export default PublicRoutes;
