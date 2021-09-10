import { useState } from 'react';
import { connect } from 'react-redux'
import cartAction from "../../../redux/cart/productAction";
import ReactFullpage from '@fullpage/react-fullpage';

function DesignerCategories(props) {

    return (
        <h3>Designer Categories!</h3>
        // <main>
        //     <ReactFullpage
        //         //fullpage options
        //         licenseKey='BC3287DC-D6A247E6-834B93FA-A1FE7092'
        //         scrollingSpeed={1200} /* Options here */

        //         render={({ state, fullpageApi }) => {
        //             return (
        //                 <ReactFullpage.Wrapper>
        //                     <div className="section">
        //                         <CategoryBanner />
        //                     </div>
        //                     <div className="section">
        //                         <PriveExclusive />
        //                     </div>
        //                     <div className="section">
        //                         <LatestProducts />
        //                     </div>
        //                     <div className="section">
        //                         <BrandedProducts />
        //                     </div>
        //                     <div className="section">
        //                         <Magazine />
        //                     </div>
        //                     <div className="section">
        //                         <NewIn />
        //                     </div>
        //                     <div className="section">
        //                         <NewInDescription />
        //                     </div>

        //                 </ReactFullpage.Wrapper>
        //             );
        //         }}
        //     />
        // </main>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(DesignerCategories);