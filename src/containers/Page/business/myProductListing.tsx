import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import { getVendorProducts } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { siteConfig } from '../../../settings/index'
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { Slider } from 'antd';
import './deletepop.css';

function MyProductListing(props) {
    let brand = '';
    const [listingData, setListingData] = useState([])
    const [deleteId, setDeleteID] = useState(0)
    const [deletePop, setDeletePop] = useState(false);
    const intl = useIntl();
    useEffect(() => {
        getData()
    }, [props.languages])

    async function getData() {
        let result: any = await getVendorProducts(props.languages);
        let dataObj = result.data.items;
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

    }
    const handleDelete = (prodId) => {
        setDeleteID(prodId)
        setDeletePop(true);
    }

    const columns = [
        {
            name: 'Image',
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
                    <div className='data_value'><ul><li><Link to={'/product-details/' + row.product.sku} target="_blankl" >View</Link></li><li><Link onClick={() => { handleDelete(row.product.id) }} >Delete</Link></li></ul></div>
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
                    <option value="1">Active</option>
                    <option value="2">Pending</option>
                    <option value="3">Sold</option>
                    <option value="4">Archieved</option>
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

    const deleteProduct = () => {
        console.log(deleteId);
    }
    const closePop = () => {
        setDeletePop(false);
    }
    const getOrdersByDate = async (e) => {
    }

    const handlePriceRange = async (range) => {
    }

    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>My Product Listing</h1>
                            <p>You can manage your products here.<br />Below is the list of sold products.</p>
                        </div>
                    </div>
                    <div className="range_slider">
                        <div className="range_inner">
                            <div className="row">
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label">Status</span>
                                        <select className="form-select" aria-label="Default select example" onChange={getOrdersByDate}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
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
                                        <Slider range max={20000} defaultValue={[0, 5]} onAfterChange={handlePriceRange} />
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src="images/Icon_zoom_in.svg" alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchorderid" })} className="form-control me-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 mb-4">
                                    <div className="form-group">
                                        <span className="form-label">Change Status:</span>
                                        <select className="form-select" aria-label="Default select example" onChange={getOrdersByDate}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-grid col-sm-4 mb-4">
                                        <button type="button" className="btn btn-secondary" >
                                            <IntlMessages id="myaccount.edit" />
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={listingData}
                    selectableRows
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
                            <h4 className="modal-title w-100">Delete the Product</h4>
                            <Link to="#" onClick={closePop} className="close"> <i className="fas fa-times"></i></Link>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the product from the listing?</p> 
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" onClick={closePop} data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={deleteProduct} >Delete</button>
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