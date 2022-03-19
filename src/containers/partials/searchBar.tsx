import { useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { getCookie } from '../../helpers/session';
import IconZoomIn from '../../image/Icon_zoom_in.svg';
import { getCategoryList, searchFields } from '../../redux/cart/productApi';
import debounce from "lodash.debounce";
import { useIntl } from 'react-intl';

function SearchBar(props) {
    let imageD = '', description = '';
    const language = getCookie('currentLanguage');
    const [autoSuggestions, SetAutoSuggestions] = useState([]);
    const [isShow, SetIsShow] = useState(false);
    const [selectedCat, SetSelectedCat] = useState('All');
    const [searchText, SetSearchText] = useState("");
    const [nothingFound, SetNothingFound] = useState("");
    const [categories, setCategories] = useState([]);
    const [loader, setLoader] = useState(false);
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
        setLoader(true)
        let lang = props.languages ? props.languages : language;
        let results: any = await searchFields(value, 0, 3, lang, "created_at", "DESC");
        if (results.data.items) {
            SetIsShow(true);
            SetNothingFound("")
            SetAutoSuggestions(results?.data?.items);
            setLoader(false)
        } else {
            SetIsShow(true);
            SetNothingFound("Nothing found")
            SetAutoSuggestions([]);
            setLoader(false)
        }
    }

    const updateInput = async (e) => {
        SetAutoSuggestions([])
        SetSearchText(e.target.value)
        SetNothingFound("")
        if (e.target.value.length >= 3) {
            setLoader(true)
            SetIsShow(true);
            searchResultsApiCall(e.target.value)
        }else{
            setLoader(false)           
            SetIsShow(false); 
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
        if (e.key === 'Enter' && e.target.value && e.target.value[0] !== '%' && e.target.value !== '%') {
            let serachVal = e.target.value;
            setSearchKeyword(serachVal)
            window.location.href = `/search/${serachVal}/all`;
            SetIsShow(false);
        }
    }
    const debouncedChangeHandler = useCallback(debounce(updateInput, 1000), []);


    return (
        <div className="navbar-collapse collapse mainmenu-bar" id="bdNavbar">
            <hr className="d-md-none text-white-50" />
            <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
                <div className="search_input">
                    <div className="search_top"><img src={IconZoomIn} alt="searchIcon" className="me-1" />
                        <input type="search" placeholder={intl.formatMessage({ id: "searchPlaceholder" })} onChange={debouncedChangeHandler} onKeyDown={handleKeyDown} className="form-control me-1" />
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
                        <div className="serach-results-inner">
                            {loader && (
                                <ul> <li><div className="nothing_found"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span></div></li></ul>
                            )}
                            {(autoSuggestions && autoSuggestions.length) ? (

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

                            ) :
                                (nothingFound && !loader) && (<ul> <li><div className="nothing_found">{nothingFound} </div></li></ul>)
                            }
                        </div>
                    </div>
                </div>
            </ul >
        </div >
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