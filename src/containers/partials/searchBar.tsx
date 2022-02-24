import { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { getCookie } from '../../helpers/session';
import IconZoomIn from '../../image/Icon_zoom_in.svg';
import { getCategoryList, searchFields } from '../../redux/cart/productApi';
import { useHistory } from "react-router-dom";
import { useIntl } from 'react-intl';
import { siteConfig } from '../../settings';

function SearchBar(props) {
    const history = useHistory();
    let imageD = '', description = '';
    const language = getCookie('currentLanguage');
    const [autoSuggestions, SetAutoSuggestions] = useState([]);
    const [isShow, SetIsShow] = useState(false);
    const [selectedCat, SetSelectedCat] = useState('All');
    const [searchText, SetSearchText] = useState("");
    const [nothingFound, SetNothingFound] = useState("");
    const [categories, setCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const node = useRef(null);
    const intl = useIntl();
    useEffect(() => {
        getCategoryListAPi();
    }, [props.languages, props.categoryD]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            return;
        }
        // outside click
        SetIsShow(false);

    };
    const getCategoryListAPi = async () => {
        let cate = props.categoryD ? props.categoryD : 178;
        let results: any = await getCategoryList(props.languages, cate);
        if (results && results.data && results.data.items) {
            setCategories(results.data.items)
        }

    }


    const searchResultsApiCall = async (value) => {
        let lang = props.languages ? props.languages : language;
        let results: any = await searchFields(value, 0, 3, lang, "created_at", "DESC");
        if (results.data.items) {
            SetIsShow(true);
            SetNothingFound("")
            SetSearchText("")
            SetAutoSuggestions(results.data.items);

        } else {
            SetIsShow(false);
            SetNothingFound("Nothing Found!")
        }
    }

    const updateInput = async (e) => {
        SetSearchText(e.target.value)
        if (e.target.value.length >= 3) {
            setTimeout(() => {
                searchResultsApiCall(e.target.value)
            }, 3000)
        } else {
            SetIsShow(false);
            SetNothingFound("")
        }
    }

    const searchwithCategory = async (e) => {
        const { value } = e.target;
        SetSelectedCat(value)
        if (searchKeyword) {
            window.location.href = `/search/${searchKeyword}/${value}`;
            SetIsShow(false);
        } else if (value) {
            window.location.href = `/search/all/${value}`;
        } else {
            window.location.href = `/search/all/all`;
        }
    }
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && e.target.value) {
            let serachVal = e.target.value;
            setSearchKeyword(serachVal)
            window.location.href = `/search/${serachVal}/all`;
            SetIsShow(false);
        }
    }

    return (
        <div className="navbar-collapse collapse mainmenu-bar" id="bdNavbar">
            <hr className="d-md-none text-white-50" />
            <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
                <div className="search_input">
                    <div className="search_top"><img src={IconZoomIn} alt="searchIcon" className="me-1" />
                        <input type="search" value={searchText} placeholder={intl.formatMessage({ id: "searchPlaceholder" })} onChange={updateInput} onKeyDown={handleKeyDown} className="form-control me-1" />
                        {
                            categories.length > 0 && (
                                <select className="form-select" onChange={searchwithCategory} aria-label="Default select example">
                                    <option value=''>{intl.formatMessage({ id: "selectcat" })}</option>
                                    {categories.map((item, i) => {
                                        return (<option key={i} value={item.id}>{item.name}</option>)
                                    })
                                    }
                                </select>
                            )
                        }

                    </div>
                    <div ref={node} className="serach-results" style={{ "display": isShow ? "block" : "none" }}>
                        {(autoSuggestions && autoSuggestions.length) ? (
                            <div className="serach-results-inner">
                                <ul>
                                    {autoSuggestions.map((item, i) => {
                                        return (
                                            <li key={i}>
                                                {
                                                    item.custom_attributes.map((attributes) => {
                                                        if (attributes.attribute_code === 'image') {
                                                            imageD = attributes.value;
                                                        }
                                                        if (attributes.attribute_code === 'brand') {
                                                            description = attributes.value;
                                                        }
                                                    })
                                                }
                                                <Link to={'/product-details/' + item.sku}><span className="minicartprodt_img">
                                                    <img src={imageD ? imageD : ""} alt={item.name} className="imge-fluid" /></span>
                                                    <span className="minicartprodt_name">
                                                        <h6 className="minicart_pname">{description}</h6>
                                                        <span className="minicart_prodt_tag">{item.name}</span>
                                                       
                                                    </span>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    )}
                                </ul>
                            </div>
                        ) : <div className="nothing_found">
                            {nothingFound}
                        </div>}
                    </div>
                    <div className="nothing_found">
                        {nothingFound}
                    </div>
                </div>
            </ul>
        </div>
    )
}

const mapStateToProps = (state) => {
   
    return {
        languages: state.LanguageSwitcher.language,
        categoryD: state.Cart.catIdd
    }
}
export default connect(
    mapStateToProps,
    {}
)(SearchBar);