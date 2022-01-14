import { useEffect, useState } from 'react';
import { getCookie } from '../../../helpers/session';
import { getProductIntegration } from '../../../redux/pages/vendorLogin';
import { connect } from 'react-redux'

function ProductIntegration(props) {
    const language = getCookie('currentLanguage');

    const [form, setForm] = useState({
        "title": "",
        "form_id": "",
        "store_id": "",
        "form_json": []
    });

    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let result: any = await getProductIntegration(lang);
            console.log(result.data[0])
            setForm(result.data[0]);
        }
        getData()
        return () => {
          
        }
    }, [props.languages]);
    return (
        <div>
ssss
        </div>
    );
}

const mapStateToProps = (state) => {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages

    };
}

export default connect(
    mapStateToProps
)(ProductIntegration);