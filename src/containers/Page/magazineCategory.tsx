import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Link, useLocation, useParams } from "react-router-dom";
import { FeaturedList, GetCategoryData, SendNewsletter, GetCategoryList, GetDataOfCategory } from '../../redux/pages/magazineList';
import moment from 'moment';
import notification from '../../components/notification';
import { getCookie } from "../../helpers/session";
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';

function MagazineCategory(props) {
    const [isShow, setIsShow] = useState(false);
    const language = getCookie('currentLanguage');
    const intl = useIntl();
    const { category } = useParams();
    const [state, setState] = useState({
        email: ""
    })
    const [items, setItems] = useState([]);
    const [catMenu, setCatMenu] = useState([]);
    const [radio, setRadio] = useState('Womenswear');
    const [featured, setFeaturedItems] = useState([]);
    const [pagination, setPagination] = useState(1);
    const [sort, setSort] = useState(0);
    const [sortValue, setSortValue] = useState({ sortBy: '', sortByValue: "" });
    const [page, setCurrent] = useState(1);
    const [opacityVal, setOpacity] = useState(1);
    const [errors, setError] = useState({
        errors: {}
    });
    const [latest, setlatestItem] = useState({ title: '', published_at: '', short_content: '', post_id: '', list_thumbnail: '', categroy: '' });
    const location = useLocation();
    // let filters = [{ id: 1, value: "Most Popular" }, { id: 2, value: "Least Popular" }, { id: 3, value: "Alphabetical: A to Z" }, { id: 4, value: "Alphabetical: Z to A" }]

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }, [location])

    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        if (category) {
            setOpacity(0.3);
            getDataOfCategory(lang, category, 1, 'published_at', 'desc')
        } else {
            getData(lang, 1, 'published_at', 'desc')
        }
        getCategoryList(lang);
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages, category])

    async function getData(language, page, sortBy = "published_at", sortByValue = "desc") {
        let result: any = await GetCategoryData(language, page, sortBy, sortByValue);
        let featuredResult: any = await FeaturedList(language);
        setItems(result.data);
        let dataTotal = result.data && result.data.length > 0 ? result.data[0].total_page : 0;
        setPagination(dataTotal);
        setFeaturedItems(featuredResult.data);
        setlatestItem(result.data.slice(-1)[0]);
        console.log(result.data.slice(-1)[0])
        // console.log(result.data.slice(-1)[0]);
        setOpacity(1);
    }

    async function getDataOfCategory(languages, cat, page, sortBy = "published_at", sortByValue = "desc") {
        let result: any = await GetDataOfCategory(languages, cat, page, sortBy, sortByValue);
        setItems(result.data);
        if (result.data) {
            setlatestItem(result.data.slice(-1)[0]);
        } else {
            setlatestItem(prevState => ({
                ...prevState
            }))
        }
        // console.log(result.data.slice(-1)[0]);
        let featuredCat = result.data.filter(catData => catData.is_featured === "1");
        setFeaturedItems(featuredCat);
        setOpacity(1);
    }

    async function getCategoryList(language) {
        let lang = props.languages ? props.languages : language;
        let result: any = await GetCategoryList(lang);
        setCatMenu(result.data);
    }

    async function getListData(languages, page, sortBy, sortByValue) {
        let result: any = await GetCategoryData(languages, page, sortBy, sortByValue);
        setItems(result.data);
        setOpacity(1);
    }
    const onValueChange = (e) => {
        setRadio(e.target.value);
    }
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const filtterData = (event) => {
        let lang = props.languages ? props.languages : language;
        let sortBy = "published_at";
        let sortByValue = "desc";
        if (event.target.value === "1") {
            sortBy = "views";
            sortByValue = "desc";
        } else if (event.target.value === "2") {
            sortBy = "views";
            sortByValue = "asc";
        } else if (event.target.value === "3") {
            sortBy = "title";
            sortByValue = "asc";
        } else if (event.target.value === "4") {
            sortBy = "title";
            sortByValue = "desc";
        }
        setSort(event.target.value);
        setSortValue({ sortBy: sortBy, sortByValue: sortByValue })
        setOpacity(0.3);
        if (category) {
            getDataOfCategory(lang, category, 1, sortBy, sortByValue)
        } else {
            getData(lang, 1, sortBy, sortByValue)
        }
    }

    const getPaginationGroup = () => {
        let start = Math.floor((page - 1) / 4) * 4;
        let fill = pagination > 5 ? 4 : pagination;
        return new Array(fill).fill(fill).map((_, idx) => start + idx + 1);
    };

    const goToNextPage = (e) => {
        let lang = props.languages ? props.languages : language;
        setOpacity(0.3);
        e.preventDefault();
        getListData(lang, page + 1, sortValue.sortBy, sortValue.sortByValue);
        setCurrent((page) => page + 1);

    }
    function changePage(event) {
        let lang = props.languages ? props.languages : language;
        setOpacity(0.3);
        event.preventDefault()
        const pageNumber = Number(event.target.textContent);
        setCurrent(pageNumber);
        getListData(lang, pageNumber, sortValue.sortBy, sortValue.sortByValue);
    }
    const goToPreviousPage = (e) => {
        let lang = props.languages ? props.languages : language;
        setOpacity(0.3);
        e.preventDefault();
        getListData(lang, page - 1, sortValue.sortBy, sortValue.sortByValue);
        setCurrent((page) => page - 1);

    }

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;
        if (typeof state["email"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state["email"]))) {
                formIsValid = false;
                error["email"] = intl.formatMessage({ id: "emailvalidation" });
            }
        }
        if (!state["email"]) {
            formIsValid = false;
            error["email"] = intl.formatMessage({ id: "emailrequired" });
        }

        setError({ errors: error });
        return formIsValid;
    }
    const handleSubmitClick = async (e) => {
        let lang = props.languages ? props.languages : language;
        e.preventDefault();
        if (handleValidation()) {
            setIsShow(true);
            const userInfo = {
                "email": state.email,
                "type": radio
            }
            const result: any = await SendNewsletter({ userInfo }, lang);
            if (result.data[0].success === 1) {
                notification("success", "", result.data[0].message);
                setState(prevState => ({
                    ...prevState,
                    email: ""
                }))
                setIsShow(false);
            } else {
                setIsShow(false);
                notification("error", "", result.data[0].message);
            }
        } else {
            setIsShow(false);
            notification("error", "", intl.formatMessage({ id: "emailvalidation" }));
        }
    }
    return (
        <>
            <div className="container magazine-inner"  style={{ opacity: opacityVal }}>

                <div className="row mt-3 mag-list-head">
                    <div className="col-md-6 offset-md-3 text-center">
                        <h3><IntlMessages id="magazine.title" /></h3>
                        {catMenu.length > 0 && (
                            <ul>
                                <li key="0"><Link to="/magazines" className={!category ? "active-menu" : ""}>Latest</Link></li>
                                {catMenu.map((item, i) => {
                                    let link = "/magazines/" + item.category_id;
                                    let classValue = item.category_id === category ? "active-menu" : "";

                                    return (
                                        <li key={i}><Link to={link} className={classValue}>{item.name}</Link></li>
                                    )
                                })}
                            </ul>
                        )}

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 back-home mb-2">
                        <Link to="/">
                            <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="6.08" height="9.743" viewBox="0 0 6.08 9.743">
                                <path id="Path_13" data-name="Path 13" d="M0,5,4.5,0,9,5" transform="translate(0.747 9.372) rotate(-90)" fill="none" stroke="#2E2BAA" strokeWidth="1" />
                            </svg> <IntlMessages id="backhome.link" />
                        </Link>
                    </div>
                </div>
            </div>
            {latest && (
                <div className="mag-top-banner">
                    <img src={latest.list_thumbnail} alt="list_thumbnail" />
                    <div className="banner-content text-center">
                        <h4>{latest.title}</h4>
                        <div className="cat-date">{latest.categroy}<span>{moment(latest.published_at).format('LL')}</span></div>
                        <p>  <div dangerouslySetInnerHTML={{ __html: latest.short_content }} /></p>
                        <Link to={"/magazine/" + latest.post_id} ><IntlMessages id="magazine.read_more" /></Link>
                    </div>

                </div>
            )}

            <div className="highlight-list mt-5 py-5">
                <h2 className="pb-3 text-center"><IntlMessages id="magazine.highlights" /></h2>
                {featured.length > 0 && (
                    <div className="container">
                        <div className="row my-3">
                            {featured.slice(0, 3).map((item, i) => {
                                //   console.log(typeof (item.category))
                                return (
                                    <div className="col-md-4" key={i}>
                                        <div className="blog-sec-main">
                                            <div className="mag-blog-pic-2"><img src={item.list_thumbnail} alt="list_thumbnail" /></div>
                                            <div className="cate-name">{item.categroy}</div>
                                            <h3 className="mag-blog-title-2 my-2">{item.title}</h3>
                                            <div className="cate-date mb-2">{moment(item.published_at).format('LL')}</div>
                                            <p className="mag-blog-desc d-none">  <div dangerouslySetInnerHTML={{ __html: item.short_content }} /></p>
                                            <Link to={"/magazine/" + item.post_id} className="signup-btn"><IntlMessages id="magazine.read_more" /></Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {!featured.length && (
                    <div className="container">
                        <IntlMessages id="no_data" />
                    </div>
                )}
            </div>

            <div className="mt-5 py-5">
                <div className="container">
                    <div className="missed-list-sec">
                        <h2 className="pb-3 float-start"><IntlMessages id="magazine.realted" /></h2>
                        <div className="sort-by float-end">
                            <div className="row g-3 align-items-center">
                                <div className="col-auto">
                                    <label htmlFor="SortInput" className="col-form-label"><IntlMessages id="magazine.sortby" /></label>
                                </div>
                                <div className="col-auto">
                                    <select className="form-select" defaultValue={sort} onChange={filtterData} >
                                        <option value={0} key="0" >{intl.formatMessage({ id: "magazine.filter" })}</option>
                                        <option value={1} key="1" >{intl.formatMessage({ id: "magazine.filter1" })}</option>
                                        <option value={2} key="2" >{intl.formatMessage({ id: "magazine.filter2" })}</option>
                                        <option value={3} key="3" >{intl.formatMessage({ id: "magazine.filter3" })}</option>
                                        <option value={4} key="4" >{intl.formatMessage({ id: "magazine.filter4" })}</option>
                                        {/* {
                                            filters.map((item, i) => {
                                                return (
                                                    <option value={item.id} key={i} >{item.value}</option>
                                                )
                                            })
                                        } */}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    {items.length > 0 && (
                        <div className="row my-3" style={{ opacity: opacityVal }}>
                            {items.map((item, i) => {
                                return (
                                    <div className="col-md-4" key={i}>
                                        <div className="blog-sec-main">
                                            <div className="mag-blog-pic-2"><img src={item.list_thumbnail} alt="list_thumbnail" /></div>
                                            <div className="cate-name">{item.categroy}</div>
                                            <h3 className="mag-blog-title-2 my-2">{item.title}</h3>
                                            <div className="cate-date mb-2">{moment(item.published_at).format('LL')}</div>
                                            <p className="mag-blog-desc d-none">  <div dangerouslySetInnerHTML={{ __html: item.short_content }} /></p>
                                            <Link to={"/magazine/" + item.post_id} className="signup-btn"><IntlMessages id="magazine.read_more" /></Link>
                                        </div>

                                    </div>
                                );
                            })}


                            <div className="col-md-12 pagination">
                                {pagination > 1 && (<nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-center">
                                        <li
                                            className={`page-item prev ${page === 1 ? 'disabled' : ''}`}>
                                            <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className="page-link" aria-disabled="true"><IntlMessages id="pagination-prev" /></Link>
                                        </li>
                                        {getPaginationGroup().map((i, index) => (
                                            <li className="page-item" key={i}><Link className="page-link" onClick={changePage} to="#">{i}</Link></li>
                                        ))}
                                        <li className={`page-item next ${page === pagination ? 'disabled' : ''}`} >
                                            <Link className="page-link" onClick={(e) => { goToNextPage(e); }}
                                                to="/"><IntlMessages id="pagination-next" /></Link>
                                        </li>
                                    </ul>
                                </nav>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="banner-content-2 text-center">
                                <figure className="newsletter-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="917" height="134" viewBox="0 0 917 134">
                                        <text id="Newsletter" transform="translate(1 98)" fill="none" stroke="#2E2BAA" strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book"><tspan x="0" y="0"><IntlMessages id="magazine.newsletter" /></tspan></text>
                                    </svg>
                                </figure>
                                <h4><IntlMessages id="newsletter.title" /></h4>

                                <p><IntlMessages id="newsletter.subtitle" /></p>
                                <div className="wear-ckeckbox">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" checked={radio === "Womenswear"} onChange={onValueChange} name="inlineRadioOptions" id="inlineRadio1" value="Womenswear" />
                                        <label className="form-check-label" htmlFor="inlineRadio1"><IntlMessages
                                            id="newsletter.option1" /></label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" onChange={onValueChange} name="inlineRadioOptions" id="inlineRadio2" value="Menswear" />
                                        <label className="form-check-label" htmlFor="inlineRadio2"><IntlMessages
                                            id="newsletter.option2" /></label>
                                    </div>
                                </div>

                                <form className="row g-3 newsletter-signup">
                                    <div className="col-auto">
                                        <label htmlFor="inputEmail" className="visually-hidden">Your Email</label>
                                        <input type="text"
                                            id="email"
                                            aria-describedby="emailHelp"
                                            placeholder={intl.formatMessage({ id: 'newsletter.input' })}
                                            value={state.email}
                                            onChange={handleChange} />
                                    </div>
                                    <div className="col-auto">
                                        <button type="submit" className="btn btn-primary mb-3" style={{ "display": !isShow ? "inline-block" : "none" }} onClick={handleSubmitClick} ><IntlMessages id="newsletter.signup" /></button>
                                        <div className="tn btn-primary btn-sm shadow-none" style={{ "display": isShow ? "inline-block" : "none" }}>
                                            <span className="btn btn-primary mb-3" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                                    </div>
                                    <span className="error">{errors.errors["email"]}</span>
                                </form>
                                <div className="terms-text text-center">
                                    <IntlMessages id="newsletter.foot" /> <Link to="/terms-and-conditions"><IntlMessages id="signup.terms_conditions" /></Link> <IntlMessages id="signup.and" /> <Link to="/privacy-policy"><IntlMessages id="signup.privacy_policy" /></Link>. <IntlMessages id="newsletter.optout" />
                                </div>

                                <div className="join-cle-bottom-2">
                                    <figure className="join-cle-text">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="140.164" height="135.972" viewBox="0 0 140.164 135.972">
                                            <path id="Union_8" data-name="Union 8" d="M-3209.763-6974.08a4.733,4.733,0,0,1-1.921-3.989l10.4-.585a2.526,2.526,0,0,0-1.349-1.948,6.052,6.052,0,0,0-3.1-.463,6.306,6.306,0,0,0-2.547.563,2.6,2.6,0,0,0-1.227,1.269l-2.1.118a3.878,3.878,0,0,1,1.85-2.549,8.2,8.2,0,0,1,3.942-1.1,7.991,7.991,0,0,1,4.727.958,4.134,4.134,0,0,1,1.943,3.512,4.355,4.355,0,0,1-.664,2.731,4.862,4.862,0,0,1-2.139,1.749,8.946,8.946,0,0,1-3.168.717q-.354.02-.693.02A7.125,7.125,0,0,1-3209.763-6974.08Zm.387-2.529a2.419,2.419,0,0,0,1.4,1.5,6.248,6.248,0,0,0,2.77.35q3.369-.187,3.889-2.306Zm-8.794,2.82a17.085,17.085,0,0,1-2.867-.271,9.94,9.94,0,0,1-3.138-1.015,3.646,3.646,0,0,1-1.647-1.806,5.287,5.287,0,0,1-.178-2.874l.81-4.565,1.912.337-.195,1.1a22.85,22.85,0,0,1,3.175-.5,12.256,12.256,0,0,1,3.106.171,5.556,5.556,0,0,1,3.043,1.32,2.678,2.678,0,0,1,.655,2.494,2.531,2.531,0,0,1-1.923,2.123,8.9,8.9,0,0,1-4.051.055,17.817,17.817,0,0,1-4.729-1.577,1.939,1.939,0,0,0,.958,2.135,7.775,7.775,0,0,0,2.677.97,15.319,15.319,0,0,0,2.258.227,16.539,16.539,0,0,0,2.644-.164l.435,1.641a22.172,22.172,0,0,1-2.807.19Zm-2.512-7.94a27.047,27.047,0,0,0-3.059.384l-.173.965a20.543,20.543,0,0,0,2.153.91,15.116,15.116,0,0,0,2.455.629,7.137,7.137,0,0,0,2.622.086,1.249,1.249,0,0,0,1.125-1,1.122,1.122,0,0,0-.492-1.242,5.671,5.671,0,0,0-2.016-.656,8.8,8.8,0,0,0-1.525-.117Q-3220.1-6981.769-3220.683-6981.729Zm-11.438,4.381.608-1.5a6.314,6.314,0,0,1-2.547.592,6.305,6.305,0,0,1-2.312-.487,8.623,8.623,0,0,1-2.148-1.245l.656-1.611a9.441,9.441,0,0,0,2.11,1.209,6.119,6.119,0,0,0,2.1.446,9.323,9.323,0,0,0,2.761-.43l2.187-5.375,1.8.731-3.414,8.4Zm44.977-.4a4.727,4.727,0,0,1-3.166-3.095l9.583-4.1a2.528,2.528,0,0,0-1.932-1.372,6.108,6.108,0,0,0-3.075.621,6.346,6.346,0,0,0-2.2,1.4,2.6,2.6,0,0,0-.722,1.613l-1.93.824a3.891,3.891,0,0,1,.869-3.027,8.205,8.205,0,0,1,3.334-2.371,7.977,7.977,0,0,1,4.772-.711,4.124,4.124,0,0,1,3.022,2.64,4.368,4.368,0,0,1,.307,2.795,4.873,4.873,0,0,1-1.413,2.371,8.943,8.943,0,0,1-2.736,1.751,8.805,8.805,0,0,1-3.441.8A5.535,5.535,0,0,1-3187.144-6977.744Zm-.5-2.51a2.419,2.419,0,0,0,1.83.935,6.255,6.255,0,0,0,2.724-.614q3.1-1.327,2.87-3.495Zm-56.8.79,6.114-10.835,1.693.954-6.114,10.837Zm68.388-13.086,2.417-1.753,9.469,4.331-1.764,1.279-8.222-3.755,1.036,8.973-1.762,1.279Zm-70.9,7.678,1.413-9.16-8.562,3.534-1.711-1.347,10.5-4.34a10.4,10.4,0,0,1,2.048-.666,4.133,4.133,0,0,1,1.727.021,4.332,4.332,0,0,1,1.679.858,12.117,12.117,0,0,1,1.1.965c.311.309.658.684,1.042,1.117l-1.049,1.333a12.711,12.711,0,0,0-1.871-1.85,2.825,2.825,0,0,0-1.538-.658,4.515,4.515,0,0,0-1.953.444l-.359.153.869.681-1.588,10.29Zm85.341-6.259,1.384-1.365,1.531,1.55-1.384,1.365Zm-7.209-7.305,1.384-1.365,6.368,6.454-1.384,1.365Zm8.256,1.108,1.247-1.689a1.068,1.068,0,0,0,.942.085,3.12,3.12,0,0,0,1.076-.8,20.107,20.107,0,0,0,1.491-1.835,9.427,9.427,0,0,0,1.427-2.4c.166-.539.107-.91-.178-1.12a.6.6,0,0,0-.612-.087,3.411,3.411,0,0,0-.933.724q-.6.6-1.829,2l-.466.524q-1.322,1.5-2.087,2.21a3.493,3.493,0,0,1-1.579.9,2.028,2.028,0,0,1-1.675-.457,2.387,2.387,0,0,1-1.049-2.572,10.9,10.9,0,0,1,2.037-3.871,20.461,20.461,0,0,1,2.3-2.665,5.245,5.245,0,0,1,2.235-1.325,2.728,2.728,0,0,1,2.287.464l-1.247,1.689a1.465,1.465,0,0,0-1.131-.169,3.211,3.211,0,0,0-1.3.83,15.435,15.435,0,0,0-1.725,2.032,16.9,16.9,0,0,0-1.345,2.042,2.16,2.16,0,0,0-.33,1.129,1.006,1.006,0,0,0,.442.674.744.744,0,0,0,.688.152,2.759,2.759,0,0,0,.933-.715c.394-.4,1.033-1.112,1.909-2.126a31.35,31.35,0,0,1,2.326-2.506,4.016,4.016,0,0,1,1.686-1.026,1.86,1.86,0,0,1,1.611.4,2.242,2.242,0,0,1,.844,2.576,11.827,11.827,0,0,1-2.057,3.854,11.982,11.982,0,0,1-3.072,3.117,2.671,2.671,0,0,1-1.41.433A2.756,2.756,0,0,1-3160.57-6997.329Zm-104.845-3.782a12.119,12.119,0,0,1-3.063-3.7,10.391,10.391,0,0,1-1.691-4.644,3,3,0,0,1,1.461-2.92l1.094,1.828a1.456,1.456,0,0,0-.737.994,3.148,3.148,0,0,0,.237,1.625,15.065,15.065,0,0,0,1.24,2.465,13.37,13.37,0,0,0,1.393,1.995,2.464,2.464,0,0,0,1.06.787,1.136,1.136,0,0,0,.92-.143,1.026,1.026,0,0,0,.537-.737,2.883,2.883,0,0,0-.26-1.329,27.179,27.179,0,0,0-1.192-2.551q-1.188-2.353-1.686-3.623a4.5,4.5,0,0,1-.35-2.282,2.342,2.342,0,0,1,1.254-1.673,2.747,2.747,0,0,1,3.23.07,12.1,12.1,0,0,1,3.109,3.71,13.208,13.208,0,0,1,2.028,5.1,3.248,3.248,0,0,1-1.538,3.232l-1.1-1.843a1.723,1.723,0,0,0,.778-1.833,10.769,10.769,0,0,0-1.627-3.764,9.612,9.612,0,0,0-2.085-2.667,1.363,1.363,0,0,0-1.607-.233,1.062,1.062,0,0,0-.582.771,2.992,2.992,0,0,0,.321,1.368q.377.9,1.375,2.845a21.808,21.808,0,0,1,1.527,3.493,4.139,4.139,0,0,1,.162,2.284,2.6,2.6,0,0,1-1.282,1.538,2.573,2.573,0,0,1-1.331.4A2.758,2.758,0,0,1-3265.415-7001.11Zm107.835-11.42.742-1.8,1.868.771a5.7,5.7,0,0,1-.776-2.709,7.693,7.693,0,0,1,.662-3.173,5.855,5.855,0,0,1,2.539-3.144,4.662,4.662,0,0,1,3.957.116l4.185,1.727-.74,1.8-3.783-1.559a3.639,3.639,0,0,0-2.8-.214,4.136,4.136,0,0,0-1.943,2.43,5.639,5.639,0,0,0-.4,3.655,3.552,3.552,0,0,0,2.266,2.38l3.336,1.377-.74,1.8Zm-115.056-5.987a17.551,17.551,0,0,1-1.051-2.679,9.936,9.936,0,0,1-.51-3.257,3.64,3.64,0,0,1,.869-2.285,5.286,5.286,0,0,1,2.485-1.458l4.438-1.336.56,1.859-1.07.323a23.194,23.194,0,0,1,1.875,2.612,12.259,12.259,0,0,1,1.249,2.847,5.556,5.556,0,0,1,.2,3.313,2.68,2.68,0,0,1-1.93,1.709,2.535,2.535,0,0,1-2.761-.758,8.891,8.891,0,0,1-1.88-3.591,17.786,17.786,0,0,1-.726-4.931,1.937,1.937,0,0,0-1.473,1.818,7.773,7.773,0,0,0,.343,2.828,15.445,15.445,0,0,0,.817,2.119,16.394,16.394,0,0,0,1.34,2.283l-1.268,1.131A22.506,22.506,0,0,1-3272.636-7018.518Zm3.293-8.1a19.657,19.657,0,0,0,.159,2.332,15.145,15.145,0,0,0,.544,2.476,7.264,7.264,0,0,0,1.106,2.378,1.255,1.255,0,0,0,1.4.553,1.117,1.117,0,0,0,.883-1,5.652,5.652,0,0,0-.325-2.094,11.088,11.088,0,0,0-1.111-2.369,26.967,26.967,0,0,0-1.721-2.56Zm116.783.273.442-1.893,12.118,2.818-.441,1.891Zm6.838-5.339a2.513,2.513,0,0,0,1.661-1.159,5.723,5.723,0,0,0,.708-2.628q.313-4.236-2.82-4.467-3.117-.227-3.43,4a5.751,5.751,0,0,0,.316,2.707,2.508,2.508,0,0,0,1.457,1.39l-.155,2.108a4.13,4.13,0,0,1-2.679-2.171,7.888,7.888,0,0,1-.644-4.158,7.808,7.808,0,0,1,1.557-4.515,4.152,4.152,0,0,1,3.73-1.439,4.179,4.179,0,0,1,3.491,1.971,7.782,7.782,0,0,1,.885,4.7,7.816,7.816,0,0,1-1.256,4.017,4.153,4.153,0,0,1-2.976,1.754ZM-3279-7031.6l12.32-1.725.269,1.926-12.321,1.725Zm7.269-3.6a4.384,4.384,0,0,1-2.677-.862,4.881,4.881,0,0,1-1.589-2.256,8.982,8.982,0,0,1-.483-3.213,7.593,7.593,0,0,1,1.318-4.567,4.737,4.737,0,0,1,4.117-1.628l-.169,10.417a2.515,2.515,0,0,0,2.041-1.2,6.082,6.082,0,0,0,.688-3.059,6.333,6.333,0,0,0-.378-2.582,2.6,2.6,0,0,0-1.176-1.316l.032-2.1a3.882,3.882,0,0,1,2.41,2.03,8.19,8.19,0,0,1,.806,4.012,7.981,7.981,0,0,1-1.3,4.644,4.1,4.1,0,0,1-3.541,1.685Zm-2.538-9.041a6.282,6.282,0,0,0-.55,2.737q-.053,3.374,2.02,4.045l.132-8.068A2.408,2.408,0,0,0-3274.268-7044.241Zm123.358-1.143,2.7-4.174-3.792-3.211-.435-2.938,5.279,4.752,3.691-6.08.437,2.938-2.7,4.173,3.792,3.212.434,2.922-5.295-4.75-3.675,6.078Zm-1.862-12.619a8.2,8.2,0,0,1-2.266-3.407,7.967,7.967,0,0,1-.56-4.79,4.13,4.13,0,0,1,2.733-2.939,4.369,4.369,0,0,1,2.8-.218,4.859,4.859,0,0,1,2.326,1.488,9.019,9.019,0,0,1,1.664,2.788,7.6,7.6,0,0,1,.512,4.726,4.739,4.739,0,0,1-3.193,3.068l-3.792-9.706a2.533,2.533,0,0,0-1.432,1.887,6.109,6.109,0,0,0,.522,3.093,6.316,6.316,0,0,0,1.329,2.244,2.6,2.6,0,0,0,1.589.774l.762,1.955a3.888,3.888,0,0,1-.437.025A3.961,3.961,0,0,1-3152.772-7058Zm1.752-9.451,2.936,7.519a2.416,2.416,0,0,0,.994-1.8,6.262,6.262,0,0,0-.528-2.74q-1.17-2.99-3.189-2.987C-3150.878-7067.463-3150.949-7067.46-3151.021-7067.455Zm-114.2.658,1.122-1.829a1.723,1.723,0,0,0,1.986-.159,10.784,10.784,0,0,0,2.585-3.186,9.641,9.641,0,0,0,1.4-3.083,1.366,1.366,0,0,0-.537-1.536,1.07,1.07,0,0,0-.952-.155,2.939,2.939,0,0,0-1.063.917q-.629.754-1.886,2.537a22,22,0,0,1-2.388,2.97,4.157,4.157,0,0,1-1.952,1.2,2.63,2.63,0,0,1-1.955-.424,2.5,2.5,0,0,1-1.208-2.676,12.139,12.139,0,0,1,1.859-4.424,10.409,10.409,0,0,1,3.334-3.646,3,3,0,0,1,3.266-.059l-1.115,1.818a1.469,1.469,0,0,0-1.224-.194,3.143,3.143,0,0,0-1.329.963,14.907,14.907,0,0,0-1.613,2.239,13.232,13.232,0,0,0-1.124,2.158,2.483,2.483,0,0,0-.207,1.3,1.137,1.137,0,0,0,.553.749,1.025,1.025,0,0,0,.9.136,2.9,2.9,0,0,0,1.058-.847,27.653,27.653,0,0,0,1.709-2.237q1.536-2.14,2.43-3.17a4.51,4.51,0,0,1,1.861-1.364,2.349,2.349,0,0,1,2.066.335,2.751,2.751,0,0,1,1.434,2.9,12.079,12.079,0,0,1-1.854,4.474,13.165,13.165,0,0,1-3.584,4.16,3.362,3.362,0,0,1-1.868.6A3.54,3.54,0,0,1-3265.217-7066.8Zm4.724-16.872,1.27-1.472,6.864,5.928-1.27,1.472Zm103.65,3.013a6.005,6.005,0,0,0-1.641-1.388,9.191,9.191,0,0,0-2.631-.933l-4.476,3.693-1.238-1.5,6.993-5.773,1.238,1.5-1.247,1.029a6.418,6.418,0,0,1,2.524.69,6.258,6.258,0,0,1,1.8,1.527,8.682,8.682,0,0,1,1.3,2.112l-1.343,1.108A9.458,9.458,0,0,0-3156.843-7080.655Zm-92.647.469q1.437-.806,2.421-1.413a16.213,16.213,0,0,0,1.959-1.429,7,7,0,0,0,1.78-2.051,2.629,2.629,0,0,0,.242-1.855,5.016,5.016,0,0,0-1.108-1.953,4.339,4.339,0,0,1-.555,2.248,7.678,7.678,0,0,1-1.875,2.2,8.187,8.187,0,0,1-2.646,1.545,4.686,4.686,0,0,1-2.661.137,4.473,4.473,0,0,1-2.341-1.554,4.455,4.455,0,0,1-1.131-2.556,4.674,4.674,0,0,1,.585-2.6,8.132,8.132,0,0,1,1.962-2.349,7.716,7.716,0,0,1,2.487-1.479,4.341,4.341,0,0,1,2.31-.171l-.983-1.163,1.486-1.254,5.1,6.035a4.864,4.864,0,0,1,1.4,4,6.688,6.688,0,0,1-2.531,3.776,24.681,24.681,0,0,1-4.891,3.174Zm1.058-12.005a5.2,5.2,0,0,0-2.954,1.417,5.235,5.235,0,0,0-1.895,2.677,2.661,2.661,0,0,0,.612,2.433,2.672,2.672,0,0,0,2.308,1.022,5.258,5.258,0,0,0,2.958-1.415,5.234,5.234,0,0,0,1.891-2.678,2.674,2.674,0,0,0-.621-2.447,2.651,2.651,0,0,0-2.107-1.016Q-3248.335-7092.2-3248.433-7092.191Zm79.782,8.288a7.876,7.876,0,0,1-4.408-1.926,7.922,7.922,0,0,1-2.886-3.857,4.14,4.14,0,0,1,.883-3.9,4.167,4.167,0,0,1,3.605-1.757,7.875,7.875,0,0,1,4.419,1.927,7.843,7.843,0,0,1,2.875,3.86,4.17,4.17,0,0,1-.894,3.9,4.176,4.176,0,0,1-3.362,1.76C-3168.495-7083.9-3168.572-7083.9-3168.651-7083.9Zm-4.765-8.384a2.7,2.7,0,0,0-.606,2.517,5.469,5.469,0,0,0,2.026,2.6,5.428,5.428,0,0,0,2.984,1.368,2.7,2.7,0,0,0,2.308-1.158,2.72,2.72,0,0,0,.612-2.524,5.433,5.433,0,0,0-2.01-2.6,5.45,5.45,0,0,0-3-1.374l-.127,0A2.731,2.731,0,0,0-3173.415-7092.288Zm-89.631,6.415,1.272-1.474,1.646,1.425-1.27,1.47Zm19.121-12.387,1.75-.847.881,1.817a5.677,5.677,0,0,1,1.227-2.527,7.748,7.748,0,0,1,2.612-1.923,5.843,5.843,0,0,1,3.987-.653,4.659,4.659,0,0,1,2.874,2.719l1.973,4.072-1.748.848-1.784-3.68a3.663,3.663,0,0,0-1.948-2.037,4.138,4.138,0,0,0-3.056.521,5.686,5.686,0,0,0-2.743,2.472,3.549,3.549,0,0,0,.105,3.282l1.573,3.249-1.748.847Zm59.867,5.186,3.354-6.564-2.435-1.245.771-1.509,2.437,1.245.1-.194q1.514-2.962,4.534-1.418c.489.25.885.458,1.186.631s.7.424,1.194.758l-.715,1.4c-.621-.376-1.174-.687-1.654-.933a4.847,4.847,0,0,0-1.361-.512,1.053,1.053,0,0,0-.845.2,3.117,3.117,0,0,0-.707.958l3.739,1.913-.772,1.509-3.739-1.912-3.355,6.564Zm-22.721-2.144,1.944-12.651,1.921.3-.241,1.566a4.427,4.427,0,0,1,2.121-1.1,7.922,7.922,0,0,1,2.977-.036,7.754,7.754,0,0,1,2.856.981,4.519,4.519,0,0,1,1.789,1.918,4.594,4.594,0,0,1,.337,2.774,4.6,4.6,0,0,1-1.152,2.531,4.54,4.54,0,0,1-2.283,1.293,7.8,7.8,0,0,1-3.017.081,7.921,7.921,0,0,1-2.831-.933,4.451,4.451,0,0,1-1.695-1.668l-.806,5.241Zm4.59-9.963a2.707,2.707,0,0,0-1.413,2.1,2.665,2.665,0,0,0,.783,2.426,5.4,5.4,0,0,0,3.049,1.31,5.04,5.04,0,0,0,3.206-.343,2.705,2.705,0,0,0,1.417-2.094,2.677,2.677,0,0,0-.774-2.424,5.357,5.357,0,0,0-3.042-1.309,8.164,8.164,0,0,0-1.227-.1A4.136,4.136,0,0,0-3202.189-7105.182Zm-17.378,6.441a4.66,4.66,0,0,1-1.746-3.552l-.434-4.5,1.937-.186.391,4.071a3.65,3.65,0,0,0,1.122,2.583,4.144,4.144,0,0,0,3.054.58,5.649,5.649,0,0,0,3.416-1.359,3.55,3.55,0,0,0,1.045-3.115l-.344-3.592,1.934-.186.865,9.008-1.934.188-.194-2.012a5.733,5.733,0,0,1-2.03,1.951,7.675,7.675,0,0,1-3.116.9q-.481.047-.924.047A5.234,5.234,0,0,1-3219.568-7098.74Z" transform="translate(3279.563 7108.545)" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                        </svg>
                                    </figure>
                                    <div className="join-cle-logo">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="62.656" height="23.068" viewBox="0 0 62.656 23.068">
                                            <path id="Path_93" data-name="Path 93" d="M635.85,621.053l.027-1.693-20.026,2.546v6.556h31.442c1,0,3.092,0,3.092,1.215s-2.088.9-3.224.9H613.909v0h-2.2V620.24h-2.068v10.333h-1.431a3.346,3.346,0,0,1-2.827-1.458,12.826,12.826,0,0,1-2.043-6.856s-4.4-.931-7.944,3.852a1.886,1.886,0,0,0-.054,2.119,5.838,5.838,0,0,0,2.375,2.331,5.132,5.132,0,0,0-1.066-.044c-1.926,0-3.536.031-3.567-2.052-.051-3.377.019-5.155.019-5.155h-1.419V638.7a3.63,3.63,0,0,0,3.63,3.63h2.527c1.73,0,2.456-1.4,2.456-3.133l-.042-9.557a5.082,5.082,0,0,1-2.893-1.864c-.229-.387.264-.893.616-1.178a5.024,5.024,0,0,1,3.838-1.188s.1,5.422.105,8.46a8.965,8.965,0,0,0,3.091,7.272,5.168,5.168,0,0,0,3.365,1.24l.192,0,1.178-1.562,1.179,1.562H642c9.454,0,12.389,1.377,12.346-11.665-.07-4.277-1.208-4.816-2.865-5.61-1.5-.718-8.36-.613-8.915-.613h-22.51v-1.242Z" transform="translate(-591.688 -619.36)" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}


function mapStateToProps(state) {
    let languages = '', categorySet = '';
    ///  console.log(state);
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language;
        categorySet = state.App.setCategory;
    }
    return {
        languages: languages,
        categorySet: categorySet

    };
};
export default connect(
    mapStateToProps,
    {}
)(MagazineCategory);

