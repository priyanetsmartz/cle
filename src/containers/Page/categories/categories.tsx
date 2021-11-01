import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails, getCategoryDetailsbyUrlPath } from '../../../redux/pages/customers';
import CategoryBanner from './banner';
import PriveExclusive from './priveExclusive';
import LatestProducts from './latestProducts';
import PromotedProducts from './promotedProducts';
import { Link, useParams } from "react-router-dom";
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
    const { category, subcat, childcat, greatchildcat } = useParams();
    // console.log(category, subcat, childcat, greatchildcat)
    const baseUrl = process.env.REACT_APP_API_URL;
    const location = useLocation()
    const [categoryId, setCategoryId] = useState(0);
    const [urlPathLink, setUrlPath] = useState('');
    const [categories, setCategory] = useState({
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
        // let catID = getCookie("_TESTCOOKIE");
        // if (catID) {
        //     getData(catID);
        // } else {
        //     let urlPath = location + "/" + category + "/" + subcat / childcat;
        //     console.log(urlPath)
        // }
        let urlPath = '';
        if (category && subcat && childcat && greatchildcat) {            
            urlPath = category + "/" + subcat + "/" + childcat + '/' + greatchildcat;
        } else if (category && subcat && childcat) {
            urlPath = category + "/" + subcat + "/" + childcat;
        } else if (category && subcat) {
            urlPath = category + "/" + subcat;
        } else {
            urlPath = category;
        }
        let urlPathdata = '/products/' + urlPath + '/all';
        setUrlPath(urlPathdata);
        getData(urlPath)
        return () => {
            //
        };
    }, [props.languages, catID, location, category, subcat, childcat, greatchildcat]);

    const getData = async (urlPath) => {
        let result: any = await getCategoryDetailsbyUrlPath(props.languages, urlPath);
        //  console.log(result.data.items[0].custom_attributes);
        // let result: any = await getCategoryDetails(props.languages, catID);
        if (result && result.data && result.data.items && result.data.items.length > 0 && result.data.items[0].custom_attributes && result.data.items[0].custom_attributes.length > 0) {
            let obj: any = {};

            result.data.items[0].custom_attributes.forEach(el => {
                if (el.attribute_code === "image") {
                    obj.image = baseUrl + el.value;
                } else if (el.attribute_code === "description") {
                    obj.desc = el.value;
                }
                result.data.custom = obj;
            });
            // console.log(result.data.items[0].id)
            setCategoryId(result.data.items[0].id)
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
                <CategoryBanner cateData={categories} ctId={categoryId} urls={urlPathLink} />
                <AppBreadcrumbs />
            </div>
            {localStorage.getItem('token') === '4' && <div className="section" >
                <PriveExclusive />
            </div>}
            <div className="section" >
                <LatestProducts ctId={categoryId} />
            </div>
            {/* <div className="section" >
                <PromotedProducts cateData={categories} />
            </div> */}
            {/* <div className="section">
                <Magazine />
            </div> */}
            <div className="section">
                <NewIn ctId={categoryId} urls={urlPathLink} />
            </div>
            <div className="section">
                <Description cateData={categories} />
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