import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { checkIfReturnExists, getReturnReasonList, searchOrders, updateOrderAddress } from '../../../redux/pages/customers';
import moment from 'moment';

import IntlMessages from "../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import { Link, useParams } from "react-router-dom";
import { capitalize, formatprice } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import ReturnFooter from './returnFooter';
import { useIntl } from 'react-intl';
import notification from '../../../components/notification';
import cartAction from "../../../redux/cart/productAction";
import LoaderGif from '../Loader';
const { saveReturnData } = cartAction;

function CreateReturn(props) {
    const intl = useIntl();
    let history = useHistory();
    const { returnId }: any = useParams();
    const [custId, setCustid] = useState(props.token.cust_id);
    const [maxItems, setMaxitems] = useState(10);
    const [total, setTotal] = useState(0);
    const [order, setOrder]: any = useState([]);
    const [loader, setLoader]: any = useState(false);
    const [issueList, setIssueList]: any = useState([]);
    const [changeAddressModal, setChangeAddressModal] = useState(false);
    const [returnOrExchange, setReturnOrExchange] = useState('');
    const [returnOrExchangeComment, setReturnOrExchangeComment] = useState('');
    const [reasonObjectSent, setReasonObjectSent] = useState([]);
    const [reasonObject, setReasonObject] = useState([]);
    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: custId,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        country_id: "",
        street: "",
        address_type: "",
        email: "",
        orderId: "",
        post_code: "",
        region: ""

    });

    const [errors, setError] = useState({
        errors: {}
    });

    useEffect(() => {
        getData(returnId);
        getReturnReasonListFxn();
        window.scrollTo(0, 0);
        return () => {
        }
    }, []);

    const getReturnReasonListFxn = async () => {// Get the list of return reasons and set in issueList
        let result: any = await getReturnReasonList()
        setIssueList(result.data);
    }

    const getData = async (returnId) => {//function to get the order details based on  return id. and set in orderDetails object, and also check if return exists based on the entity id of order.
        let orderDetails = [];
        let result: any = await searchOrders(returnId);
        orderDetails['entity_id'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.entity_id : 0;
        orderDetails['increment_id'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.increment_id : 0;
        orderDetails['created_at'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.created_at : 0;
        orderDetails['shipment_date'] = result?.data?.items?.[0] && result?.data?.items?.[0].extension_attributes && result?.data?.items?.[0]?.extension_attributes?.shipment_date ? result?.data?.items?.[0]?.extension_attributes?.shipment_date : 0;
        orderDetails['payment-method'] = result?.data?.items?.[0]?.payment?.additional_information?.[0];
        orderDetails['total_item_count'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.total_item_count : 0;
        orderDetails['delivery_address'] = result?.data?.items?.[0] && result?.data?.items?.[0]?.extension_attributes && result?.data?.items?.[0]?.extension_attributes?.shipping_assignments && result?.data?.items?.[0]?.extension_attributes?.shipping_assignments?.[0]?.shipping ? result?.data?.items?.[0].extension_attributes?.shipping_assignments?.[0]?.shipping.address : 0;
        orderDetails['base_subtotal'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_subtotal : 0;
        orderDetails['base_discount_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_discount_amount : 0;
        orderDetails['base_shipping_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_shipping_amount : 0;
        orderDetails['base_shipping_tax_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_shipping_tax_amount : 0;
        orderDetails['base_tax_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_tax_amount : 0;
        orderDetails['grand_total'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.grand_total : 0;
        let orderItems = result?.data?.items?.[0] ? result?.data?.items?.[0]?.items : {};

        let orderData = orderItems.filter(function (e) {
            return (e.qty_shipped >= 1 && e.qty_refunded === 0);
        });
        let checkreturn: any = await checkIfReturnExists(orderDetails['entity_id']);


        let myObject = checkreturn?.data?.[0];

        let resultShow = myObject.filter(val => {
            return val.value === 'false';
        });

        var onlyInReturn = orderData.filter(comparer(resultShow));


        orderDetails['items'] = onlyInReturn;
        setOrder(orderDetails);
    }
    function comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return parseInt(other.id) === current.item_id
            }).length === 0;
        }
    }
    const toggleAddressModal = () => {
        setChangeAddressModal(!changeAddressModal);
    }

    const handleAddChange = (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    // for customer address popup window starts here
    const saveCustAddress = async (e) => {// saving the customer address after validation of the same.
        if (validateAddress()) {
            custAddForm.customer_id = custId;
            custAddForm.address_type = 'shipping';
            custAddForm.email = props.token.token_email;
            custAddForm.orderId = order.entity_id;
            custAddForm.post_code = custAddForm.postcode;

            let result: any = await updateOrderAddress(custAddForm);
            if (result?.data === 'address updated') {
                getData(returnId);
                setChangeAddressModal(!changeAddressModal);
                notification("success", "", "Address updates");
            } else {
                setChangeAddressModal(!changeAddressModal);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
        }
    }

    const validateAddress = () => {// validating the address field
        let error = {};
        let formIsValid = true;
        if (typeof custAddForm.telephone !== "undefined") {
            if (!(/^((?:[+?0?0?966]+)(?:\s?\d{2})(?:\s?\d{7}))$/.test(custAddForm.telephone))) {
                formIsValid = false;
                error["telephone"] = intl.formatMessage({ id: "phoneinvalid" });
            }
        }
        if (!custAddForm.telephone) {
            formIsValid = false;
            error['telephone'] = 'Phone is required';
        }
        if (!custAddForm.postcode) {
            formIsValid = false;
            error["postcode"] = 'Post Code is required';
        }
        if (!custAddForm.city) {
            formIsValid = false;
            error["city"] = 'City is required';
        }

        if (!custAddForm.country_id) {
            formIsValid = false;
            error['country_id'] = 'Country is required';
        }
        if (!custAddForm.street) {
            formIsValid = false;
            error["street"] = 'Address is required';
        }
        if (!custAddForm.firstname) {
            formIsValid = false;
            error["firstname"] = 'First Name is required';
        }
        if (!custAddForm.lastname) {
            formIsValid = false;
            error["lastname"] = 'Last Name is required';
        }

        setError({ errors: error });
        return formIsValid;
    }


    const sortHandler = (sortOrder) => {// sorting the orders
        order.items.sort(compareValues(sortOrder))
        setOrder(order);
    }

    const compareValues = (order) => {
        return function innerSort(a, b) {

            const varA = a.price;
            const varB = b.price;

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 0) ? (comparison * -1) : comparison
            );
        };
    }


    const selectReason = (event) => {
        let reasonData = event.target.options[event.target.selectedIndex].text;
        let attribute_code = event.target.getAttribute("data-attribute");
        let price = event.target.getAttribute("data-price");
        let item = order?.items;
        const filteredResult = item.find((e) => e.item_id === parseInt(attribute_code));
        filteredResult.reason = event.target.value;
        filteredResult.reasonData = reasonData
        let amount = total + parseInt(price);
        setTotal(amount)
        setReasonObjectSent(prevState => ({
            ...prevState,
            [attribute_code]: event.target.value
        }))
        setReasonObject(prevState => [...prevState, filteredResult]);

    }
    const handleChange = (e) => {
        setReturnOrExchangeComment(e.target.value);
    }

    const selectReturnOrExchange = (event) => {
        setReturnOrExchange(event.target.value)
    }
    const handleSubmitClick = async (e) => {
        setLoader(true)

        if (reasonObject.length === 0) {
            setLoader(false)
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchangeProducts" }));
            return false;
        }
        if (returnOrExchange === "" || returnOrExchange === null) {
            setLoader(false)
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchange" }));
            return false;
        }



        let returnInfoData = {
            orderId: order['entity_id'],
            rma_reason: returnOrExchange,
            comment_text: returnOrExchangeComment,
            items: reasonObject,
            total: total,
            dataSent : reasonObjectSent
        }
        props.saveReturnData(returnInfoData);
        let url = `/customer/return-summary/` + returnId;
        history.push(url);


    }

    const handleCountryChange = async (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }));
    }


    return (
        <section className="order-detail-main">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="order-detail-head">
                            <h2><IntlMessages id="myaccount.returnDetails" /></h2>
                            <p><IntlMessages id="customer.return.description" /></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="order-number">
                            <h4><IntlMessages id="order.orderNo" />: {order.increment_id}</h4>
                            <div className="row">
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.purchaseDate" /></strong></p>
                                    <p>{moment(order['created_at']).format('ddd, D MMMM YYYY')}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="shipment.date" /></strong></p>
                                    <p>{(order['shipment_date'] !== "N/A") ? moment(order['shipment_date']).format('ddd, D MMMM YYYY') : ""}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.paymentMethod" /></strong></p>
                                    <p>{order['payment-method'] ? capitalize(order['payment-method']) : "-"}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.products" /></strong></p>
                                    <p>{order['items']?.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-12 return-complaint-btns">
                        <div className="float-start">
                            <p><IntlMessages id="create.return.details1" /><br /><IntlMessages id="create.return.details2" /></p>
                        </div>
                        <div className="float-end">
                            <div className="btn-group">
                                <button type="button" className="btn btn-link dropdown-toggle" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <IntlMessages id="magazine.sortby" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><button className="dropdown-item" type="button" onClick={() => sortHandler(0)}><IntlMessages id="filterPriceDesc" /></button></li>
                                    <li><button className="dropdown-item" type="button" onClick={() => sortHandler(1)}><IntlMessages id="filterPriceAsc" /></button></li>
                                </ul>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <ul className="order-pro-list">
                    {order && order.items && order.items.slice(0, maxItems).map((item, i) => {
                        return (
                            <div key={i}>
                                <li>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="product-image">
                                                <img alt="{item.name}" src={item.extension_attributes.item_image} />
                                            </div>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="pro-name-tag mb-5">
                                                <div className="float-start">
                                                    {item.extension_attributes.barnd && (<div className="product_name"><Link to={'/search/' + item.extension_attributes.barnd + '/all'}>{item.extension_attributes.barnd}</Link></div>)}
                                                    <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                    <p>{capitalize(item.product_type)}</p>
                                                </div>
                                                <div className="float-end text-end order-pro-price text-decoration-none">{siteConfig.currency}{formatprice(item.price)}</div>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="pro-name-tag">
                                                <p><strong><IntlMessages id="order.productNo" /></strong> {item.sku}</p>
                                                <div className="clearfix"></div>

                                            </div>

                                        </div>
                                    </div>
                                </li>

                                <select className="form-select customfliter" aria-label="Default select example" data-attribute={item.item_id} data-price={item.price} onChange={selectReason} >
                                    <option value="">{intl.formatMessage({ id: "returnreason" })}</option>
                                    {issueList && issueList[0] && Object.keys(issueList[0]).map((item, i) => (
                                        <option key={i} value={item}>{issueList[0][item]}</option>
                                    ))}
                                </select>
                            </div>
                        );
                    })}
                </ul>
            </div>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="order-delivery-address">
                            <div className="Address-title">
                                <span className="float-start"><IntlMessages id="order.deliveryAddress" /></span>
                                <Link to="#" onClick={toggleAddressModal} className="float-end change-ani"><IntlMessages id="order.change" /></Link>
                                <div className="clearfix"></div>
                            </div>
                            <p>
                                {order['delivery_address']?.firstname + ' ' + order['delivery_address']?.lastname}<br />
                                {order['delivery_address']?.street}<br />
                                {order['delivery_address']?.postcode}<br />
                                {order['delivery_address']?.city}<br />
                                {order['delivery_address'] && order['delivery_address'].country_id ? "Saudi Arabia" : ""}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="order-delivery-address">
                            <div className="Address-title">
                                <span><IntlMessages id="return.total" /></span>
                            </div>
                            <div className="product-total-price">
                                <p><IntlMessages id="order.subTotal" /><span className="text-end">{siteConfig.currency}{formatprice(order.base_subtotal)}</span></p>
                                <p><IntlMessages id="order.shipping" /><span className="text-end">{siteConfig.currency}{formatprice(order.base_shipping_amount)}</span></p>
                                <p><IntlMessages id="order.tax" /><span className="text-end">{siteConfig.currency}{formatprice(order.base_tax_amount)}</span></p>
                                <hr />
                                <div className="final-price"><IntlMessages id="order.total" /><span>{siteConfig.currency}{formatprice(order.grand_total)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-12">

                        <div className="row my-3">
                            <div className="col-md-3 mb-2">
                                <div className='return-reason' >
                                    <select className="form-select customfliter" aria-label="Default select example" onChange={selectReturnOrExchange} >
                                        <option value="">{intl.formatMessage({ id: "select" })}</option>
                                        <option value="refund">{intl.formatMessage({ id: "return" })}</option>
                                        <option value="exchange">{intl.formatMessage({ id: "exchange" })}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3 align-self-end mb-2">
                                <label className="form-label"></label>

                                {/* {loader ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> : */}
                                {loader ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <LoaderGif /></Link> :
                                    <Link to="#" className="btn btn-primary" onClick={handleSubmitClick} ><IntlMessages id="order.returnProducts" /></Link>
                                }
                            </div>
                            <div className="col-md-12 mb-2">
                                <label><IntlMessages id="comments" /></label>
                                <textarea className="form-select customfliter" onChange={handleChange} rows={3} value={returnOrExchangeComment}>
                                </textarea>
                            </div>
                        </div>



                    </div>
                </div>
                <ReturnFooter />
            </div>

            {/* change delivery address modal */}
            <Modal show={changeAddressModal}>
                <div className="CLE_pf_details">
                    <Modal.Header>
                        <h1><IntlMessages id="myaccount.myDetails" /></h1>
                        <Link to="#" className="cross_icn" onClick={toggleAddressModal}> <i className="fas fa-times"></i> </Link>
                    </Modal.Header>

                    <Modal.Body className="arabic-rtl-direction">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">First name<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Ann"
                                id="firstname"
                                value={custAddForm.firstname}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["firstname"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Surname<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="lastname"
                                placeholder="Surname"
                                value={custAddForm.lastname}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["lastname"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Phone<span className="maindatory">*</span></label>
                            <input type="number" className="form-control" id="telephone"
                                placeholder="Phone"
                                value={custAddForm.telephone}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["telephone"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Address<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="street"
                                placeholder="Address"
                                value={custAddForm.street}
                                maxLength={50}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["address"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">City*</label>
                            <input type="text" className="form-control" id="city"
                                placeholder="City"
                                value={custAddForm.city}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["city"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Post Code*</label>
                            <input type="text" className="form-control" id="postcode"
                                placeholder="Post Code"
                                value={custAddForm.postcode}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["postcode"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.country" /><span className="maindatory">*</span></label>
                            <select value={custAddForm.country_id} onChange={handleCountryChange} id="country_id" className="form-select">
                                <option key="0" value="">{intl.formatMessage({ id: 'select' })}</option>
                                <option key="1" value="SA">{intl.formatMessage({ id: 'saudi' })}</option>
                            </select>
                            <span className="error">{errors.errors["country_id"]}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="width-100 mb-3 form-field">
                        <div className="Frgt_paswd">
                            <div className="confirm-btn">
                                <button type="button" className="btn btn-secondary" onClick={saveCustAddress}><IntlMessages id="myaccount.confirm" /></button>
                            </div>
                        </div>
                    </Modal.Footer>
                </div>
            </Modal>

        </section >
    );
}

function mapStateToProps(state) {
    return {
        state: state,
        token: state.session.user
    };
};
export default connect(
    mapStateToProps,
    { saveReturnData }
)(CreateReturn);