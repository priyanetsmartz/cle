import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";
import { getCookie } from '../../../helpers/session';


function CategoryBanner(props) {
    const baseUrl = process.env.REACT_APP_API_URL;
    let catID = getCookie("_TESTCOOKIE");
    const [category, setCategory] = useState({
        name: '',
        custom_attributes: [],
        custom: {
            image: '',
            desc: ''
        }
    })
    const [catId, setCatId] = useState(catID)

    useEffect(() => {
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getCategoryDetails(props.languages, catId);

        if (result) {
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
        }
    }

    return (
        <>
            <section className="DC-top-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 position-relative">
                            <img src={category.custom.image} alt="" />
                            <div className="DC-top-ban-inner">
                                <h2>{category.name}</h2>
                                <div dangerouslySetInnerHTML={{ __html: category.custom.desc }} />
                                <Link to={"category/" + catId} className="ban-btn">Check all designers</Link>
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

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(CategoryBanner);