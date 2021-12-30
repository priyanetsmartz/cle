import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import { getVendorProducts, searchProductListing, removeProduct, vendorLogout, searchProducts } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { siteConfig } from '../../../settings/index'
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import searchIcon from '../../../image/Icon_zoom_in.svg';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { Slider } from 'antd';
import './deletepop.css';
import { getCookie } from '../../../helpers/session';
import { useLocation } from 'react-router-dom'; 

function MyProductListing(props) {
    let brand = '';
    const language = getCookie('currentLanguage');
    const [searchTerm, setSearchTerm] = useState('');
    const [listingData, setListingData] = useState([])
    const [deleteId, setDeleteID] = useState(0)
    const [sortOrder, setSortOrder] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [range, setRange] = useState([0, 200])
    const [status, setStatus] = useState(0)
    const [deletePop, setDeletePop] = useState(false);
    const [sortValue, setSortValue] = useState({ sortBy: "created_at", sortByValue: "DESC" });
    const intl = useIntl();
    const [allData, setAllData] = useState([]);
    const [vendorId, setVendorId] = useState(1);
    useEffect(() => {
        getData()
    }, [props.languages, sortValue])

    async function getData(status = '', from = '', to = '', type = '') {
        console.log('gere')
        let userData = JSON.parse((localStorage.getItem('redux-react-session/USER_DATA')))
        console.log(localStorage.getItem('redux-react-session/USER_DATA'))
        console.log(userData,typeof(userData), userData['vendor_id'])
        setVendorId(userData['vendor_id'])
        let result: any = await getVendorProducts(props.languages, status, from, to, type, sortValue);
        let dataObj = result && result.data && result.data.items && result.data.items.length > 0 ? result.data.items : [];
        let imageD = '';
        const renObjData = dataObj.map(function (data, idx) {
            data.custom_attributes && data.custom_attributes.length > 0 && data.custom_attributes.map((attributes) => {
                if (attributes.attribute_code === 'image') {
                    imageD = attributes.value;
                }
            })
            let productLoop: any = {};

            productLoop.id = data.id;
            productLoop.image = imageD;
            productLoop.product = data;
            productLoop.date = moment(data.created_at).format('DD MMMM YYYY');
            productLoop.status = data.status;
            productLoop.price = siteConfig.currency + data.price;
            return productLoop;
        });
        setListingData(renObjData)
        setAllData(renObjData)

    }
    const handleDelete = (prodId) => {
        setDeleteID(prodId)
        setDeletePop(true);
    }

    const columns = [
        {
            name: <i className="fa fa-camera" aria-hidden="true"></i>,
            selector: row => row.image,
            cell: row => <img height="84px" width="56px" alt={row.image} src={row.image} />,
        },
        {
            name: 'Product',
            sortable: true,
            cell: row => (
                <div>
                    {row.product.custom_attributes && row.product.custom_attributes.length > 0 && row.product.custom_attributes.map((attributes) => {
                        if (attributes.attribute_code === 'brand') {
                            brand = attributes.value;
                        }
                    })}
                    <p className='prodbrand'>{brand}</p>
                    <p className='prodname'>{row.product.name}</p>
                    <p className='prodId'><span>ID:</span>{row.product.id}</p>
                    <div className='data_value'><ul><li><Link to={'/product-details/' + row.product.sku} target="_blankl" >View</Link></li><li><Link onClick={() => { handleDelete(row.product.sku) }} >Delete</Link></li></ul></div>
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
                <select defaultValue={row.status}>
                    <option value="1">{intl.formatMessage({ id: "product.active" })}</option>
                    <option value="2">{intl.formatMessage({ id: "product.sold" })}</option>
                    <option value="3">{intl.formatMessage({ id: "product.pending" })}</option>
                    <option value="4">{intl.formatMessage({ id: "product.rejected" })}</option>
                </select>

            ),
        },
        {
            name: 'Price',
            selector: row => row.price,
        }
    ];

    const handleChange = ({ selectedRows }) => {
        console.log('Selected Rows: ', selectedRows);
    };

    async function deleteProduct() {
      let  payload = {
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
        let result : any = await removeProduct(payload)
        //console.log(deleteId);
        closePop();
    }
    const closePop = () => {
        setDeletePop(false);
    }
    const getProductbyStatus = async (e) => {
        const { value } = e.target;
        await setStatus(e.target.value)
        let term = searchTerm?searchTerm:null;
        let frDate = orderDate?orderDate:null;
        let toDate = orderDate?orderDate:null;
        let fromPrice = range[0]?range[0]:null;
        let toPrice = range[1]?range[1]:null;
        let stat = status?status:null;
        let result:any = await searchProducts(language, term, frDate, toDate, fromPrice, toPrice, e.target.value);
        console.log(result);
        let dataObj = result && result.data && result.data.length > 0 ? result.data : []
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
        setListingData(renObjData);
    }


    const getOrdersByDate = async (e) => {
        const { value } = e.target;
        let filter = parseInt(value);
        let fromDate;
        let currentDate = moment(new Date());
        if (filter === 1 || filter === 3 || filter === 6) {
            fromDate = moment(currentDate).subtract(filter, 'M').toJSON();
        } else {
            fromDate = moment(`${filter}-01-01`).toJSON();
        }
        //console.log(fromDate)
        setOrderDate(fromDate);
        const dateFrom = moment(fromDate).format("YYYY-MM-DD");
        const dateTo = moment(currentDate.toJSON()).format("YYYY-MM-DD")

        getData('', dateFrom, dateTo, 'created_at');
    }

    const handlePriceRange = async (range) => {
        let from = range[0];
        let to = range[1];
        setRange([from, to])
        getData('', from, to, 'price');
    }

    const sortOrdersHandler = async (e) => {
        setSortOrder(e.target.value);
        let sortBy = "created_at";
        let sortByValue = "DESC";
        if (e.target.value === "desc") {
            sortBy = "price";
            sortByValue = "DESC";
        } else if (e.target.value === "asc") {
            sortBy = "price";
            sortByValue = "ASC";
        }
        console.log(sortBy, sortByValue);
        setSortValue({ sortBy: sortBy, sortByValue: sortByValue })
    }

    const updateInput = async (e) => {
        let lang = props.languages ? props.languages : language;
        if (e.target.value.length >= 3) {
            setSearchTerm(e.target.value)
            let result: any = await searchProductListing(lang, e.target.value);
            console.log("lets see response come from api", result)
            
            let dataObj = result && result.data && result.data.length > 0 ? result.data : [];
            let imageD = '';
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
        setListingData(renObjData);
        }
        else{
            setListingData(allData);
        }
    }

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
                                        <select className="form-select" aria-label="Default select example" defaultValue={status} onChange={getProductbyStatus}>
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
                                        <select className="form-select" aria-label="Default select example" onChange={getOrdersByDate}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-2">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.price" /></span>
                                        <Slider range max={20000} defaultValue={[0, 200]} onAfterChange={handlePriceRange} />
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src={searchIcon}  alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchorderid" })} onChange={updateInput} onKeyDown={useLocation.hash} className="form-control me-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-5 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="changeStatus" />:</span>
                                        <select className="form-select" aria-label="Default select example" onChange={getOrdersByDate}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "product.activateproduct" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "product.archieveproduct" })}</option>
                                            <option value="2">{intl.formatMessage({ id: "product.removeproduct" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "product.soldproduct" })}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-grid col-sm-4 mb-4">
                                    <button type="button" className="btn btn-secondary" >
                                        <IntlMessages id="myaccount.confirm" />
                                    </button>
                                </div>
                                <div className="d-grid col-sm-3 mb-4">
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
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={listingData}                    
                    pagination={true}
                    onSelectedRowsChange={handleChange}
                />
            </section>
            <Modal show={deletePop}>
                <Modal.Body className="CLE_pf_details modal-confirm">

                    <div className="deletePopup">
                        <div className="modal-header flex-column">
                            <div className="icon-box">
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </div>
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
        languages: languages

    };
}

export default connect(
    mapStateToProps
)(MyProductListing);