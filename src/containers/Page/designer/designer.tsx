import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import ReactFullpage from '@fullpage/react-fullpage';
import { getHomePageProducts } from '../../../redux/pages/customers';
import HtmlContent from '../../partials/htmlContent';
import Magazine from '../home/magazine';
import PriveExclusive from '../categories/priveExclusive';
import Description from '../categories/description';


function DesignerCategories(props) {
    const [catId, setCatId] = useState(52); //set default category here
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
                                    <HtmlContent identifier="design_category_banner_image" />
                                </div>
                                {props.token.token === '4' && <div className="section" >
                                    <PriveExclusive />
                                </div>}
                                <div className="section" >
                                    <HtmlContent identifier="design_category_popular_designers" />
                                </div>
                                <div className="section" >
                                    <HtmlContent identifier="design_category_explore_designers" />
                                </div>
                                <div className="section">
                                    <Magazine />
                                </div>
                                <div className="section" >
                                    <Description catId={153}/>
                                </div>
                            </div>
                        )
                    }}
                />
            </BrowserView>
            <MobileView>
                <div className="sectiosn" >
                    <div className="section">
                        <HtmlContent identifier="design_category_banner_image" />
                    </div>
                    {props.token.token == '4' && <div className="section" >
                        <PriveExclusive />
                    </div>}
                    <div className="section" >
                        <HtmlContent identifier="home_page_discover_categories" />
                    </div>
                    <div className="section" >
                        <HtmlContent identifier="design_category_explore_designers" />
                    </div>
                    <div className="section">
                        <Magazine />
                    </div>
                    <div className="section" >
                        <Description catId={153}/>
                    </div>
                </div>
            </MobileView>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps
)(DesignerCategories);