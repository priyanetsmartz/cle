import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import ReactFullpage from '@fullpage/react-fullpage';
import { getHomePageProducts } from '../../../redux/pages/customers';
import CategoryBanner from './banner';
import HtmlContent from '../../partials/htmlContent';
import PriveExclusive from './priveExclusive';
import LatestProducts from './latestProducts';
import PromotedProducts from './promotedProducts';
import Magazine from '../home/magazine';
import NewIn from './newIn';


function Categories(props) {
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [products, setProducts] = useState({
        newInProducts: [],
        customerProducts: [],
        bestSellers: []
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getHomePageProducts(props.languages, customerId);
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
                                    <CategoryBanner />
                                </div>
                                <div className="section" >
                                    <PriveExclusive />
                                </div>
                                <div className="section" >
                                    <LatestProducts />
                                </div>
                                <div className="section" >
                                    <PromotedProducts />
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
                        <CategoryBanner />
                    </div>
                    <div className="section" >
                        <PriveExclusive />
                    </div>
                    <div className="section" >
                        <LatestProducts />
                    </div>
                    <div className="section" >
                        <PromotedProducts />
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
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(Categories);