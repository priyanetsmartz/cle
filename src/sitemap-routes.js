import React from 'react';
import { Route } from 'react-router';
export default (
    <Route>
	        
            {/* <Route exact path='/products/:category/:subcat/:childcat/:greatchildcat' />
            <Route exact path='/products/:category/:subcat/:childcat'  />
            <Route exact path='/products/:category/:subcat/:id'  />
            <Route exact path='/products/:category/:subcat'  /> */}
            <Route exact path='/products/:category'  />
  
            <Route exact path='/product-details/:sku' />
            
            {/* <Route exact path='/magazines/:category'  />
            <Route exact path='/magazine/:slug'  />
            <Route exact path='/magazines'  /> */}
  
            <Route exact path='/:cms'/>
            {/* <Route exact path='/contact-us'  />
            <Route exact path='/help-center'   />
            
            <Route exact path='/products' />
            <Route exact path='/my-cart' />
            <Route exact path='/checkout' /> */}
                     
    </Route>
);