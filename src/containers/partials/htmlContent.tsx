import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getContent } from '../../redux/pages/customers';


function HtmlContent(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })

    useEffect(() => {
        getData();
    }, [props.languages, props.currentId, props.currentCAT]);

    const getData = async () => {
        let result: any = await getContent(props.languages, props.identifier);
        if (result && result.data && result.data.items && result.data.items.length > 0) {
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
        languages: languages,
        currentId: state.Cart.catId,
        currentCAT: state.Cart.catname
    }
}

export default connect(
    mapStateToProps
)(HtmlContent);