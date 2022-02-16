import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { getCustomerReturn } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { siteConfig } from '../../../settings/index'
import { formatprice, getAccordingDate } from '../../../components/utility/allutils';

function MyReturns(props) {
    let pageSizeSetting = siteConfig.pageSize;
    const [pageSize, setPageSize] = useState(pageSizeSetting);
    const [returnPagination, setReturnPagination] = useState(1);
    const [returs, setReturn] = useState([]);
    const [page, setCurrent] = useState(1);
    const [sortOrder, setSortOrder] = useState('');
    const [loaderReturns, setLoaderReturns] = useState(false);

    const [range, setRange] = useState({ low: 0, high: 20000 })
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const intl = useIntl();

    useEffect(() => {
        getReturnData();
    }, [pageSize, props.languages, page]);



    const getReturnData = async (from_date: any = '', to_date: any = '', from_price: any = '', to_price: any = '', sortBy: any = '', sortOrders: any = '', search: any = '') => {
        let returns: any = await getCustomerReturn(pageSize, from_date, to_date, from_price, to_price, sortBy, sortOrders, search);

        if (returns && returns.data && returns.data.length > 0 && returns.data[0]) {
            let res = getAccordingDate(returns?.data?.[0])
            setLoaderReturns(false);
            setReturn(res);
            setReturnPagination(Math.ceil(returns.data.total_count / pageSize));
        }
    }

    const handlePageSize = (page) => {
        setPageSize(page)
    }

    const sortOrdersHandler = async (e) => {
        setLoaderReturns(true);
        setSortOrder(e.target.value);
        getReturnData(dateFilter.from, dateFilter.to, range.low, range.high, 'grand_total', e.target.value, searchTerm)
    }

    const goToNextPage = (e) => {
        e.preventDefault();
        setCurrent((page) => page + 1);
    }

    const goToPreviousPage = (e) => {
        e.preventDefault();
        setCurrent((page) => page - 1);
    }

    return (
        <>
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
            {loaderReturns && (
                <div className="checkout-loading" >
                    <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                </div>
            )}
            {returs && returs.length > 0 ?
                <div>
                    {returs && (returs.map((items, i) => {
                        return (
                            <>
                                <div className="row my-3">
                                    <h3>{items.date}</h3>
                                </div>
                                {items && items.Products && items.Products.map((item, i) => {
                                    return (
                                        <div key={i}>
                                            <div className="row my-3">
                                                <div className="col-sm-12">
                                                    <div className="row mb-3">
                                                        <div className="col-sm-6">
                                                            <h3 className="order_numbr"><IntlMessages id="order.orderNo" />: {item.order_id}</h3>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="viewall_btn">
                                                                <Link to={`/customer/return-details/${item.rma_increment_id}`} className=""><IntlMessages id="category.viewAll" /></Link>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="d-md-flex">
                                                    <div className="col-sm-6">
                                                        <div className="order-viewsec">
                                                            <div className="order-details">
                                                                <div className="order-date">
                                                                    <label className="form-label"><IntlMessages id="shipped.date" /></label>
                                                                    <div className="labl_text">{item.shipped_date ? moment(item.shipped_date).format('ddd, D MMMM YYYY') : ''}</div>
                                                                </div>

                                                                <div className="products">
                                                                    <label className="form-label"> <IntlMessages id="order.products" /></label>
                                                                    <div className="labl_text"> {item && item.total_qty ? item.total_qty : 0}</div>
                                                                </div>
                                                            </div>

                                                            <div className="order-details">
                                                                <div className="order-date">
                                                                    <label className="form-label"><IntlMessages id="return.date" /></label>
                                                                    <div className="labl_text">{item.return_date ? moment(item.return_date).format('ddd, D MMMM YYYY') : ''}</div>
                                                                </div>

                                                                <div className="products">
                                                                    <label className="form-label"> <IntlMessages id="order.price" /></label>
                                                                    <div className="labl_text">{siteConfig.currency} {formatprice(item.grand_total)}</div>
                                                                </div>
                                                            </div>

                                                            <div className="order-shipped">
                                                                <label className="form-label">
                                                                </label>
                                                            </div>


                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        {
                                                            item && item.items && item.items.length > 0 && (
                                                                <div className="prodcut_catg">
                                                                    {item.items && (item.items.slice(0, 2).map((img, i) => {
                                                                        return (
                                                                            <div className="product_photo" key={i}>
                                                                                <img src={img} className="img-fluid" alt="" />
                                                                            </div>
                                                                        )
                                                                    }))}

                                                                    {item.items.length > 2 && (
                                                                        <div className="more_product">
                                                                            <Link to="#">
                                                                                <img src={item.items[2]} className="img-fluid" alt="" />
                                                                                <div className="overlay_img"></div>
                                                                                <span className="more_pro">{item.items.length - 2}</span>
                                                                            </Link>
                                                                        </div>
                                                                    )
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div className="blank_bdr"></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )
                    }))}
                </div>
                : !loaderReturns ? <IntlMessages id="no_data" /> : ""}
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
                            {returnPagination > 1 && (<nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center">
                                    <li
                                        className={`page-item prev ${page === 1 ? 'disabled' : ''}`}>
                                        <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className="page-link" aria-disabled="true"><i className="fa fa-chevron-left" aria-hidden="true"></i></Link>
                                    </li>
                                    <li className='pageofpage'><IntlMessages id="page" /> <span className='active'>{page}</span> <IntlMessages id="of" /> {returnPagination}</li>
                                    <li className={`page-item next ${page === returnPagination ? 'disabled' : ''}`} >
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
)(MyReturns);