import { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { getCookie } from '../../helpers/session';
import IconZoomIn from '../../image/Icon_zoom_in.svg';
import { getCategoryList, searchFields } from '../../redux/cart/productApi';
import { useHistory } from "react-router-dom";

function SearchBar(props) {
    const history = useHistory();
    let imageD = '', description = '';
    const language = getCookie('currentLanguage');
    const [autoSuggestions, SetAutoSuggestions] = useState([]);
    const [isShow, SetIsShow] = useState(false);
    const [nothingFound, SetNothingFound] = useState("");
    const [categories, setCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const node = useRef(null);
    useEffect(() => {
        getCategoryListAPi();
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            // inside click
            console.log('here inside')
            return;
        }
        // outside click
        SetNothingFound("")
        SetIsShow(false);

    };
    const getCategoryListAPi = async () => {
        let results: any = await getCategoryList();
        if (results.data && results.data.items) {
            setCategories(results.data.items)
        }

    }

    const updateInput = async (e) => {
        let lang = props.languages ? props.languages : language;
        // console.log(e.target.value.length)
        if (e.target.value.length >= 3) {
            setSearchKeyword(e.target.value)
            let results: any = await searchFields(e.target.value, 0, 3, lang, "created_at", "DESC");
            if (results.data.items) {
                SetIsShow(true);
                SetNothingFound("")
                SetAutoSuggestions(results.data.items);

            } else {
                SetIsShow(false);
                SetNothingFound("Nothing Found!")
            }
        } else {
            SetIsShow(false);
            SetNothingFound("")
        }

        //  console.log(autoSuggestions.items)
    }

    const searchwithCategory = async (e) => {
        const { value } = e.target;
        if (searchKeyword) {
            history.push(`/search/${searchKeyword}/${value}`);
            SetIsShow(false);
        } else {
            history.push(`/search/all/${value}`);
        }
    }
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            let serachVal = e.target.value;
            history.push(`/search/${serachVal}/all`);
            SetIsShow(false);
        }
    }

    return (
        <div className="navbar-collapse collapse mainmenu-bar" id="bdNavbar">
            <hr className="d-md-none text-white-50" />
            <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
                <div className="search_input">
                    <div className="search_top"><img src={IconZoomIn} alt="searchIcon" className="me-1" />
                        <input type="search" placeholder="Search..." onChange={updateInput} onKeyDown={handleKeyDown} className="form-control me-1" />
                        {
                            categories.length > 0 && (
                                <select className="form-select" onChange={searchwithCategory} aria-label="Default select example">
                                    <option value="">Select category</option>
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
                                        //  console.log(item.custom_attributes);
                                        return (
                                            <li key={i}>
                                                {
                                                    item.custom_attributes.map((attributes) => {
                                                        if (attributes.attribute_code === 'image') {
                                                            imageD = attributes.value;
                                                        }
                                                        if (attributes.attribute_code === 'short_description') {
                                                            description = attributes.value;
                                                        }
                                                    })
                                                }
                                                <Link to={'/product-details/' + item.sku}><span className="minicartprodt_img">
                                                    <img src={imageD ? imageD : ""} alt={item.name} className="imge-fluid" /></span>
                                                    <span className="minicartprodt_name">
                                                        <span className="minicart_pname">{item.name}</span>
                                                        <span className="minicart_prodt_tag" dangerouslySetInnerHTML={{ __html: description }} />

                                                    </span>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    )}
                                </ul>
                            </div>
                        ) : "Nothing found!"}
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
    //console.log(state)
    return {
        languages: state.LanguageSwitcher.language,
    }
}
export default connect(
    mapStateToProps,
    {}
)(SearchBar);