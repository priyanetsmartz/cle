import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import ReactFullpage from '@fullpage/react-fullpage';
import { getHomePageProducts } from '../../../redux/pages/customers';
import Personal from './personal';
import BestSeller from './bestSeller';
import Designer from './designer';
import DiscoverCategories from './discoverCategories';
import NewIn from './newIn';
import PreCategories from './preCategories';
import WeChooseForYou from './weChooseForYou';
import Welcome from './welcome';
import Magazine from './magazine';


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


    const onLeave = () => {}

    const afterLoad = () => {}

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
                                    <Welcome />
                                </div>
                                <div className="section" >
                                    <Personal />
                                </div>
                                <div className="section" >
                                    <DiscoverCategories />
                                </div>
                                <div className="section" >
                                    <NewIn newInProducts={products.newInProducts}/>
                                </div>
                                <div className="section" >
                                    <WeChooseForYou customerProducts={products.customerProducts}/>
                                </div>
                                <div className="section" >
                                    <PreCategories />
                                </div>
                                <div className="section">
                                    <Designer />
                                </div>
                                <div className="section">
                                    <BestSeller bestSellers={products.bestSellers}/>
                                </div>
                                <div className="section">
                                    <Magazine/>
                                </div>
                            </div>
                        )
                    }}
                />
            </BrowserView>
            <MobileView>
                <div className="sectiosn" >
                    <div className="section">
                        <Welcome />
                    </div>
                    <div className="section" >
                        <Personal />
                    </div>
                    <div className="section" >
                        <DiscoverCategories />
                    </div>
                    <div className="section" >
                        <NewIn newInProducts={products.newInProducts}/>
                    </div>
                    <div className="section" >
                        <WeChooseForYou customerProducts={products.customerProducts}/>
                    </div>
                    <div className="section" >
                        <PreCategories />
                    </div>
                    <div className="section">
                        <Designer />
                    </div>
                    <div className="section">
                        <BestSeller bestSellers={products.bestSellers}/>
                    </div>
                    <div className="section">
                        <Magazine/>
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