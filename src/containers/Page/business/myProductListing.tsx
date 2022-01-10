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
import { capitalize } from '../../../components/utility/allutils';


function MyProductListing(props) {
    const intl = useIntl();
    let brand = '';
    const [listingData, setListingData] = useState([])
    const [range, setRange] = useState({ low: 0, high: 0 })
    const [status, setStatus] = useState();
    const [sortOrder, setSortOrder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [vendorId, setVendorId] = useState(1);
    const [deletePop, setDeletePop] = useState(false);
    const [deleteId, setDeleteID] = useState(0)
    useEffect(() => {
        getVendorProductListing()
        return (
            setListingData([])
        )
    }, [])

    async function getVendorProductListing(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {
        let result: any = await searchProducts(props.languages, siteConfig.pageSize, status, from, to, term, dateFrom, dateTo, sortorder);

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

    }

    const getOrdersByStatus = async (e) => {
        const { value } = e.target;
        setStatus(value)
        getVendorProductListing(value, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const datePickerCallback = async (start, end, label) => {
        // console.log(moment(start).format("MM/DD/YYYY"), moment(end).format("MM/DD/YYYY"), label);
        let from = moment(start).format("MM/DD/YYYY"), to = moment(end).format("MM/DD/YYYY");

        setDateFilter(prevState => ({
            ...prevState,
            from: from,
            to: to
        }))

        getVendorProductListing(status, range.low, range.high, searchTerm, from, to, sortOrder);
    }

    const getOrdersByPrice = async (range) => {
        let from = range[0];
        let to = range[1];
        setRange(prevState => ({
            ...prevState,
            low: from,
            high: to
        }))
        getVendorProductListing(status, from, to, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const getOrdersBySearchTerm = async (e) => {
        console.log(e.target.value)
        if (e.target.value.length >= 3) {
            setTimeout(() => {
                setSearchTerm(e.target.value)
            }, 3000)
        } else {
            setSearchTerm("")
        }
        getVendorProductListing(status, range.low, range.high, e.target.value, dateFilter.from, dateFilter.to, sortOrder)
    }

    const sortOrdersHandler = async (e) => {
        setSortOrder(e.target.value);
        getVendorProductListing(status, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, e.target.value)
    }

    const handleDelete = (prodId) => {
        setDeleteID(prodId)
        setDeletePop(true);
    }

    async function deleteProduct() {
        let payload = {
            "product": {
                "sku": deleteId,
                "status": 2,
                "custom_attributes": [{
                    "attribute_code": "udropship_vendor",
                    "value": vendorId
                }]
            },
            "saveOptions": true
        }
        //console.log(payload)
        let result: any = await removeProduct(payload)
        //console.log(deleteId);
        closePop();
    }
    const closePop = () => {
        setDeletePop(false);
    }
    const columns = [
        {
            name: <i className="fa fa-camera" aria-hidden="true"></i>,
            selector: row => row.img,
            cell: row => <img height="84px" width="56px" alt={row.image} src={row.image} />,
        },
        {
            name: 'Product',
            sortable: true,
            cell: row => (
                <div>
                    <p className='prodbrand'>{row.product.brand}</p>
                    <p className='prodname'>{row.product.name}</p>
                    <p className='prodId'><span>ID:</span>{row.product.id}</p>
                    <div className='data_value'><ul><li><Link to={'/product-details/' + row.product.sku} target="_blankl" >View</Link></li><li><Link to="#" onClick={() => { handleDelete(row.product.sku) }} >Delete</Link></li></ul></div>
                </div>
            ),
        },
        {
            name: 'Date',
            selector: row => row.date,
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => (
                <div>
                    {row.status === "1" ? intl.formatMessage({ id: "product.active" }) : ""}
                    {row.status === "2" ? intl.formatMessage({ id: "product.sold" }) : ""}
                    {row.status === "3" ? intl.formatMessage({ id: "product.pending" }) : ""}
                    {row.status === "4" ? intl.formatMessage({ id: "product.rejected" }) : ""}
                </div>


            ),
        },
        {
            name: 'Price',
            selector: row => row.price,
        }
    ];

    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="vendor.productListing" /></h1>
                            <p><IntlMessages id="products.description.1" /><br /><IntlMessages id="products.description.2" /></p>
                        </div>
                    </div>
                    <div className="range_slider">
                        <div className="range_inner">
                            <div className="row">
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="status" /></span>
                                        <select className="form-select" aria-label="Default select example" defaultValue={status} onChange={getOrdersByStatus}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "product.active" })}</option>
                                            <option value="2">{intl.formatMessage({ id: "product.pending" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "product.sold" })}</option>
                                            <option value="4">{intl.formatMessage({ id: "product.rejected" })}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-4">
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
                                                }
                                            }}
                                        >
                                            <input type="text" className="form-control" />
                                        </DateRangePicker>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-2">
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
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src={searchIcon} alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchorderid" })} className="form-control me-1" onChange={getOrdersBySearchTerm} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="float-right">
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

                <DataTable
                    columns={columns}
                    data={listingData}
                    pagination={true}
                />
            </section>
            <Modal show={deletePop}>
                <Modal.Body className="CLE_pf_details modal-confirm">

                    <div className="deletePopup">
                        <div className="modal-header flex-column">
                            <h4 className="modal-title w-100"><IntlMessages id="deletetheproduct" /></h4>
                            <Link to="#" onClick={closePop} className="close"> <i className="fas fa-times"></i></Link>
                        </div>
                        <div className="modal-body">
                            <p><IntlMessages id="deleteProduct.confirmation" /></p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" onClick={closePop} data-dismiss="modal"><IntlMessages id="productEdit.cancel" /></button>
                            <button type="button" className="btn btn-danger" onClick={deleteProduct} ><IntlMessages id="productEdit.delete" /></button>
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