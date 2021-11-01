import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails } from '../../../redux/pages/customers';
import { useLocation } from 'react-router-dom';

function Description(props) {
    const location = useLocation()
    const [category, setCategory] = useState([])

    useEffect(() => {
        if (props.cateData && props.cateData.items && props.cateData.items.length > 0 && props.cateData.items[0].custom_attributes && props.cateData.items[0].custom_attributes.length > 0) {
            setCategory(props.cateData.items[0].custom_attributes);
        }
    }, [props.languages, location, props.cateData]);

    return (
        <section className="cle-designer-info">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {category.map((el, i) => {
                            return (el.attribute_code === "bottom_description" &&
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