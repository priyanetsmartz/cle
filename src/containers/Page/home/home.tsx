import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import HomeBanner from './banner';
import { useParams } from "react-router-dom";
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
import cartAction from "../../../redux/cart/productAction";
import { getCategoryDetailsbyUrlKeyFxn, getHomePageProductsFxn } from '../../../components/utility/allutils';
const { showLoader } = appAction;
const { setCatSearch } = cartAction;
function HomePage(props) {
    const { categoryname } = useParams();
    const [categoryId, setCategoryId] = useState(props.currentId);
    const [products, setProducts] = useState({
        newInProducts: [],
        customerProducts: []
    });

    useEffect(() => {
        let categoryNAME = categoryname === props.currentCAT ? props.currentCAT : categoryname === undefined ? 'women' : categoryname;
        console.log(categoryNAME)
        if (categoryNAME) {
            getData(categoryNAME);
        }
        return () => {
            // window.removeEventListener("scroll", scrollCallBack);
        };
    }, [props.languages, props.currentCAT]);



    const getData = async (categoryNAME) => {

        let cateData: any = await getCategoryDetailsbyUrlKeyFxn(props.languages, categoryNAME);
        if (cateData.items && cateData.items.length > 0) {
            setCategoryId(cateData.items[0].id)
            props.setCatSearch(cateData.items[0].id)
            let result: any = await getHomePageProductsFxn(props.languages, cateData.items[0].id)
            setProducts(result);
        }
    }
    return (
        <div className="sectiosn" id='topheaderrr' >
            <div className="section headerrr" id="headerrr" key='uniqueKey'>
                <Header />
            </div>
            <div className="section banner">
                <HomeBanner categoryName={categoryname === props.currentCAT ? props.currentCAT : categoryname} />
            </div>
            <div className="section personal-section" >
                <Personal categoryName={categoryname === props.currentCAT ? props.currentCAT : categoryname} />
            </div>
            <div className="section" >
                <HtmlContent identifier={categoryname === props.currentCAT ? `home_page_discover_categories_${props.currentCAT}` : categoryname ? `home_page_discover_categories_${categoryname}` : 'home_page_discover_categories'} />
            </div>
            <div className="section" >
                <NewIn newInProducts={products['newInProducts']} />
            </div>
            <div className="section wechoose" key='uniqueKey2' >
                <WeChooseForYou />
            </div>
            <div className="section" >
                <HtmlContent identifier="home_page_pre-owned_category" />
            </div>
            <div className="section">
                <BestSeller bestSeller={products['bestSeller']} />
            </div>
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
    //console.log(state.Cart.catname)

    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages,
        token: state.session.user,
        currentId: state.Cart.catIdd,
        currentCAT: state.Cart.catname
    }
}

export default connect(
    mapStateToProps,
    { showLoader, setCatSearch }
)(HomePage);