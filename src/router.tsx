import React from "react";
import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';

import Home from './containers/Page/home';
import NotFound from './containers/Page/404';
import Magazine from './containers/Page/magazine';
import ForgottenPassword from './containers/Page/forgotPassword';
import PostComment from './containers/Page/postComments';
import AboutUs from './containers/Page/aboutUs';
import Pages from './containers/Page/pages';
import PrivateRoute from "./components/private-route/PrivateRoute";

const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          {/* 
          <Route exact path="/signup">
            <SignUp />
          </Route>

          <Route exact path="/signin">
            <SignIn />
          </Route> */}
          <Route exact path="/forgot-password">
            <ForgottenPassword />
          </Route>
          <Route exact path="/magazine">
            <Magazine />
          </Route>
          <Route exact path="/post-comment">
            <PostComment />
          </Route>

          {/* <PrivateRoute exact path="/about-us" component={AboutUs} /> */}
          <Route path="/:id" component={Pages} />
          <Route component={NotFound} />
          {/* <RestrictedRoute+
          path="/dashboard"
          component={App}
          isLoggedIn={isLoggedIn}
        /> */}
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default PublicRoutes;
