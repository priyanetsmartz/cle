import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import ReactFullpage from '@fullpage/react-fullpage';
import { getHomePageProducts, getWeChooseForYou } from '../../../redux/pages/customers';
import HomeBanner from './banner';
import HtmlContent from '../../partials/htmlContent';
import Personal from './personal';
import BestSeller from './bestSeller';
import NewIn from './newIn';
import WeChooseForYou from './weChooseForYou';
import Magazine from './magazine';
import BecomePartner from './becomePartner';
import Footer from '../../../containers/partials/footer-new';
import Header from '../../../containers/partials/headerMenu';
import { getCookie, setCookie } from '../../../helpers/session';
function HomePage(props) {
    const relevantCookies = getCookie("relevant");
    const [token, setToken] = useState('');
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [catId, setCatId] = useState(52); //set default category here
    const [choosen, setChoose] = useState([]);
    const [products, setProducts] = useState({
        newInProducts: [],
        customerProducts: []
    });
    useEffect(() => {
        const header = document.getElementById("headerrr");
        const sticky = header.offsetTop;
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky-fullpage");
            } else {
                header.classList.remove("sticky-fullpage");
            }
        });
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getData();

        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        }
    }, []);

    const getData = async () => {
        let result: any = await getHomePageProducts(props.languages, 12, '');
        if (result) {
            setProducts(result.data[0]);
        }
        if (customerId) {

            if (!relevantCookies) {
                let result: any = await getWeChooseForYou(props.languages, customerId);
                if (result.data[0] && result.data[0].relevantProducts.length > 0) {
                    console.log(result.data[0].relevantProducts.length)
                    setCookie("relevant", true)
                    setChoose(result.data[0].relevantProducts);
                }

            }
        }
    }


    // const onLeave = () => { }

    // const afterLoad = () => { }

    return (
        <>
            <BrowserView>
                <ReactFullpage
                    className="sectiosn"
                    sectionClassName='section'
                    scrollBar="true"
                    // normalScrollElements='.banner'
                    fixedElements='.cle-footer'
                    // licenseKey='BC3287DC-D6A247E6-834B93FA-A1FE7092'              
                    scrollingSpeed={500} /* Options here */
                    // onLeave={onLeave}
                    // afterLoad={afterLoad}


                    render={({ state, fullpageApi }) => {
                        return (
                            <div className="sectiosn" >
                                <div className="section headerrr" id="headerrr" key='uniqueKey'>
                                    <Header />
                                </div>
                                <div className="section banner">
                                    <HomeBanner />
                                    {/* <Personal /> */}
                                </div>
                                <div className="section personal-section" >
                                    <Personal />
                                </div>
                                <div className="section" >
                                    <HtmlContent identifier="home_page_discover_categories" />
                                </div>
                                <div className="section" >
                                    <NewIn newInProducts={products.newInProducts} />
                                </div>
                                {relevantCookies && (
                                    <div className="section" key='uniqueKey2' >
                                        <WeChooseForYou />
                                    </div>)}
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
                    <div className="section headerrr" id="headerrr" key='uniqueKey'>
                        <Header />
                    </div>
                    <div className="section">
                        <HomeBanner />
                    </div>
                    <div className="section">
                        <Personal />
                    </div>
                    <div className="section" >
                        <HtmlContent identifier="home_page_discover_categories" />
                    </div>
                    <div className="section" >
                        <NewIn newInProducts={products.newInProducts} />
                    </div>
                    {token && <div className="section" >
                        <WeChooseForYou />
                    </div>}
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
                    <div className="section footer">
                        <Footer />
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