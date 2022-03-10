import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { InputNumber, Slider } from 'antd';
import moment from 'moment';
import { Link } from "react-router-dom";
import searchIcon from '../../../image/Icon_zoom_in.svg';
import { removeProduct, searchProducts } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Modal from "react-bootstrap/Modal";

function MyProductListing(props) {
    const intl = useIntl();
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    let venID = localToken && localToken?.vendor_id ? localToken?.vendor_id : 0;
    const [listingData, setListingData] = useState([])
    const [range, setRange] = useState({ low: 0, high: 20000 })
    const [status, setStatus] = useState();
    const [sortOrder, setSortOrder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [vendorId, setVendorId] = useState(venID);
    const [deletePop, setDeletePop] = useState(false);
    const [deleteId, setDeleteID] = useState(0)
    const [isLoading, setIsLoading] = useState(true);
    const [loader, setLoader] = useState(false);


    useEffect(() => {

        getVendorProductListing()
        return (
            setListingData([])
        )
    }, [])

    async function getVendorProductListing(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {// function to get the product of vendor and this function is calling another fuction searchProducts which is calling to the api to get the products. 
        setIsLoading(true);
        let pageSize = props.pageData ? props.pageData : "";

        let result: any = await searchProducts(props.languages, pageSize, status, from, to, term, dateFrom, dateTo, sortorder);

        let dataObj = result && result.data && result.data.length > 0 ? result.data : [];

        const renObjData = dataObj.map(function (data, idx) {

            let productLoop: any = {};

            productLoop.id = data.id;
            productLoop.image = data.img;
            productLoop.product = data;
            productLoop.date = moment(data.created_at).format('DD MMMM YYYY');
            productLoop.status = data.status;
            productLoop.price = siteConfig.currency + data.price;
            return productLoop;
        });
        setListingData(renObjData)
        setIsLoading(false);
    }

    const getOrdersByStatus = async (e) => {// applying the status filter on the vendor products by calling 'getVendorProductListing'
        const { value } = e.target;
        setStatus(value)
        getVendorProductListing(value, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const datePickerCallback = async (start, end, label) => {// applying the date filter by setting from and to date on the vendor products by calling 'getVendorProductListing'
        let from = moment(start).format("MM/DD/YYYY"), to = moment(end).format("MM/DD/YYYY");
        if (label === 'All') {
            setDateFilter(prevState => ({
                ...prevState,
                from: '',
                to: ''
            }))
            getVendorProductListing(status, range.low, range.high, searchTerm, '', '', sortOrder);
        } else {
            setDateFilter(prevState => ({
                ...prevState,
                from: from,
                to: to
            }))
            getVendorProductListing(status, range.low, range.high, searchTerm, from, to, sortOrder);
        }
    }

    const getOrdersByPrice = async (range) => {// applying the price filter by setting from and to price on the vendor products by calling 'getVendorProductListing'
        let from = range[0];
        let to = range[1];
        setRange(prevState => ({
            ...prevState,
            low: from,
            high: to
        }))
        getVendorProductListing(status, from, to, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const getOrdersBySearchTerm = async (e) => {// applying the search filter by setting search term (if length of term >=3) on the vendor products by calling 'getVendorProductListing'

        if (e.target.value.length >= 3) {
            setTimeout(() => {
                setSearchTerm(e.target.value)
            }, 3000)
        } else {
            setSearchTerm("")
        }
        getVendorProductListing(status, range.low, range.high, e.target.value, dateFilter.from, dateFilter.to, sortOrder)
    }

    const sortOrdersHandler = async (e) => {// applying the sorting filter by setting sortOrder on the vendor products by calling 'getVendorProductListing'
        setSortOrder(e.target.value);
        getVendorProductListing(status, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, e.target.value)
    }

    const handleDelete = (prodId) => { //to set the id of the product to be deleted and also the pop up variable to true
        setDeleteID(prodId)
        setDeletePop(true);
    }

    async function deleteProduct() {// to delete the product by calling the api function
        setLoader(true)
        let payload = {
            "sku": deleteId,
            "status": 2,
            "vendorId": vendorId,
            "storeId": props.languages === 'english' ? '3' : '2'
        }
        await removeProduct(payload)
        getVendorProductListing();
        setLoader(false)
        closePop();
    }
    const closePop = () => {// to set the variable of delete product pop up to false.
        setDeletePop(false);
    }
    const columns = [// to set the columns of the data table.
        {
            name: <i className="fa fa-camera" aria-hidden="true"></i>,
            selector: row => row.img,
            cell: row => <img height="84px" width="56px" alt={row.image} src={row.image} />,
        },
        {
            name: intl.formatMessage({ id: 'Product' }),
            sortable: true,
            cell: row => (
                <div>
                    <p className='prodbrand'>{row.product.brand}</p>
                    <p className='prodname'>{row.product.name}</p>
                    <p className='prodId'><span><IntlMessages id="id" />:</span>{row.product.id}</p>
                    <div className='data_value'><ul><li>{<Link to={'/product-details-preview/' + venID + '/' + row.product.sku} target="_blank" ><IntlMessages id="view" /></Link>}</li><li><Link to="#" onClick={() => { handleDelete(row.product.sku) }} ><IntlMessages id="delete" /></Link></li></ul></div>
                </div>
            ),
        },
        {
            name: intl.formatMessage({ id: 'order.date' }),
            selector: row => row.date,
        },
        {
            name: intl.formatMessage({ id: 'status' }),
            selector: row => row.status,
            cell: row => (
                <div>
                    {row.status === "1" ? <span className="active">{intl.formatMessage({ id: "product.active" })}</span> : ""}
                    {row.status === "8" ? <span className="sold">{intl.formatMessage({ id: "product.sold" })}</span> : ""}
                    {row.status === "3" ? <span className="pending">{intl.formatMessage({ id: "product.pending" })}</span> : ""}
                    {row.status === "10" ? <span className="rejected">{intl.formatMessage({ id: "product.rejected" })}</span> : ""}
                    {row.status === "2" ? <span className="disabled">{intl.formatMessage({ id: "product.disabled" })}</span> : ""}
                </div>


            ),
        },
        {
            name: intl.formatMessage({ id: 'price' }),
            selector: row => row.price,
        }
    ];

    const paginationComponentOptions = {
        noRowsPerPage: true,
    };

    return (
        <div className={props.pageData ? 'col-md-12' : 'col-md-9'}>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    {!props.pageData && (
                        <div className="row">
                            <div className="col-sm-12">
                                <h1><IntlMessages id="vendor.productListing" /></h1>
                                <p><IntlMessages id="products.description.1" /><br /><IntlMessages id="products.description.2" /></p>
                            </div>
                        </div>
                    )}
                    {!props.pageData && (
                        <div className="range_slider">
                            <div className="range_inner">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
                                        <div className="form-group">
                                            <span className="form-label"><IntlMessages id="status" /></span>
                                            <select className="form-select" aria-label="Default select example" defaultValue={status} onChange={getOrdersByStatus}>
                                                <option value="">{intl.formatMessage({ id: "select" })}</option>
                                                <option value="1">{intl.formatMessage({ id: "product.active" })}</option>
                                                <option value="2">{intl.formatMessage({ id: "product.disabled" })}</option>
                                                <option value="3">{intl.formatMessage({ id: "product.pending" })}</option>
                                                <option value="8">{intl.formatMessage({ id: "product.sold" })}</option>
                                                <option value="10">{intl.formatMessage({ id: "product.rejected" })}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
                                        <div className="form-group">
                                            <span className="form-label"><IntlMessages id="order.date" /></span>
                                            <DateRangePicker
                                                onCallback={datePickerCallback}
                                                initialSettings={{
                                                    startDate: moment(),
                                                    endDate: moment(),
                                                    ranges: {
                                                        'All': "",
                                                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                                                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                                    },
                                                    locale: {
                                                        format: "DD/MM/YYYY"
                                                    }
                                                }}
                                            >
                                                <input type="text" className="form-control" />
                                            </DateRangePicker>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
                                        <div className="form-group">
                                            <span className="form-label"><IntlMessages id="order.price" /></span>
                                            <div className='pricerangeouter' >
                                                <InputNumber
                                                    min={1}
                                                    max={20000}
                                                    readOnly={true}
                                                    value={range.low}
                                                    onChange={getOrdersByPrice}
                                                />
                                                <span>-</span>
                                                <InputNumber
                                                    min={1}
                                                    max={20000}
                                                    readOnly={true}
                                                    value={range.high}
                                                    onChange={getOrdersByPrice}
                                                />
                                            </div>
                                            <Slider range max={20000} defaultValue={[range.low, range.high]} onAfterChange={getOrdersByPrice} />
                                        </div>

                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
                                        <div className="form-group">
                                            <span className="form-label">&nbsp;</span>
                                            <div className="search_results">
                                                <img src={searchIcon} alt="" className="me-1 search_icn" />
                                                <input type="search" placeholder={intl.formatMessage({ id: "searchPlaceholder" })} className="form-control me-1" onChange={getOrdersBySearchTerm} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <Link className="btn btn-secondary" to="/product-integration" ><IntlMessages id="product_integration" /></Link>
                                </div>
                                <div className="col-sm-6">
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

                    )}
                    <div className="product-listing">
                        <DataTable
                            progressPending={isLoading}
                            columns={columns}
                            data={listingData}
                            pagination={true}
                            paginationComponentOptions={paginationComponentOptions}
                        />
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Link className="btn btn-secondary" to="/product-integration" ><IntlMessages id="product_integration" /></Link>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={deletePop}>
                <Modal.Body className="CLE_pf_details modal-confirm">

                    <div className="deletePopup">
                        <div className="modal-header flex-column">
                            <i className="far fa-times-circle"></i>
                            <h4 className="modal-title w-100"><IntlMessages id="deletetheproduct" /></h4>
                            <Link to="#" onClick={closePop} className="close"> <i className="fas fa-times"></i></Link>
                        </div>
                        <div className="modal-body">
                            <p><IntlMessages id="deleteProduct.confirmation" /></p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-primary" onClick={closePop} data-dismiss="modal"><IntlMessages id="productEdit.cancel" /></button>
                            <button type="button" className="btn btn-secondary" style={{ "display": !loader ? "inline-block" : "none" }} onClick={deleteProduct} ><IntlMessages id="productEdit.delete" /></button>
                            <div className="spinner btn btn-secondary" style={{ "display": loader ? "inline-block" : "none" }}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                <IntlMessages id="loading" />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    )
}

const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        items: state.Cart.items,
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(MyProductListing);