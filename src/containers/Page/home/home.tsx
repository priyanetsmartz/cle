import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import ReactFullpage from '@fullpage/react-fullpage';
import { getHomePageProducts } from '../../../redux/pages/customers';
import HomeBanner from './banner';
import HtmlContent from '../../partials/htmlContent';
import Personal from './personal';
import BestSeller from './bestSeller';
import NewIn from './newIn';
import WeChooseForYou from './weChooseForYou';
import Magazine from './magazine';
import BecomePartner from './becomePartner';


function HomePage(props) {
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [catId, setCatId] = useState(52); //set default category here
    const [products, setProducts] = useState({
        newInProducts: [],
        customerProducts: []
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getHomePageProducts(props.languages, customerId, catId);
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
                    scrollingSpeed={500} /* Options here */
                    onLeave={onLeave}
                    afterLoad={afterLoad}
                    //normalScrollElements='.checkus-out'
                    className="sectiosn"
                    sectionClassName='section'
                    scrollBar="true"
                    render={({ state, fullpageApi }) => {
                        return (
                            <div className="sectiosn" >
                                <div className="section">
                                    <HomeBanner />
                                    <Personal />
                                </div>
                                <div className="section" >
                                    <HtmlContent identifier="home_page_discover_categories" />
                                </div>
                                <div className="section" >
                                    <NewIn newInProducts={products.newInProducts} />
                                </div>
                                <div className="section" >
                                    <WeChooseForYou />
                                </div>
                                <div className="section" >
                                    <HtmlContent identifier="home_page_pre-owned_category" />
                                </div>
                                <div className="section">
                                    <HtmlContent identifier="home_page_brown_london_section" />
                                </div>
                                <div className="section">
                                    <BestSeller />
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
                        <HomeBanner />
                        <Personal />
                    </div>
                    <div className="section" >
                        <HtmlContent identifier="home_page_discover_categories" />
                    </div>
                    <div className="section" >
                        <NewIn newInProducts={products.newInProducts} />
                    </div>
                    <div className="section" >
                        <WeChooseForYou />
                    </div>
                    <div className="section" >
                        <HtmlContent identifier="home_page_pre-owned_category" />
                    </div>
                    <div className="section">
                        <HtmlContent identifier="home_page_brown_london_section" />
                    </div>
                    <div className="section">
                        <BestSeller />
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
)(HomePage);