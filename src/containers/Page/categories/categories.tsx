import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import ReactFullpage from '@fullpage/react-fullpage';
import { getHomePageProducts } from '../../../redux/pages/customers';
import HtmlContent from '../../partials/htmlContent';
import PriveExclusive from './priveExclusive';
import LatestProducts from './latestProducts';
import BrandedProducts from './brandedProducts';
import Magazine from '../home/magazine';
import NewIn from './newIn';


function Categories(props) {
    const [products, setProducts] = useState({
        newInProducts: [],
        customerProducts: [],
        bestSellers: []
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getHomePageProducts();
        if (result) {
            setProducts(result.data[0]);
        }
    }


    const onLeave = () => { }

    const afterLoad = () => { }

    return (
        <>
            <BrowserView>
                <ReactFullpage
                    licenseKey='BC3287DC-D6A247E6-834B93FA-A1FE7092'
                    //fullpage options
                    // anchors={anchors}
                    scrollingSpeed={500} /* Options here */
                    onLeave={onLeave}
                    afterLoad={afterLoad}

                    className="sectiosn"
                    sectionClassName='section'
                    //normalScrollElements='.checkus-out'
                    scrollBar="true"
                    render={({ state, fullpageApi }) => {
                        return (
                            <div className="sectiosn" >
                                <div className="section">
                                    {/* change indentifier */}
                                    <HtmlContent identifier="home_page_banner" />
                                </div>
                                <div className="section" >
                                    <PriveExclusive />
                                </div>
                                <div className="section" >
                                    <LatestProducts />
                                </div>
                                <div className="section" >
                                    <BrandedProducts />
                                </div>
                                <div className="section">
                                    <Magazine />
                                </div>
                                <div className="section">
                                    <NewIn />
                                </div>
                                <div className="section">
                                    {/* change indentifier */}
                                    <HtmlContent identifier="home_page_banner" />
                                </div>

                            </div>
                        )
                    }}
                />
            </BrowserView>
            <MobileView>
                <div className="sectiosn" >
                    <div className="section">
                        {/* change indentifier */}
                        <HtmlContent identifier="home_page_banner" />
                    </div>
                    <div className="section" >
                        <PriveExclusive />
                    </div>
                    <div className="section" >
                        <LatestProducts />
                    </div>
                    <div className="section" >
                        <BrandedProducts />
                    </div>
                    <div className="section">
                        <Magazine />
                    </div>
                    <div className="section">
                        <NewIn />
                    </div>
                    <div className="section">
                        {/* change indentifier */}
                        <HtmlContent identifier="home_page_banner" />
                    </div>
                </div>
            </MobileView>
        </>
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