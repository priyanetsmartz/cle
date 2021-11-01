import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
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
import appAction from "../../../redux/app/actions";
import { getCookie, setCookie } from '../../../helpers/session';
const { showLoader } = appAction;
function HomePage(props) {
    let relevantCookies = getCookie("relevant");
    const [token, setToken] = useState('');
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [choosen, setChoose] = useState([]);
    const [products, setProducts] = useState({
        newInProducts: [],
        customerProducts: []
    });
    useEffect(() => {
        props.showLoader(true)
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
        };
    }, []);

    const getData = async () => {
        let result: any = await getHomePageProducts(props.languages, 12, '');
        if (result) {
            setProducts(result.data[0]);
        }
        // if (relevantCookies === 'true') {
        //     console.log(typeof (relevantCookies), relevantCookies)
        // }

        if (customerId) {
            let result: any = await getWeChooseForYou(props.languages, customerId);

            if (result && result.data && result.data[0] && result.data[0].customerProducts.length > 0) {
                setCookie("relevant", true)
                setChoose(result.data[0].customerProducts);
            } else {
                setCookie("relevant", false)
            }

        } else {
            setCookie("relevant", false)
        }
    }



    // const onLeave = () => { }

    // const afterLoad = () => { }

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
            {relevantCookies == 'true' && (
                <div className="section" key='uniqueKey2' >
                    <WeChooseForYou choosenData={choosen} />
                </div>)}
            <div className="section" >
                <HtmlContent identifier="home_page_pre-owned_category" />
            </div>
            {/* <div className="section">
                <HtmlContent identifier="home_page_brown_london_section" />
            </div> */}
            <div className="section">
                <BestSeller />
            </div>
            {/* <div className="section">
                <Magazine />
            </div> */}
            <div className="section">
                <BecomePartner />
            </div>
            <div className="section footer">
                <Footer />
            </div>
        </div>
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
    mapStateToProps,
    { showLoader }
)(HomePage);