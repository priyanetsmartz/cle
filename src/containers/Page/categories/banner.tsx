import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategoryDetails } from '../../../redux/pages/customers';


function CategoryBanner(props) {
    const [category, setCategory] = useState({
        custom_attributes:[]
    })
    const [catId, setCatId] = useState('52')

    useEffect(() => {
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getCategoryDetails(props.languages, catId);
        // console.log(result);
        if (result) {
            setCategory(result.data);
        }
    }

    return (
        <>
            <div>
                <img src={category.custom_attributes[1]?.value} alt="" />
                {category.custom_attributes[0] ? <div dangerouslySetInnerHTML={{ __html: category.custom_attributes[0].value }} /> : ''}
            </div>
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