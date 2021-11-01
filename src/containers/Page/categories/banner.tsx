import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useParams } from "react-router-dom";
import { getCookie, setCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";


function CategoryBanner(props) {
    const { category, subcat, childcat, greatchildcat } = useParams();
    const location = useLocation()
    const [urlPathLink, setUrlPath] = useState('');
    const [categoryData, setCategory] = useState({
        name: '',
        custom_attributes: [],
        custom: {
            image: '',
            desc: ''
        }
    })

    useEffect(() => {
        if (props.ctId) {
            setCookie("_TESTCOOKIE", props.ctId)
        }

        if (props.cateData) {
            setCategory(props.cateData);
        }

    }, [props.languages, location, props.cateData, props.ctId]);


    return (
        <>
            <section className="DC-top-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 position-relative">
                            <img src={categoryData.custom.image} alt="" />
                            <div className="DC-top-ban-inner">
                                <h2>{categoryData.name}</h2>
                                <div dangerouslySetInnerHTML={{ __html: categoryData.custom.desc }} />
                                {
                                    props.urls !== undefined ? <Link to={props.urls} className="ban-btn" > <IntlMessages id="category.viewAll" /></Link> : <Link to={`/products`} className="ban-btn"> <IntlMessages id="category.viewAll" /></Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    // if (state && state.Cart.category_data) {
    //     cateData = state.Cart.category_data
    // }

    return {
        languages: languages,
        ///  cateData: cateData
    }
}

export default connect(
    mapStateToProps
)(CategoryBanner);