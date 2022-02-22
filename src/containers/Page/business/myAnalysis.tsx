import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { removeProduct, searchProducts } from '../../../redux/pages/vendorLogin';
import Modal from "react-bootstrap/Modal";
import './myanalysis.css';
import { Link } from "react-router-dom";
import { siteConfig } from '../../../settings';
import { useIntl } from 'react-intl';
import MyAnalysisDataTiles from './myAnalysis/DataTiles';
import MyAnalysisOrders from './myAnalysis/OrderAnalysis';
import MyAnalysisPayouts from './myAnalysis/PayoutsAnalysis';
import MyAnalysisProducts from './myAnalysis/ProductAnalysis';
import MyAnalysisReturn from './myAnalysis/ReturnAnalysis';
import MyAnalysisCustomer from './myAnalysis/CustomerAnalysis';
function MyAnalysis(props) {
    const intl = useIntl()
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    let venID = localToken && localToken?.vendor_id ? localToken?.vendor_id : 0;

    const [isLoading, setIsLoading] = useState(true);
    const [listingData, setListingData] = useState([])
    const [pending, setPending] = useState(true);
    const [vendorId, setVendorId] = useState(venID);
    const [deletePop, setDeletePop] = useState(false);
    const [deleteId, setDeleteID] = useState(0)
    useEffect(() => {
        getVendorProductListing()

        return () => {
        }
    }, [])
    async function getVendorProductListing(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {
        setIsLoading(true);
        let result: any = await searchProducts(props.languages, siteConfig.pageSize, status, from, to, term, dateFrom, dateTo, sortorder);

        let dataObj = result && result.data && result.data.length > 0 ? result.data : [];
        let data = dataObj.slice(0, 5);
        const renObjData = data.map(function (data, idx) {

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
        setPending(false)

    }
    async function deleteProduct() {
        let payload = {
            "sku": deleteId,
            "status": 2,
            "vendorId": vendorId,
            "storeId": props.languages === 'english' ? '3' : '2'
        }
        await removeProduct(payload)
        getVendorProductListing();
        closePop();
    }
    const closePop = () => {
        setDeletePop(false);
    }



    const paginationComponentOptions = {
        noRowsPerPage: true,
    };
    const handleDelete = (prodId) => {
        setDeleteID(prodId)
        setDeletePop(true);
    }
    const columns = [
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




    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>My Analysis</h1>
                            <p>You can see your analysis here. Lorem ipsum dolor sit amet<br />
                                consectetur adipiscing elit.</p>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-sm-12">
                            <ul className="analysis-demo">
                                <li>
                                    <input type="radio" id="radioApple1" name="radioFruit1" value="apple1" className="active" />
                                    <label>Demographics</label>
                                </li>
                                <li>
                                    <input type="radio" id="radioApple2" name="radioFruit2" value="apple2" />
                                    <label>Sales</label>
                                </li>
                                <li>
                                    <input type="radio" id="radioApple3" name="radioFruit3" value="apple3" />
                                    <label> Statics</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div >
            </section>
            <MyAnalysisDataTiles />
            <MyAnalysisCustomer />
            <MyAnalysisOrders />
            <MyAnalysisPayouts />
            <MyAnalysisProducts />
            <MyAnalysisReturn />


            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="product-listing">
                                <DataTable
                                    title="Product Listing"
                                    progressPending={isLoading}
                                    columns={columns}
                                    data={listingData}
                                    pagination={true}
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
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
                                <button type="button" className="btn btn-secondary" onClick={deleteProduct} ><IntlMessages id="productEdit.delete" /></button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </section>
        </div >
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
)(MyAnalysis);