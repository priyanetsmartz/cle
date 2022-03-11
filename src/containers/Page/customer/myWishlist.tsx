import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import { Link } from 'react-router-dom'
import { wishListSearchSort } from '../../../redux/pages/customers';
import { formatprice, handleCartFxn, logoutUser } from '../../../components/utility/allutils';
import { removeWhishlist } from '../../../redux/cart/productApi';
import IconZoomIn from '../../../image/Icon_zoom_in.svg';
import cartAction from "../../../redux/cart/productAction";
import appAction from "../../../redux/app/actions";
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { siteConfig } from '../../../settings';
const { addToWishlistTask, addToCartTask } = cartAction;
const { showSignin } = appAction;

function MyWishList(props) {
    const userGroup = props.token.token;
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup === '4') ? true : false);
    const intl = useIntl();
    const [pageSize, setPageSize] = useState(siteConfig.pageSize);
    const [isShow, setIsShow] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [wishList, setWishList] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [page, setCurrent] = useState(1);
    const [sortValue, setSortValue] = useState({ sortBy: '', sortByValue: "" });
    const [pagination, setPagination] = useState(1);
    const [loaderOrders, setLoaderOrders] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        getData();
        return () => {
            props.addToWishlistTask(false);
            setSearchName('')
            setWishList([])
            setSortOrder('')
            setDelWishlist(0)
        }
    }, [props.languages, sortOrder, pageSize])

    const getData = async () => {// get details of wishlist orders
        setLoaderOrders(true)
        let result: any = await wishListSearchSort(props.languages, pageSize, sortValue.sortBy, sortValue.sortByValue, '');
        if (result && result.data) {
            setWishList(result.data);
            setOpacity(1)
            setLoaderOrders(false)
        } else {
            setOpacity(1)
            setLoaderOrders(false)
        }

    }

    const getSearchData = async (search) => {
        setLoaderOrders(true)
        let result: any = await wishListSearchSort(props.languages, siteConfig.pageSize, sortValue.sortBy, sortValue.sortByValue, search);
        if (result && result.data) {
            setWishList(result.data);
            setOpacity(1)
            setLoaderOrders(false)
        } else {
            setOpacity(1)
            setLoaderOrders(false)
        }

    }

    const searchHandler = (e) => {
        setOpacity(0.3)
        setSearchName(e.target.value);
        setTimeout(() => {
            getSearchData(e.target.value);
        }, 3000);
    }


    const filtterData = (event) => {// sorting by price
        let sortBy = "";
        let sortByValue = "";
        if (event.target.value === "1") {
            sortBy = "price";
            sortByValue = "DESC";
        } else if (event.target.value === "2") {
            sortBy = "price";
            sortByValue = "ASC";
        }

        setSortOrder(event.target.value);
        setSortValue({ sortBy: sortBy, sortByValue: sortByValue })

    }

    const handlePageSize = (page) => {
        setPageSize(page)
    }


    const goToNextPage = (e) => {
        e.preventDefault();
        setCurrent((page) => page + 1);
    }

    const goToPreviousPage = (e) => {
        e.preventDefault();
        setCurrent((page) => page - 1);
    }
    async function handleDelWhishlist(id: number) {// removing from wishlist based on id
        setDelWishlist(id)
        let del: any = await removeWhishlist(id);
        if (del.data[0].message) {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            getData()
            notification("success", "", del.data[0].message);
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            getData()
            notification("error", "", intl.formatMessage({ id: "genralerror" }));

        }
    }
    async function handleCart(id: number, sku: string) {// adding item to cart by hitting api
        setIsShow(id);
        let cartResults: any = await handleCartFxn(id, sku);

        if (cartResults.item_id) {
            props.addToCartTask(true);
            notification("success", "", intl.formatMessage({ id: "addedtocart" }));
            setIsShow(0);
        } else {

            if (cartResults?.message === "The consumer isn't authorized to access %resources.") {
                notification("error", "", "Session expired!");
                setTimeout(() => {
                    logoutUser()
                    props.showSignin(true)
                }, 2000)
            } else if (cartResults.message) {
                notification("error", "", cartResults.message);
            } else {
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
            setIsShow(0);
        }
    }
    return (
        <div className={isPriveUser ? 'prive-txt col-sm-9 my-wishlist-main' : 'col-sm-9 my-wishlist-main'}>
            <div className="row" >
                <div className="width-100 wishlist-head">
                    <h1><IntlMessages id="Profile.Wishlist-title" /></h1>
                    <h2><IntlMessages id="Profile.Wishlist-subTitle" /></h2>
                </div>

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4">
                            <div className='input-group wishlistsearch'>
                                <span className="input-group-text"><img src={IconZoomIn} alt="searchIcon" className="me-1" /></span>
                                <input type="text"
                                    className="form-control"
                                    placeholder={intl.formatMessage({ id: "searchPlaceholder" })}
                                    value={searchName}
                                    onChange={searchHandler}
                                />
                            </div>
                        </div>
                        <div className="col-md-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 mt-4">
                            <div className="resltspage_sec">
                                <div className="paginatn_result">
                                    <span><IntlMessages id="order.resultPerPage" /></span>
                                    <ul>
                                        <li><Link to="#" className={pageSize === 12 ? "active" : ""} onClick={() => { handlePageSize(12) }} >12</Link></li>
                                        <li><Link to="#" className={pageSize === 60 ? "active" : ""} onClick={() => { handlePageSize(60) }} >60</Link></li>
                                        <li><Link to="#" className={pageSize === 120 ? "active" : ""} onClick={() => { handlePageSize(120) }}>120</Link></li>
                                    </ul>
                                </div>
                                <div className="sort_by">
                                    <div className="sortbyfilter">
                                        <select className="form-select" aria-label="Default select example" defaultValue={sortOrder} onChange={filtterData} >
                                            <option value="">{intl.formatMessage({ id: "sorting" })}</option>
                                            <option value={1} key="1" >{intl.formatMessage({ id: "filterPriceDesc" })}</option>
                                            <option value={2} key="2" >{intl.formatMessage({ id: "filterPriceAsc" })}</option>

                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-md-6"></div>
                <div className="product-listing" style={{ 'opacity': opacity }} >
                    <div className="row g-2">
                        {loaderOrders && (
                            <div className="checkout-loading" >
                                <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                            </div>
                        )}
                        {wishList.length > 0 ?
                            <>
                                {wishList && wishList.map(item => {
                                    return (
                                        <div className="col-md-4 position-relative" key={item.product_id}>
                                            <span onClick={() => handleDelWhishlist(item.wishlist_item_id)} className="bg-remove">{delWishlist === item.wishlist_item_id ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-times" aria-hidden="true"></i>}</span>
                                            <div className="product p-4">
                                                <div className="text-center">
                                                    <Link to={'/product-details/' + item.sku}><img src={item.img_src} alt={item.name} width="200" /></Link>


                                                </div>
                                                <div className="wish-cart cart-button">
                                                    {isShow === parseInt(item.product_id) ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                        <Link to="#" onClick={() => { handleCart(parseInt(item.product_id), item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                                </div>
                                                <div className="wish text-left">
                                                    <h5><Link to={'/search/' + item.brand}>{item.brand}</Link></h5>
                                                    <div className="tagname"><Link to={'/product-details/' + item.sku}>{item.name}</Link></div>
                                                    <div className="pricetag">{siteConfig.currency} {formatprice(item.price)} </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                            : !loaderOrders ? <p className="nodata"> <IntlMessages id="no_data" /></p> : ""}
                        <div className="resltspage_sec footer-pagints">
                            <div className="paginatn_result">
                                <span><IntlMessages id="order.resultPerPage" /></span>
                                <ul>
                                    <li><Link to="#" className={pageSize === 12 ? "active" : ""} onClick={() => { handlePageSize(12) }} >12</Link></li>
                                    <li><Link to="#" className={pageSize === 60 ? "active" : ""} onClick={() => { handlePageSize(60) }} >60</Link></li>
                                    <li><Link to="#" className={pageSize === 120 ? "active" : ""} onClick={() => { handlePageSize(120) }}>120</Link></li>
                                </ul>
                            </div>
                            <div className="page_by">
                                <div className="pagination">
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
                    </div>
                </div>

            </div>

        </div>

    );
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.addToWishlist,
        languages: state.LanguageSwitcher.language,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { addToWishlistTask, addToCartTask, showSignin }
)(MyWishList);