import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails } from '../../../redux/pages/customers';
import { useLocation } from 'react-router-dom';

function Description(props) {
    const location = useLocation()
    const baseUrl = process.env.REACT_APP_API_URL;
    const [category, setCategory] = useState({
        custom_attributes: []
    })

    useEffect(() => {
        console.log(props.cateData, props.cateData);
        if (props.cateData) {
            setCategory(props.cateData);
        }
    }, [props.languages, location]);

    return (
        <section className="cle-designer-info">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {category.custom_attributes.map((el,i) => {
                            return(el.attribute_code === "bottom_description" && 
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