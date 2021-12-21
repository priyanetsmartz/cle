import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import { getCookie } from '../../../helpers/session';
import { faqSearch } from '../../../redux/pages/allPages';
import { siteConfig } from '../../../settings';
import { useIntl } from 'react-intl';

function FaqHeader(props) {
    const location = useLocation();
    const language = getCookie('currentLanguage');
    const intl = useIntl();
    const [autoSuggestions, SetAutoSuggestions] = useState([]);
    const [nothingFound, SetNothingFound] = useState("");
    useEffect(() => {
        return () => {
            SetAutoSuggestions([])
        }
    }, [props.languages, location])


    const updateInput = async (e) => {
        let lang = props.languages ? props.languages : language;
        console.log(e.target.value)
        if (e.target.value && e.target.value.length >= 3) {
            let results: any = await faqSearch(lang, e.target.value, siteConfig.pageSize);
            if (results.data.items && results.data.items.length > 0) {
           //     console.log('data')
                SetNothingFound("")
                SetAutoSuggestions(results.data.items)
            } else {
              //  console.log('no data')
                SetNothingFound("yes")
                SetAutoSuggestions([])
            }
        } else {
         //   console.log('no no data')
            SetNothingFound("")
            SetAutoSuggestions([])
        }
    }

    const clearSuggestions = async (e) => {
        SetNothingFound("")
    }
    return (
        <section className="help-center-ban">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
                        <h1><IntlMessages id="footer.help" /></h1>
                        <p><IntlMessages id="faq.subtitle" /></p>
                        <div className="form-group has-search">
                            <span className="fa fa-search form-control-feedback"></span>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "searchPlaceholder" })} onChange={updateInput} />
                            {(autoSuggestions && autoSuggestions.length > 0) ? (
                                <div className="serach-results-inner">
                                    <ul>
                                        {autoSuggestions.map((item, i) => {
                                            // console.log(`/help-center/` + item.category_data[0].category_url_key + '/?#' + item['title'])
                                            return (
                                                <li key={i} onClick={clearSuggestions}>
                                                    <Link to={`/help-center/` + item.category_data[0].category_url_key + '#' + item['title']} > {item.title}</Link>

                                                </li>
                                            )
                                        }
                                        )}
                                    </ul>
                                </div>
                            ) : (nothingFound ? <div className="nothing_found">
                                <IntlMessages id="no_data" />
                            </div> : "")}
                            {/* <div className="nothing_found">
                                {nothingFound}
                            </div> */}
                        </div>
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
)(FaqHeader);