import React from "react";
import Breadcrumbs from './locationBreadcrumbs';
function AppBreadcrumbs(props) {
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            {/* <AppBreadcrumbs />  */}
            <Breadcrumbs />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppBreadcrumbs