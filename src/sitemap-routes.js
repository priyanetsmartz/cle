import React from 'react';
import { Route } from 'react-router';
export default (
    <Route>
        <Route exact path='/products/:category' />

        <Route exact path='/product-details/:sku' />

        <Route exact path='/:cms' />

    </Route>
);