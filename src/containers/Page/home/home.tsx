import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import ReactFullpage from '@fullpage/react-fullpage';
import { getHomePageProducts } from '../../../redux/pages/customers';
import HtmlContent from '../../partials/htmlContent';
import Personal from './personal';
import BestSeller from './bestSeller';
import NewIn from './newIn';
import WeChooseForYou from './weChooseForYou';
import Magazine from './magazine';
import BecomePartner from './becomePartner';


function HomePage(props) {
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
                    // licenseKey='BC3287DC-D6A247E6-834B93FA-A1FE7092'
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
                                    <HtmlContent identifier="home_page_banner" />
                                </div>
                                <div className="section" >
                                    <Personal />
                                </div>
                                <div className="section" >
                                    <HtmlContent identifier="home_page_discover_categories" />
                                </div>
                                <div className="section" >
                                    <NewIn newInProducts={products.newInProducts} />
                                </div>
                                <div className="section" >
                                    <WeChooseForYou customerProducts={products.customerProducts} />
                                </div>
                                <div className="section" >
                                    <HtmlContent identifier="home_page_pre-owned_category" />
                                </div>
                                <div className="section">
                                    <HtmlContent identifier="home_page_brown_london_section" />
                                </div>
                                <div className="section">
                                    <BestSeller bestSellers={products.bestSellers} />
                                </div>
                                <div className="section">
                                    <Magazine />
                                </div>
                                <div className="section">
                                    <BecomePartner />
                                </div>
                            </div>
                        )
                    }}
                />
            </BrowserView>
            <MobileView>
                <div className="sectiosn" >
                    <div className="section">
                        <HtmlContent identifier="home_page_banner" />
                    </div>
                    <div className="section" >
                        <Personal />
                    </div>
                    <div className="section" >
                        <HtmlContent identifier="home_page_discover_categories" />
                    </div>
                    <div className="section" >
                        <NewIn newInProducts={products.newInProducts} />
                    </div>
                    <div className="section" >
                        <WeChooseForYou customerProducts={products.customerProducts} />
                    </div>
                    <div className="section" >
                        <HtmlContent identifier="home_page_pre-owned_category" />
                    </div>
                    <div className="section">
                        <HtmlContent identifier="home_page_brown_london_section" />
                    </div>
                    <div className="section">
                        <BestSeller bestSellers={products.bestSellers} />
                    </div>
                    <div className="section">
                        <Magazine />
                    </div>
                    <div className="section">
                        <BecomePartner />
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
)(HomePage);