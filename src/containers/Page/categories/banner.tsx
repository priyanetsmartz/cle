import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getContent } from '../../../redux/pages/customers';


function CategoryBanner(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })

    useEffect(() => {
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getContent(props.languages, 'design_category_banner_image');
        // console.log(result.data.items[0].content);
        if (result) {
            SetPagesData(result.data.items[0]);
        }
    }

    return (
        <>
            {pagesData ? <div dangerouslySetInnerHTML={{ __html: pagesData.content }} /> : ""}
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