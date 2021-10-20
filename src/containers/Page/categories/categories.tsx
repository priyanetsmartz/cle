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
import Description from './description';
import Footer from '../../../containers/partials/footer-new';

function Categories(props) {
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [catId, setCatId] = useState(props.categoryId); //set default category here
    const [products, setProducts] = useState({
        newInProducts: [],
        customerProducts: [],
        bestSellers: []
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
                                    <CategoryBanner />
                                </div>
                                {localStorage.getItem('token') === '4' && <div className="section" >
                                    <PriveExclusive />
                                </div>}
                                <div className="section" >
                                    <LatestProducts />
                                </div>
                                {/* <div className="section" >
                                    <PromotedProducts />
                                </div> */}
                                {/* <div className="section">
                                    <Magazine />
                                </div> */}
                                <div className="section">
                                    <NewIn />
                                </div>
                                <div className="section">
                                    <Description catId={153} />
                                </div>
                                <div className="section footer">
                                    <Footer />
                                </div>
                            </div>
                        )
                    }}
                />
            </BrowserView>
            <MobileView>
                <div className="sectiosn" >
                    <div className="section">
                        <CategoryBanner />
                    </div>
                    {localStorage.getItem('token') === '4' && <div className="section" >
                        <PriveExclusive />
                    </div>}
                    <div className="section" >
                        <LatestProducts />
                    </div>
                    {/* <div className="section" >
                        <PromotedProducts />
                    </div> */}
                    {/* <div className="section">
                        <Magazine />
                    </div> */}
                    <div className="section">
                        <NewIn />
                    </div>
                    <div className="section">
                        <Description catId={153} />
                    </div>
                    <div className="section footer">
                        <Footer />
                    </div>
                </div>
            </MobileView>
        </>
    )
}
const mapStateToProps = (state) => {
   // console.log(state)
    let languages = '', categoryId = 52;

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    if (state.App && state.App.menuId) {
        categoryId = state.App.menuId
    }

    return {
        languages: languages,
        categoryId: categoryId
    }
}

export default connect(
    mapStateToProps
)(Categories);