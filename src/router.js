import React from "react";
import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router';

import Home from './containers/Page/home';
import SignUp from './containers/Page/signup';
import NotFound from './containers/Page/404';

import PrivateRoute from "./components/private-route/PrivateRoute";

const PublicRoutes = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
        
          <Route exact path="/signup">
            <SignUp />
          </Route>
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
