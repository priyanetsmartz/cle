import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { getCookie } from '../../helpers/session';
import { siteConfig } from '../../settings/index';
import IntlMessages from "../../components/utility/intlMessages";
import notification from "../../components/notification";
import { Slider } from 'antd';
import { searchFields, addWhishlist, getWhishlistItemsForUser, removeWhishlist, getProductsFilterRestCollectionProducts } from '../../redux/cart/productApi';
import { useIntl } from 'react-intl';
import { capitalize, formatprice, handleCartFxn } from '../../components/utility/allutils';
import cartAction from "../../redux/cart/productAction";
import appAction from "../../redux/app/actions";
const { addToCartTask, productList, loaderProducts, addToWishlistTask } = cartAction;

const { showSignin } = appAction;

function SearchResults(props) {
    let pageSizeNumber = siteConfig.pageSize;
    const intl = useIntl();
    const { searchText, cat, brandname } = useParams();
    const [isShow, setIsShow] = useState(0);
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [pageSize, setPageSize] = useState(pageSizeNumber);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [filters, setFilters] = useState([]);
    const [total, setTotal] = useState(0);
    const [clearFilter, setclearFilter] = useState(false)
    const [currentFilter, setCurrentFilter] = useState('')
    const [catState, setCatState] = useState(0);
    const [sortValue, setSortValue] = useState({ sortBy: '', sortByValue: "" });
    const [sort, setSort] = useState(0);


    const language = getCookie('currentLanguage');
    const [autoSuggestions, SetAutoSuggestions] = useState([]);

    useEffect(() => {
        getData(searchText)
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [searchText, sortValue, page, pageSize, props.languages, cat, props.token])


    const getData = async (searchText) => {
        setOpacity(0.3);
        let customer_id = props.token.cust_id;
        let lang = props.languages ? props.languages : language;
        let filter: any;
        let catt = cat !== 'all' ? cat : 178;
        setCatState(catt)

        if (brandname) {
            //  console.log('searddchText')
            filter = await getProductsFilterRestCollectionProducts(catt, props.languages, 'brand', brandname, sortValue, pageSize, '', 'test', page);
        } else {
            filter = await searchFields(searchText, catt, pageSize, lang, sortValue.sortBy, sortValue.sortByValue, page);
        }

        let total = 0, aggregations = [], items = [];

        if (filter && filter.data && filter.data.length > 0 && filter.data[0].data && filter.data[0].data.products) {
            aggregations = filter.data[0].data.products.aggregations;
            total = filter.data[0].data.products.total_count;
            items = filter.data[0].data.products.items;
            let productResult = filter.data[0].data.products.items;
            //    console.log(total, Math.round(total / pageSize));
            setPagination(Math.ceil(total / pageSize));
            if (customer_id) {
                let whishlist: any = await getWhishlistItemsForUser();
                let products = items;
                let WhishlistData = whishlist.data;
                if (WhishlistData && WhishlistData.length > 0) {
                    const mergeById = (a1, a2) =>
                        a1.map(itm => ({
                            ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                            ...itm
                        }));

                    productResult = mergeById(products, WhishlistData);
                }
            }
            // props.loaderProducts(false);
            // props.productList(productResult);
            SetAutoSuggestions(productResult);
        }
        setOpacity(1);
        setTotal(total)
        setFilters(aggregations)


    }
    const clearfilter = (e) => {
        setclearFilter(true)
    }

    const filtterData = (event) => {
        setOpacity(0.3);
        setCurrent(1)
        let sortBy = "";
        let sortByValue = "";
        if (event.target.value === "1") {
            sortBy = "price";
            sortByValue = "DESC";
        } else if (event.target.value === "2") {
            sortBy = "price";
            sortByValue = "ASC";
        }

        setSort(event.target.value);
        setSortValue({ sortBy: sortBy, sortByValue: sortByValue })
        // props.sortingFilterProducts({ sortBy: sortBy, sortByValue: sortByValue })

    }


    async function handleWhishlist(id: number) {
        let token = props.token.token;
        if (token) {
            setIsWishlist(id)
            let result: any = await addWhishlist(id);
            //     console.log(result);
            if (result.data) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", result.data[0].message);
                getData(searchText)
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                getData(searchText)
            }
        } else {
            props.showSignin(true);
        }
    }

    async function handleDelWhishlist(id: number) {
        setDelWishlist(id)
        let del: any = await removeWhishlist(id);
        if (del.data[0].message) {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("success", "", del.data[0].message);
            getData(searchText)
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            getData(searchText)
        }
    }
    const handlePageSize = (page: number) => {
        setPageSize(page)
        setCurrent(1)
        //  props.setPageFilter(page)
    }
    const getPaginationGroup = () => {
        let start = Math.floor((page - 1) / pageSize) * pageSize;
        let fill = pagination > 5 ? 4 : pagination;
        //  console.log (new Array(fill).fill(fill).map((_, idx) => start + idx + 1))
        return new Array(fill).fill(fill).map((_, idx) => start + idx + 1);
    };

    const goToNextPage = (e) => {
        let lang = props.languages ? props.languages : language;
        e.preventDefault();
        setCurrent((page) => page + 1);

    }
    function changePage(event) {
        let lang = props.languages ? props.languages : language;

        event.preventDefault()
        const pageNumber = Number(event.target.textContent);
        setCurrent(pageNumber);
    }
    const goToPreviousPage = (e) => {
        let lang = props.languages ? props.languages : language;

        e.preventDefault();
        setCurrent((page) => page - 1);

    }

    async function handleCart(id: number, sku: string) {
        setIsShow(id);
        let cartResults: any = await handleCartFxn(id, sku);
        if (cartResults.item_id) {
            props.addToCartTask(true);
            notification("success", "", intl.formatMessage({ id: "addedtocart" }));
            setIsShow(0);
        } else {
            if (cartResults.message) {
                notification("error", "", cartResults.message);
            } else {
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
            setIsShow(0);
        }
    }
    const handlePriceRange = async (range) => {
        setCurrent(1)
        let customer_id = props.token.cust_id;
        let catID = catState ? catState : 178;
        setCatState(catID)
        props.loaderProducts(true);
        let r = range[0] + '-' + range[1];
        let filter: any = await getProductsFilterRestCollectionProducts(catID, props.languages, 'price', r, sortValue, pageSize);
        let total = 0, items = [];
        if (filter && filter.data && filter.data.length > 0 && filter.data[0].data && filter.data[0].data.products) {
            total = filter.data[0].data.products.total_count;
            items = filter.data[0].data.products.items;
            let productResult = filter.data[0].data.products.items;
            setPagination(Math.ceil(total / pageSize));
            if (customer_id) {
                let whishlist: any = await getWhishlistItemsForUser();
                let products = items;
                let WhishlistData = whishlist.data;
                if (WhishlistData && WhishlistData.length > 0) {
                    const mergeById = (a1, a2) =>
                        a1.map(itm => ({
                            ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                            ...itm
                        }));

                    productResult = mergeById(products, WhishlistData);
                }
            }
            SetAutoSuggestions(productResult);
        }
        props.loaderProducts(false);
        setTotal(total)
    }
    const currentvalue = async (e) => {
        //  console.log(searchText)
        e.preventDefault();
        let customer_id = props.token.cust_id;
        let catID = catState;
        setCurrent(1)
        let attribute_code = e.target.getAttribute("data-remove");
        let value = attribute_code === 'price' ? e.target.getAttribute("data-access") : e.target.value;
        //  console.log(e.target.getAttribute("data-access"))
        let catt = catID;
        if (attribute_code === 'category_id') {
            catt = e.target.value ? e.target.value : catID;
            setCatState(e.target.value)
        } else {
            setCatState(catID)
        }
        // console.log(attribute_code, catt, value)

        setCurrentFilter(e.target.value)
        props.loaderProducts(true);
        let filter: any;
        if (brandname) {
            filter = await getProductsFilterRestCollectionProducts(catt, props.languages, attribute_code, value, sortValue, pageSize, brandname);
        } else {
            console.log('attribute_code', attribute_code)
            filter = await getProductsFilterRestCollectionProducts(catt, props.languages, attribute_code, value, sortValue, pageSize, '', '', page, searchText);
        }

        let total = 0, items = [];
        if (filter && filter.data && filter.data.length > 0 && filter.data[0].data && filter.data[0].data.products) {
            total = filter.data[0].data.products.total_count;
            items = filter.data[0].data.products.items;
            let productResult = filter.data[0].data.products.items;
            if (customer_id) {
                let whishlist: any = await getWhishlistItemsForUser();
                let products = items;
                let WhishlistData = whishlist.data;
                if (WhishlistData && WhishlistData.length > 0) {
                    const mergeById = (a1, a2) =>
                        a1.map(itm => ({
                            ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                            ...itm
                        }));

                    productResult = mergeById(products, WhishlistData);
                }


            }
            // console.log(productResult);
            SetAutoSuggestions(productResult);
        }
        props.loaderProducts(false);
        setTotal(total)
        //   props.productList(items);
    }
    return (
        <div className="container">
            <div className="row">
                {/* Filter sidebar start*/}
                {searchText && (
                    <div className="col-sm-3">
                        {filters && filters.length > 0 && (
                            <div>
                                <Link to="#" className="clear-filter" onClick={clearfilter}><IntlMessages id="clear-all" /></Link>
                                <div className="pro_categry_sidebar">
                                    <div className="width-100">
                                        <div className="results_show">{total ? `${total + ' ' + intl.formatMessage({ id: "results-all" })}` : ""}</div>
                                    </div>
                                    <div className="sidebar_nav">
                                        <div className="flex-shrink-0 p-0 bg-white">
                                            {filters && filters.length > 0 && (
                                                <ul className="list-unstyled ps-0">
                                                    {filters.map((item, i) => {
                                                        let phigh = '', plow = '';
                                                        return (
                                                            <li className="mb-3" key={i}>
                                                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                                                    data-bs-target={`#home-collapse-${i}`} aria-expanded="false">
                                                                    {item.label === 'Price' ? <IntlMessages id="order.price" /> : item.label === 'Category' ? <IntlMessages id="category" /> : item.label}
                                                                </button>
                                                                {item.options.length > 0 && (
                                                                    <div className="collapse" id={`home-collapse-${i}`}>
                                                                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                                                            {item.label === 'Price' ?
                                                                                <div className="sliderAnt">{(() => {
                                                                                    phigh = item.options[item.options.length - 1].value;
                                                                                    plow = item.options[0].value;
                                                                                    let priceh = phigh.split('_');
                                                                                    let pricel = plow.split('_');
                                                                                    let priceLow = parseInt(pricel[0]);
                                                                                    let priceHigh = parseInt(priceh[1]);
                                                                                    return (
                                                                                        <div className="sliderInner">
                                                                                            {/* <p className="sliderlower">{priceLow}</p> */}
                                                                                            <Slider min={priceLow} max={priceHigh} range onAfterChange={handlePriceRange} />
                                                                                            {/* <p className="sliderupper" >{priceHigh}</p> */}
                                                                                        </div>)
                                                                                })()}</div>
                                                                                :
                                                                                item.options.map((val, j) => {
                                                                                    return (
                                                                                        <li key={j} data-access={val.label} data-remove={item.attribute_code} className={parseInt(currentFilter) === parseInt(val.value) ? 'active' : ''} value={val.value} onClick={currentvalue} >{val.label}</li>)
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                            </li>
                                                        )
                                                    })}

                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* Filter sidebar end */}
                <div className={brandname ? "col-sm-12" : "col-sm-9"} >
                    <div className="search_keyword"><h1>"{searchText ? capitalize(searchText) : capitalize(brandname)}"</h1></div>
                    {searchText && (<div className="resltspage_sec">
                        <div className="paginatn_result">
                            <span><IntlMessages id="product.results" /></span>
                            <ul>
                                <li><Link to="#" className={pageSize === 12 ? "active" : ""} onClick={() => { handlePageSize(12) }} >12</Link></li>
                                <li><Link to="#" className={pageSize === 60 ? "active" : ""} onClick={() => { handlePageSize(60) }} >60</Link></li>
                                <li><Link to="#" className={pageSize === 120 ? "active" : ""} onClick={() => { handlePageSize(120) }}>120</Link></li>
                            </ul>
                        </div>
                        <div className="sort_by">
                            <div className="sortbyfilter">
                                <select className="form-select customfliter" aria-label="Default select example" defaultValue={sort} onChange={filtterData} >
                                    <option value={0} key="0" >{intl.formatMessage({ id: "filterNewestFirst" })}</option>
                                    <option value={1} key="1" >{intl.formatMessage({ id: "filterPriceDesc" })}</option>
                                    <option value={2} key="2" >{intl.formatMessage({ id: "filterPriceAsc" })}</option>Our picks
                                    <option value={3} key="3" >{intl.formatMessage({ id: "filterourpicks" })}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    )}
                    <div className="product-listing" style={{ 'opacity': opacity }}>
                        {(autoSuggestions && autoSuggestions.length) ? (
                            <div className="row g-2">
                                {autoSuggestions.map(item => {
                                    let url = parseInt(item.brand) === 107 ? 'Bosphorus Leather' : 'Horus';
                                    return (
                                        <div className="col-md-4" key={item.id}>
                                            {/* <Link to={'/product-details/' + item.sku}> */}
                                            <div className="product py-4">
                                                <span className="off bg-favorite">
                                                    {!item.wishlist_item_id && (
                                                        <div>{isWishlist === item.id ? <i className="fas fa-circle-notch fa-spin"></i> : <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>}
                                                        </div>
                                                    )}

                                                    {item.wishlist_item_id && (
                                                        <div>{delWishlist === parseInt(item.wishlist_item_id) ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>}
                                                        </div>
                                                    )}
                                                </span>

                                                <div className="text-center">
                                                    {/* {
                                                        item.custom_attributes.map((attributes) => {
                                                            if (attributes.attribute_code === 'image') {
                                                                imageD = attributes.value;
                                                            }
                                                            if (attributes.attribute_code === 'short_description') {
                                                                description = attributes.value;
                                                            }
                                                        })
                                                    } */}
                                                    <Link to={'/product-details/' + item.sku}><img src={item.image.url} alt={item.name} width="200" /></Link>
                                                </div>
                                                <div className="about text-center">
                                                    <div className="product_name"><Link to={'/search/' + url}>{url}</Link></div>
                                                    <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                    <div className="pricetag">{siteConfig.currency} {formatprice(item.price ? item.price : item.price_range.minimum_price.final_price.value ? item.price_range.minimum_price.final_price.value : 0)}</div>
                                                </div>
                                                {/* {item.type_id === 'simple' && (
                                            <div className="cart-button mt-3 px-2"> <button onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase">{isShow === item.id ? "Adding....." : "Add to cart"}</button>
                                            </div>
                                        )}
                                        {item.type_id === 'configurable' && ( */}
                                                <div className="cart-button mt-3 px-2">
                                                    {isShow === item.id ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                        <Link to="#" onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                                </div>
                                                {/* )} */}

                                            </div>
                                            {/* </Link> */}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : <IntlMessages id="no_data" />}
                    </div>

                    <div className="resltspage_sec footer-pagints">
                        <div className="paginatn_result">
                            {searchText && (<span><IntlMessages id="product.results" /></span>)}
                            {searchText && (<ul>
                                <li><Link to="#" className={pageSize === 12 ? "active" : ""} onClick={() => { handlePageSize(12) }} >12</Link></li>
                                <li><Link to="#" className={pageSize === 60 ? "active" : ""} onClick={() => { handlePageSize(60) }} >60</Link></li>
                                <li><Link to="#" className={pageSize === 120 ? "active" : ""} onClick={() => { handlePageSize(120) }}>120</Link></li>
                            </ul>
                            )}
                        </div>
                        <div className="page_by">
                            <div className="pagination">

                                <div className="col-md-12 pagination">
                                    {pagination > 1 && (<nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center">
                                            <li
                                                className={`page-item prev ${page === 1 ? 'disabled' : ''}`}>
                                                <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className="page-link" aria-disabled="true"><IntlMessages id="pagination-prev" /></Link>
                                            </li>
                                            {getPaginationGroup().map((i, index) => (
                                                <li className="page-item" key={i}><Link className={`page-link ${page === i ? 'active' : ''}`} onClick={changePage} to="#">{i}</Link></li>
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
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}


const mapStateToProps = (state) => {
    //console.log(state)
    return {
        languages: state.LanguageSwitcher.language,
        token: state.session.user
    }
}
export default connect(
    mapStateToProps,
    { showSignin, productList, loaderProducts, addToCartTask, addToWishlistTask }
)(SearchResults);