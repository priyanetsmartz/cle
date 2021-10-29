import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails } from '../../../redux/pages/customers';
import CategoryBanner from './banner';
import PriveExclusive from './priveExclusive';
import LatestProducts from './latestProducts';
import PromotedProducts from './promotedProducts';
import NewIn from './newIn';
import Description from './description';
import Footer from '../../../containers/partials/footer-new';
import Header from '../../../containers/partials/headerMenu';
import { useLocation } from 'react-router-dom';
import { getCookie } from '../../../helpers/session';
import cartAction from "../../../redux/cart/productAction";
import AppBreadcrumbs from '../../partials/breadCrumbs';
const { getCategoryData } = cartAction;


function Categories(props) {
    const baseUrl = process.env.REACT_APP_API_URL;
    const location = useLocation()
    const [category, setCategory] = useState({
        name: '',
        custom_attributes: [],
        custom: {
            image: '',
            desc: ''
        }
    })
    let catID = getCookie("_TESTCOOKIE");

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
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, [location]);
    useEffect(() => {
        let catID = getCookie("_TESTCOOKIE");
        getData(catID);
        return () => {
            //
        };
    }, [props.languages, catID, location]);

    const getData = async (catID) => {
        let result: any = await getCategoryDetails(props.languages, catID);
        if (result && result.data) {
            let obj: any = {};
            result.data.custom_attributes.forEach(el => {
                if (el.attribute_code === "image") {
                    obj.image = baseUrl + el.value;
                } else if (el.attribute_code === "description") {
                    obj.desc = el.value;
                }
                result.data.custom = obj;
            });
            setCategory(result.data);
            // props.getCategoryData(result.data);
        }
    }


    return (
        <div className="sectiosn" >
            <div className="section headerrr" id="headerrr" key='uniqueKey'>
                <Header />
            </div>
            <div className="section banner">
                <CategoryBanner cateData={category} />
                <AppBreadcrumbs />
            </div>
            {localStorage.getItem('token') === '4' && <div className="section" >
                <PriveExclusive />
            </div>}
            <div className="section" >
                <LatestProducts />
            </div>
            {/* <div className="section" >
                <PromotedProducts cateData={category} />
            </div> */}
            {/* <div className="section">
                <Magazine />
            </div> */}
            <div className="section">
                <NewIn />
            </div>
            <div className="section">
                <Description cateData={category} />
            </div>
            <div className="section footer">
                <Footer />
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    // console.log(state)
    let languages = '', cateData = {};

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    if (state && state.Cart.category_data) {
        cateData = state.Cart.category_data
    }

    return {
        languages: languages,
        cateData: cateData

    }
}

export default connect(
    mapStateToProps,
    { getCategoryData }
)(Categories);