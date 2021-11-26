import { useState ,useEffect} from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";


function CategoryBanner(props) {
    const [categoryData, setCategory] = useState([])

    useEffect(() => {
        if (props.cateData) {
            let cat = [];
            cat['name'] = props.cateData && props.cateData.items && props.cateData.items.length > 0 ? props.cateData.items[0].name : '';
            cat['image'] = props.cateData.custom.image;
            cat['description'] = props.cateData.custom.desc;
            setCategory(cat);           
        }

    }, [props.languages, props.cateData, props.ctId]);


    return (
        <>
            <section className="DC-top-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 position-relative">
                            <img src={categoryData['image']} alt="" />
                            <div className="DC-top-ban-inner">
                                <h2>{categoryData['name']}</h2>
                                <div dangerouslySetInnerHTML={{ __html: categoryData['description'] }} />
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