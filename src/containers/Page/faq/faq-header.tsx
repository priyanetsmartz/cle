import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useParams } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import { getCookie } from '../../../helpers/session';
import { faqSearch, getFaqListinglabels } from '../../../redux/pages/allPages';
import { siteConfig } from '../../../settings';
import { useIntl } from 'react-intl';

function FaqHeader(props) {
    const location = useLocation();
    const language = getCookie('currentLanguage');
    const { url_key }: any = useParams();
    const intl = useIntl();
    const [autoSuggestions, SetAutoSuggestions] = useState([]);
    const [nothingFound, SetNothingFound] = useState("");
    const [bread, setBread] = useState("");
    const [searchText, SetSearchText] = useState("");
    useEffect(() => {
        if (url_key) {
            getData();
        }
        return () => {
            SetAutoSuggestions([])
        }
    }, [props.languages, location])
    async function getData() {
        let results: any = await getFaqListinglabels(props.languages, url_key);      
        setBread(results?.data?.[0]?.title)
    }

    const updateInput = async (e) => {
        SetSearchText(e.target.value)
        if (e.target.value && e.target.value.length >= 3) {
            setTimeout(() => {
                if (e.target.value && e.target.value.length >= 3) {
                    faqSearchFunction(e.target.value);
                }
            }, 3000)

        } else {

            SetNothingFound("")
            SetAutoSuggestions([])
        }
    }

    const faqSearchFunction = async (value) => {
        let lang = props.languages ? props.languages : language;
        let results: any = await faqSearch(lang, value, siteConfig.pageSize);
        if (results.data.items && results.data.items.length > 0) {
            SetNothingFound("")
            SetSearchText(value)
            SetAutoSuggestions(results.data.items)
        } else {
            SetSearchText(value)
            SetNothingFound("yes")
            SetAutoSuggestions([])
        }
    }

    const clearSuggestions = async (e) => {
        SetNothingFound("")
    }
    return (
        <>
            <section className="help-center-ban">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
                            <h1><IntlMessages id="footer.help" /></h1>
                            <p><IntlMessages id="faq.subtitle" /></p>
                            <div className="form-group has-search">
                                <span className="fa fa-search form-control-feedback"></span>
                                <input type="text" value={searchText} className="form-control" placeholder={intl.formatMessage({ id: "searchPlaceholder" })} onChange={updateInput} />
                                {(autoSuggestions && autoSuggestions.length > 0) ? (
                                    <div className="serach-results-inner">
                                        <ul>
                                            {autoSuggestions.map((item, i) => {
                                                return (
                                                    <li key={i} onClick={clearSuggestions}>
                                                        <Link to={item && item.category_data?.length > 0 && item.category_data[0].category_url_key ? `/help-center/` + item.category_data[0].category_url_key + '#' + item['title'] : ""} > {item.title}</Link>

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
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/help-center">Help Center</Link></li>
                                    {url_key && (<li className="breadcrumb-item">{bread}</li>)}
                                </ol>
                            </nav>
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
)(FaqHeader);