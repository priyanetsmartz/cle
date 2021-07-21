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
import AllPosts from './containers/Page/magazineList';
import HelpUs from './containers/Page/helpUs';
import ThankYou from './containers/Page/ThankYou';
import ResetPassword from './containers/Page/ResetPassoword';
import SocialCheckout from './containers/Page/SocialCheckout';

const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <MainRoute exact path="/" component={Home} />
          <MainRoute exact path="/partnership" component={PartnerShip} />
          <MainRoute exact path="/help-us" component={HelpUs} />
          <MainRoute exact path="/help-us/thank-you" component={ThankYou} />
          <MainRoute exact path="/magazine" component={Magazine} />
          <MainRoute exact path="/checkout-us" component={SocialCheckout} />
          <MainRoute exact path="/magazine/see-all" component={AllPosts} />
          <MainRoute exact path="/magazine/:slug" component={SinglePost} />
          <Route exact path="/forgot-password">
            <ForgottenPassword />
          </Route>
          <Route exact path="/reset-password">
            <ResetPassword />
          </Route>
          <MainRoute path="/:id" component={Pages} />
          <Route exact path="/post-comment">
            <PostComment />
          </Route>
          {/* <Route exact path="/page-not-found" component={NotFound} /> */}
        </Switch>
      </div>
    </ConnectedRouter >
  );
}

export default PublicRoutes;
