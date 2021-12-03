import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { getCustomerOrders, searchOrders, getCustomerOrdersByDate, sortCustomerOrders, getCustomerOrdersByPrice } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";
import ReturnSection from './allReturns';
import IntlMessages from "../../../components/utility/intlMessages";
import { Slider } from 'antd';
import { getCookie } from '../../../helpers/session';
import { useIntl } from 'react-intl';
import { siteConfig } from '../../../settings/index'
import { capitalize, formatprice } from '../../../components/utility/allutils';


function OrdersAndReturns(props) {
    const userGroup = localStorage.getItem('token');
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup == '4') ? true : false);
    const [pageSize, setPageSize] = useState(12);
    const [orderId, setOrderId] = useState('');
    const [pagination, setPagination] = useState(1);
    const [orderDate, setOrderDate] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [orders, setOrders] = useState([]);
    const [page, setCurrent] = useState(1);
    const [loaderOrders, setLoaderOrders] = useState(false);
    const language = getCookie('currentLanguage');
    const intl = useIntl();
    useEffect(() => {
        getData(pageSize);
    }, [pageSize, props.languages, page]);

    const getData = async (pageSize) => {
        setLoaderOrders(true);
        let result: any = await getCustomerOrders(pageSize, page);
        if (result && result.data && result.data.items) {
            setLoaderOrders(false);
            setOrders(result.data.items);
            setPagination(Math.ceil(result.data.total_count / pageSize));
        }

    }
    const groupBy = async (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            let dateee = moment(currentValue[key]).format('MM/DD/YYYY');
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[dateee] = result[dateee] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }); // empty object is the initial value for result object
    };

    const handleSearch = async (e) => {
        setLoaderOrders(true);
        const val = e.target.value;
        setOrderId(val);
        if (val === "") return getData(pageSize);
        if (val.length >= 3) {
            let result: any = await searchOrders(val);
            if (result && result.data && !result.data.message) {
                //console.log(result.data.items)
                setLoaderOrders(false);
                setOrders(result.data.items);

            }
        }
    }

    const handlePriceRange = async (range) => {
        setLoaderOrders(true);
        let result: any = await getCustomerOrdersByPrice((range[0] * 10), (range[1] * 10), pageSize);
        if (result.data) {
            setOrders(result.data.items);
            setLoaderOrders(false);
        }
    }


    const getOrdersByDate = async (e) => {
        setLoaderOrders(true);
        const { value } = e.target;
        let filter = parseInt(value);
        let fromDate;
        let currentDate = moment(new Date());
        if (!filter) {
            return getData(pageSize);
        } else if (filter === 1 || filter === 3 || filter === 6) {
            fromDate = moment(currentDate).subtract(filter, 'M').toJSON();
        } else {
            fromDate = moment(`${filter}-01-01`).toJSON();
        }
        setOrderDate(fromDate);
        const dateFrom = moment(fromDate).format("YYYY-MM-DD h:mm:ss");
        const dateTo = moment(currentDate.toJSON()).format("YYYY-MM-DD h:mm:ss")
        let result: any = await getCustomerOrdersByDate(dateFrom, dateTo, pageSize);
        if (result) {
            setLoaderOrders(false);
            setOrders(result.data.items);
        }
    }

    const sortOrdersHandler = async (e) => {
        setLoaderOrders(true);
        setSortOrder(e.target.value);
        let result: any = await sortCustomerOrders(e.target.value, pageSize);
        if (result) {
            setLoaderOrders(false);
            setOrders(result.data.items);
        }
    }

    const handlePageSize = (page) => {
        setPageSize(page)
    }
    const getPaginationGroup = () => {
        let start = Math.floor((page - 1) / 4) * 4;
        let fill = pagination > 5 ? 4 : pagination;
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
    return (
        <>
               <div className={isPriveUser ? 'prive-txt col-sm-9' : 'col-sm-9'}>
                <div className="my_orders_returns_sec">
                    <div className="width-100">
                        <h1><IntlMessages id="order.myOrders" /></h1>
                        <h2><IntlMessages id="order.savePaymentAndShipping" /></h2>
                    </div>
                    <div className="range_slider">
                        <div className="range_inner">
                            <div className="row">
                                <div className="col-sm-4 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.date" />:</span>
                                        <select className="form-select" aria-label="Default select example" onChange={getOrdersByDate}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.price" />:</span>
                                        <Slider range max={20000} defaultValue={[0, 5]} onAfterChange={handlePriceRange} />

                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src="images/Icon_zoom_in.svg" alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchorderid" })} value={orderId}
                                                onChange={handleSearch} className="form-control me-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order_tab_sec">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home"
                                    type="button" role="tab" aria-controls="home" aria-selected="true"><IntlMessages id="order.orders" /></button>
                            </li>
                            {/* <li className="nav-item" role="presentation">
                                <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                                    type="button" role="tab" aria-controls="profile" aria-selected="false"><IntlMessages id="order.returns" /></button>
                            </li> */}

                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

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

                                                    <select value={sortOrder} onChange={sortOrdersHandler} className="form-select customfliter" aria-label="Default select example">
                                                        <option value="">{intl.formatMessage({ id: "sorting" })}</option>
                                                        <option value="asc">{intl.formatMessage({ id: "filterPriceAsc" })}</option>
                                                        <option value="desc">{intl.formatMessage({ id: "filterPriceDesc" })}</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {loaderOrders && (
                                    <div className="checkout-loading" >
                                        <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                                    </div>
                                )}
                                {orders && orders.length > 0 ?

                                    <div>

                                        {orders && (orders.map((item, i) => {
                                            // console.log(i)
                                            return (

                                                <div key={i}>
                                                    {/* <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="sortbyeyearly_show">
                                                        <h3>May 2021</h3>
                                                    </div>
                                                </div>
                                            </div> */}

                                                    <div className="row my-3">
                                                        <div className="col-sm-12">
                                                            <div className="row mb-3">
                                                                <div className="col-sm-6">
                                                                    <h3 className="order_numbr"><IntlMessages id="order.orderNo" />: {item.increment_id}</h3>
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <div className="viewall_btn">
                                                                        <Link to={`/order-details/${item.increment_id}`} className=""><IntlMessages id="category.viewAll" /></Link>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="d-md-flex">
                                                            <div className="col-sm-6">
                                                                <div className="order-viewsec">
                                                                    <div className="order-details">
                                                                        <div className="order-date">
                                                                            <label className="form-label"><IntlMessages id="order.orderDate" /></label>
                                                                            <div className="labl_text">{item.created_at ? moment(item.created_at).format('ddd, D MMMM YYYY') : ''}</div>
                                                                        </div>

                                                                        <div className="products">
                                                                            <label className="form-label"> <IntlMessages id="order.products" /></label>
                                                                            <div className="labl_text"> {item && item.items ? item.items.length : 0}</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="order-details">
                                                                        <div className="order-date">
                                                                            <label className="form-label"><IntlMessages id="order.shippingDate" /></label>
                                                                            <div className="labl_text">{item.shipment_date}</div>
                                                                        </div>

                                                                        <div className="products">
                                                                            <label className="form-label"> <IntlMessages id="order.price" /></label>
                                                                            <div className="labl_text">{siteConfig.currency} {formatprice(item.grand_total)}</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="order-shipped">
                                                                        <label className="form-label">
                                                                            {/* <IntlMessages id="order.weHaveShipped" /> */}
                                                                            {capitalize(item.status)}
                                                                        </label>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="prodcut_catg">
                                                                    <div className="product_photo">
                                                                        <img src={item.items[0]?.extension_attributes.item_image} className="img-fluid" alt="" />
                                                                    </div>
                                                                    <div className="product_photo">
                                                                        <img src={item.items[1]?.extension_attributes.item_image} className="img-fluid" alt="" />
                                                                    </div>
                                                                    <div className="more_product">
                                                                        <Link to="#">
                                                                            <img src={item.items[2]?.extension_attributes.item_image} className="img-fluid" alt="" />
                                                                            <div className="overlay_img"></div>
                                                                            <span className="more_pro">{item.items.length}</span>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="blank_bdr"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }))}
                                    </div>
                                    : !loaderOrders ? <IntlMessages id="no_data" /> : ""}

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
                                    </div>
                                </div>

                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <IntlMessages id="order.returns" />

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}



function mapStateToProps(state) {
    let languages = ''
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages,
        state: state
    }
};
export default connect(
    mapStateToProps
)(OrdersAndReturns);