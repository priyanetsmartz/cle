import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link, useParams } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import appAction from "../../../redux/app/actions";
import { addWhishlist, getWhishlistItemsForUser, removeWhishlist, getProductsFilterRestCollection, getProductsFilterRestCollectionProducts } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";
import Recomendations from './product-details/recomendations';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Slider } from 'antd';
import { useIntl } from 'react-intl';
import { capitalize, formatprice, handleCartFxn } from '../../../components/utility/allutils';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import { siteConfig } from '../../../settings/index'
import { getCategoryDetailsbyUrlPath } from '../../../redux/pages/customers';
import orderprocessing from "../../../image/orderprocessing.gif";
const commonFunctions = new CommonFunctions();

const baseUrl = commonFunctions.getBaseUrl();
const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList, addToCartTask, addToWishlistTask, sortingFilterProducts, setPageFilter, loaderProducts } = cartAction;
const { showSignin, showLoader } = appAction;


function Products(props) {
    const { category, subcat, childcat, greatchildcat }: any = useParams();

    let imageD = '', url = '';
    const intl = useIntl();
    const [isShow, setIsShow] = useState(0);
    const [isShown, setIsShown] = useState('');
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [urlp, seturlp] = useState('');
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [pageSize, setPageSize] = useState(siteConfig.pageSize);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [filterArray, setFilterArray] = useState({ category: [], brand: [], price: '' });
    const [token, setToken] = useState('');
    const [sortValue, setSortValue] = useState({ sortBy: '', sortByValue: "" });
    const [sort, setSort] = useState('');
    const [filters, setFilters] = useState([]);
    const [total, setTotal] = useState(0);
    const [catStateLoad, setCatStateLoad] = useState(0);
    const [catState, setCatState] = useState(0);
    const [currentFilter, setCurrentFilter] = useState('')
    const [clearFilter, setclearFilter] = useState(false)
    const language = getCookie('currentLanguage');
    const [nameHeader, setNameHeader] = useState('')
    const [nameHeaderOld, setNameHeaderOld] = useState('')
    const [metaData, setMetaData] = useState({
        meta_description: '',
        meta_keywords: "",
        meta_title: ""
    })

    useEffect(() => {
        let urlPath = '';
        if (category && subcat && childcat && greatchildcat) {
            urlPath = category + "/" + subcat + "/" + childcat + '/' + greatchildcat;
        } else if (category && subcat && childcat) {
            urlPath = category + "/" + subcat + "/" + childcat;
        } else if (category && subcat) {
            urlPath = category + "/" + subcat;
        } else {
            urlPath = category;
        }

        seturlp(urlPath)

        const localToken = props.token.token;
        setToken(localToken)
        if (urlPath) {
            getProducts(urlPath);
        }

        return () => {
            props.addToCartTask(false);
            props.addToWishlistTask(true);
        }
    }, [props.languages, clearFilter])

    useEffect(() => {

        if (catState !== 0) {
            getProductById(catState)
        }
    }, [sortValue, page, pageSize, sort, catState])

    async function getProducts(urlPath) {
        props.loaderProducts(true);
        let lang = props.languages ? props.languages : language;
        setOpacity(0.3);
        let result1: any = await getCategoryDetailsbyUrlPath(lang, urlPath, siteConfig.pageSize);
        let catID = result1 && result1.data && result1.data.items && result1.data.items.length > 0 ? result1.data.items[0].id : '';
        let catName = result1 && result1.data && result1.data.items && result1.data.items.length > 0 ? result1.data.items[0].name : '';
        if (result1 && result1.data && result1.data.items && result1.data.items.length > 0 && result1.data.items[0].custom_attributes && result1.data.items[0].custom_attributes.length > 0) {
            let obj: any = {};
            result1.data.items[0].custom_attributes.forEach(el => {
                if (el.attribute_code === "meta_description") {
                    obj.meta_description = el.value;
                } else if (el.attribute_code === "meta_keywords") {
                    obj.meta_keywords = el.value;
                } else if (el.attribute_code === "meta_title") {
                    obj.meta_title = el.value;
                }
            });
            setMetaData(obj);
        }
        getProductById(catID)
        setNameHeader(catName);
        setNameHeaderOld(catName)
        setCatState(catID)
        setCatStateLoad(catID)


    }

    async function getProductById(catID) {
        let filter: any = await getProductsFilterRestCollection(catID, props.languages, sortValue, pageSize, page);
        let customer_id = props.token.cust_id;
        let total = 0, aggregations = [], items = [];

        if (filter && filter?.data[0]?.data?.products) {
            let productArray = filter?.data[0]?.data?.products;
            let productResult = productArray?.items;

            aggregations = productArray?.aggregations;
            total = productArray?.total_count;
            items = productArray?.items;

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
            props.productList(productResult);
            props.loaderProducts(false);
        }

        setOpacity(1);
        setTotal(total)
        setFilters(aggregations)
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
        props.sortingFilterProducts({ sortBy: sortBy, sortByValue: sortByValue })

    }


    async function handleWhishlist(id: number) {
        if (token) {
            setIsWishlist(id)
            let result: any = await addWhishlist(id);

            if (result.data) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", intl.formatMessage({ id: "addedToWhishlist" }));
                getProducts(urlp)
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                getProducts(urlp)
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
            getProducts(urlp)
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            getProducts(urlp)
        }
    }
    const handlePageSize = (page: number) => {
        setPageSize(page)
        setCurrent(1)
        props.setPageFilter(page)
    }


    const goToNextPage = (e) => {
        e.preventDefault();
        setCurrent((page) => page + 1);
    }

    const goToPreviousPage = (e) => {

        e.preventDefault();
        setCurrent((page) => page - 1);

    }
    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }

    const clearfilter = (e) => {
        let nameTop = '';
        if (category && subcat && childcat && greatchildcat) {
            nameTop = greatchildcat;
        } else if (category && subcat && childcat) {
            nameTop = childcat;
        } else if (category && subcat) {
            nameTop = subcat;
        } else {
            nameTop = category;
        }
        setFilterArray(prevState => ({
            ...prevState,
            category: [],
            price: '',
            brand: []
        }))
        setNameHeader(nameTop)
        setclearFilter(true)

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

    async function makeFilterApicall(catID, languages, type, value, sortValue, pageSize) {
        let customer_id = props.token.cust_id;
        let filter: any = await getProductsFilterRestCollectionProducts(catID, languages, type, value, sortValue, pageSize);
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
            props.productList(productResult);
            props.loaderProducts(false);
        }

        setTotal(total)
    }

    const handlePriceRange = async (range) => {
        props.loaderProducts(true);
        setCurrent(1)
        let catID = catState ? catState : 178;
        setCatState(catID)
        
        let r = range[0] + '-' + range[1];
        setFilterArray(prevState => ({
            ...prevState,
            price: r
        }))
        makeFilterApicall(catID, props.languages, 'price', r, sortValue, pageSize);
    }

    const currentvalue = async (e) => {
        props.loaderProducts(true);
        setclearFilter(false)
        e.preventDefault();
        let catID = catState ? catState : 178;
        setCurrent(1)
        setCurrentFilter(e.target.value)
        let attribute_code = e.target.getAttribute("data-remove");
        let value = attribute_code === 'price' ? e.target.getAttribute("data-access") : e.target.value;

        let catt: any;
        let catdata = [];
        catdata['id'] = e.target.value;
        catdata['value'] = e.target.getAttribute("data-access");
        if (attribute_code === 'category_id') {
            catt = e.target.value ? e.target.value : catID;
            setCatState(e.target.value)
            setNameHeader(e.target.getAttribute("data-access"))
            setFilterArray(prevState => ({
                ...prevState,
                category: catdata
            }))
        } else {
            setFilterArray(prevState => ({
                ...prevState,
                brand: catdata,
                price: ''
            }))
            catt = catID;
            setCatState(catID)
        }
        makeFilterApicall(catt, props.languages, attribute_code, value, sortValue, pageSize)
    }

    const removeSelectedCategories = (type, value) => {
        props.loaderProducts(true);
        if (type !== 'category_id') {
            let catID = catState ? catState : 178;
            getProductById(catID);
            if (type === 'price') {
                setFilterArray(prevState => ({
                    ...prevState,
                    price: ''
                }))

            } else if (type === 'brand') {
                setFilterArray(prevState => ({
                    ...prevState,
                    brand: []
                }))
            }
        } else {
            setNameHeader(nameHeaderOld)
            let catID = catStateLoad ? catStateLoad : 178;
            setFilterArray(prevState => ({
                ...prevState,
                category: [],
                price: '',
                brand: []
            }))
            getProductById(catID);
        }

    }

    return (
        <main>
            {/* <Promotion /> */}
            <HelmetProvider>
                <Helmet >
                    <title>{nameHeader ? nameHeader : 'header'}</title>
                    <meta name="description" content={metaData?.meta_description} />
                    <meta name="keywords" content={metaData?.meta_keywords} />
                    <meta property="og:title" content={metaData?.meta_title} />
                    <meta property="og:description" content={metaData?.meta_description} />
                </Helmet>
            </HelmetProvider>
            <section>
                <div className="container">
                    <div className="row">
                        {/* Filter sidebar start*/}

                        <div className="col-sm-3">
                            {filters && filters.length > 0 && (
                                <div className="sticky-fliter">
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
                                                                    {item.options.length > 0 && (
                                                                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                                                            data-bs-target={`#home-collapse-${i}`} aria-expanded="false">
                                                                            {item.label === 'Price' ? <IntlMessages id="order.price" /> : item.label === 'Category' ? <IntlMessages id="category" /> : item.label}
                                                                        </button>
                                                                    )}
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
                                                                                                <Slider min={priceLow} max={priceHigh} range onAfterChange={handlePriceRange} defaultValue={[priceLow, priceHigh]} />

                                                                                            </div>)
                                                                                    })()}</div>
                                                                                    :
                                                                                    item?.options?.length > 0 && item.options.map((val, j) => {
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

                        {/* Filter sidebar end */}
                        {props.items.length > 0 ?
                            <div className="col-sm-9">
                                <div className="search_keyword"><h1>{nameHeader ? capitalize(nameHeader) : "All"}</h1></div>
                                <div className='filterarray'>
                                    {filterArray.category['value'] && (<li onMouseEnter={() => setIsShown('category')} onMouseLeave={() => setIsShown('')} ><Link to="#"  ><span className='textname'  > {filterArray.category['value']}   {isShown === 'category' ? <span className='cross' onClick={(e) => removeSelectedCategories('category_id', filterArray.category['id'])}   >  <i className="fa fa-times" aria-hidden="true"></i></span> : ""
                                    }</span>
                                    </Link></li>
                                    )}

                                    {filterArray.brand['value'] && (<li onMouseEnter={() => setIsShown('brand')} onMouseLeave={() => setIsShown('')} ><Link to="#"  ><span className='textname'  > {filterArray.brand['value']}   {isShown === 'brand' ? <span className='cross' onClick={(e) => removeSelectedCategories('brand', filterArray.brand['id'])}   >  <i className="fa fa-times" aria-hidden="true"></i></span> : ""
                                    }</span>
                                    </Link></li>
                                    )}

                                    {filterArray.price && (<li onMouseEnter={() => setIsShown('price')} onMouseLeave={() => setIsShown('')} ><Link to="#"  ><span className='textname'  > {filterArray.price}   {isShown === 'price' ? <span className='cross' onClick={(e) => removeSelectedCategories('price', filterArray.price)}   >  <i className="fa fa-times" aria-hidden="true"></i></span> : ""
                                    }</span>
                                    </Link></li>
                                    )}

                                </div>

                                <div className="resltspage_sec">
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
                                                <option value="" key="4" >{intl.formatMessage({ id: "sorting" })}</option>
                                                <option value={0} key="0" >{intl.formatMessage({ id: "filterNewestFirst" })}</option>
                                                <option value={1} key="1" >{intl.formatMessage({ id: "filterPriceDesc" })}</option>
                                                <option value={2} key="2" >{intl.formatMessage({ id: "filterPriceAsc" })}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-listing plp-listing" style={{ 'opacity': opacity }}>
                                    {props.prodloader ? 
                                   <p className='productloader' style={{ 'width': '200px' }}> <img className="loading-gif" src={orderprocessing} alt="loader" /></p>:
                                    <div className="row g-2">
                                        {props.items.map(item => {
                                            url = parseInt(item.brand) === 107 ? 'Bosphorus Leather' : 'Horus';
                                            return (
                                                <div className="col-md-4" key={item.id}>

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

                                                        <div className="text-center" onMouseEnter={() => someHandler(item.id)}
                                                            onMouseLeave={() => someOtherHandler(item.id)}>
                                                            {
                                                                item.custom_attributes && item.custom_attributes.length > 0 && item.custom_attributes.map((attributes) => {
                                                                    if (attributes.attribute_code === 'image') {
                                                                        imageD = attributes.value;
                                                                    }
                                                                })

                                                            }
                                                            <Link to={'/product-details/' + item.sku}>
                                                                {isHoverImage === parseInt(item.id) ? <img src={item.media_gallery_entries && item.media_gallery_entries.length > 2 ? `${productUrl}/${item.media_gallery_entries[1].file}` : imageD ? imageD : item.image.url} className="image-fluid hover" alt={item.name} height="150" /> : <img src={imageD ? imageD : item.image.url} className="image-fluid" alt={item.name} height="150" />
                                                                }</Link>
                                                        </div>
                                                        <div className="about text-center">
                                                            <div className="product_name"><Link to={'/search/' + url}>{parseInt(item.brand) === 107 ? 'Bosphorus Leather' : 'Horus'}</Link></div>
                                                            <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>

                                                            <div className="pricetag">{siteConfig.currency} {formatprice(item.price ? item.price : item.price_range.minimum_price.final_price.value ? item.price_range.minimum_price.final_price.value : 0)} </div>
                                                        </div>

                                                        <div className="cart-button mt-3 px-2">
                                                            {isShow === item.id ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                                <Link to="#" onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                                        </div>


                                                    </div>

                                                </div>
                                            )
                                        })}
                                    </div>
                                     }
                                </div>
                                <div className="resltspage_sec footer-pagints">
                                    <div className="paginatn_result">
                                        <span><IntlMessages id="product.results" /></span>
                                        <ul>
                                            <li><Link to="#" className={pageSize === 12 ? "active" : ""} onClick={() => { handlePageSize(12) }} >12</Link></li>
                                            <li><Link to="#" className={pageSize === 60 ? "active" : ""} onClick={() => { handlePageSize(60) }} >60</Link></li>
                                            <li><Link to="#" className={pageSize === 120 ? "active" : ""} onClick={() => { handlePageSize(120) }}>120</Link></li>
                                        </ul>
                                    </div>
                                    <div className="page_by">
                                        <div className="col-md-12 pagination">

                                            {pagination > 1 && (<nav aria-label="Page navigation example">
                                                <ul className="pagination justify-content-center">
                                                    <li
                                                        className={`page-item prev ${page === 1 ? 'disabled' : ''}`}>
                                                        <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className="page-link" aria-disabled="true"><i className="fa fa-chevron-left" aria-hidden="true"></i></Link>
                                                    </li>
                                                    <li className='pageofpage'><IntlMessages id="page" /> <span className='active'>{page}</span> <IntlMessages id="of" /> {pagination}</li>
                                                    <li className={`page-item next ${page === pagination ? 'disabled' : ''}`} >
                                                        <Link className="page-link" onClick={(e) => { goToNextPage(e); }}
                                                            to="/"><i className="fa fa-chevron-right" aria-hidden="true"></i></Link>
                                                    </li>
                                                </ul>
                                            </nav>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <>{props.prodloader ? <p className='productloader'> <img className="loading-gif" src={orderprocessing} alt="loader" /></p> : <IntlMessages id="NotFound" />}</>}


                    </div>
                </div>
            </section>

            <section className="mb-5">
                <Recomendations />
            </section>

        </main>
    )
}
const mapStateToProps = (state) => {

    let languages = '', load = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    if (state && state.Cart) {
        load = state.Cart.prods
    }

    return {
        items: state.Cart.items,
        wishlist: state.Cart.addToWishlistTask,
        languages: languages,
        prodloader: load,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { showLoader, addToCart, productList, addToCartTask, addToWishlistTask, showSignin, sortingFilterProducts, setPageFilter, loaderProducts }
)(Products);