import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";

function Description(props) {
    const baseUrl = process.env.REACT_APP_API_URL;
    const [category, setCategory] = useState({
        custom_attributes: []
    })
    const [catId, setCatId] = useState(153)

    useEffect(() => {
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getCategoryDetails(props.languages, catId);
       
        if (result) {
            setCategory(result.data);
        }
    }

    return (
        <section className="cle-designer-info">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {category.custom_attributes.map((el,i) => {
                            return(el.attribute_code == "bottom_description" && 
                                <div key={i} dangerouslySetInnerHTML={{ __html: el.value }} />
                            )
                        })}

                    </div>
                </div>
            </div>
        </section>
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
)(Description);