import { useState } from 'react';
import { connect } from 'react-redux'
import cartAction from "../../../redux/cart/productAction";
import ReactFullpage from '@fullpage/react-fullpage';
import CategoryBanner from './banner';
import PriveExclusive from './priveExclusive';
import LatestProducts from './latestProducts';
import BrandedProducts from './brandedProducts';
import Magazine from '../home/magazine';
import NewIn from './newIn';
import NewInDescription from './newInDescription';

function Categories(props) {

    return (
        <main>
            <ReactFullpage
                //fullpage options
                licenseKey='BC3287DC-D6A247E6-834B93FA-A1FE7092'
                scrollingSpeed={1200} /* Options here */

                render={({ state, fullpageApi }) => {
                    return (
                        <ReactFullpage.Wrapper>
                            <div className="section">
                                <CategoryBanner />
                            </div>
                            <div className="section">
                                <PriveExclusive />
                            </div>
                            <div className="section">
                                <LatestProducts />
                            </div>
                            <div className="section">
                                <BrandedProducts />
                            </div>
                            <div className="section">
                                <Magazine />
                            </div>
                            <div className="section">
                                <NewIn />
                            </div>
                            <div className="section">
                                <NewInDescription />
                            </div>

                        </ReactFullpage.Wrapper>
                    );
                }}
            />
        </main>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(Categories);