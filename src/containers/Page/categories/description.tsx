import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";

function Description(props) {
    const baseUrl = process.env.REACT_APP_API_URL;
    const [category, setCategory] = useState({
        name:'',
        custom_attributes: [],
        custom:{
            desc:''
        }
    })
    const [catId, setCatId] = useState('52')

    useEffect(() => {
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getCategoryDetails(props.languages, catId);
       
        if (result) {
            let obj:any = {};
            result.data.custom_attributes.forEach(el => {
                if(el.attribute_code == "bottom_description") {
                    obj.desc = el.value;
                } 
                result.data.custom = obj;
            });
            setCategory(result.data);
        }
    }

    return (
        <section className="cle-designer-info">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="DC-section-title">CLé New In</h2>
                        <p className="cle-designer-desc">Some fashion designers will forever be remembered for how they pushed
                            boundaries and influenced how we all dress. From Coco Chanel's famous skirted suits to Alexander McQueen's
                            out-of-the-box creations, these designers all stand out in history as masters of taste and creativity.
                            Fashion designers hold a special place in our world. Their talent and vision play a big role in how people
                            look, and also contribute to the cultural and social environment. They love to study fashion trends,
                            sketch designs, select materials, and have a part in all the production aspects of their designs. They
                            contribute to the creation of millions, if not billions of pieces of clothing and accessories purchased by
                            consumers on a yearly basis.</p>

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