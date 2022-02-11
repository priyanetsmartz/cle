import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { searchOrders, getCountriesList } from '../../../redux/pages/customers';
import moment from 'moment';
import IntlMessages from "../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { capitalize, formatprice } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';

function OrderDetails(props) {
    const [custId, setCustid] = useState(props.token.cust_id);
    const [countries, setCountries] = useState([]); // for countries dropdown
    const [orderId, setOrderId] = useState(props.match.params.orderId);
    const [maxItems, setMaxitems] = useState(10);
    const [orderProgress, setOrderProgress] = useState(0);
    const [order, setOrder]: any = useState([]);
    const [changeAddressModal, setChangeAddressModal] = useState(false);
    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: custId,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        country_id: "",
        street: ""
    });

    const [errors, setError] = useState({
        errors: {}
    });

    useEffect(() => {
        setOrderId(props.match.params.orderId)
        getData();
        getCountries();
    }, []);

    const getData = async () => {
        let orderDetails = [];
        let result: any = await searchOrders(orderId);
        orderDetails['increment_id'] = result.data.items[0] ? result.data.items[0].increment_id : 0;
        orderDetails['created_at'] = result.data.items[0] ? result.data.items[0].created_at : 0;
        orderDetails['shipment_date'] = result.data.items[0] && result.data.items[0].extension_attributes && result.data.items[0].extension_attributes.shipment_date ? result.data.items[0].extension_attributes.shipment_date : 0;
        orderDetails['payment-method'] = result.data.items[0] && result.data.items[0].payment.method ? capitalize(result.data.items[0].payment.method.split('_')[0]) : "-";
        orderDetails['total_item_count'] = result.data.items[0] ? result.data.items[0].total_item_count : 0;
        orderDetails['delivery_address'] = result.data.items[0] && result.data.items[0].extension_attributes && result.data.items[0].extension_attributes.shipping_assignments && result.data.items[0].extension_attributes.shipping_assignments[0].shipping ? result.data.items[0].extension_attributes.shipping_assignments[0].shipping.address : 0;
        orderDetails['base_subtotal'] = result.data.items[0] ? result.data.items[0].base_subtotal : 0;
        orderDetails['base_discount_amount'] = result.data.items[0] ? result.data.items[0].base_discount_amount : 0;
        orderDetails['base_shipping_amount'] = result.data.items[0] ? result.data.items[0].base_shipping_amount : 0;
        orderDetails['base_shipping_tax_amount'] = result.data.items[0] ? result.data.items[0].base_shipping_tax_amount : 0;
        orderDetails['base_tax_amount'] = result.data.items[0] ? result.data.items[0].base_tax_amount : 0;
        orderDetails['grand_total'] = result.data.items[0] ? result.data.items[0].grand_total : 0;
        orderDetails['items'] = result.data.items[0] ? result.data.items[0].items : {};


        setOrder(orderDetails);
        // console.log(result.data.items[0].extension_attributes.shipping_assignments[0].shipping.address)
        //change this after clarification
        const p = result.data && result.data.items && result.data.items > 0 && result.data.items.status === 'processing' ? 10 : result.data && result.data.items && result.data.items > 0 && result.data.items.status === 'complete' ? 100 : result.data && result.data.items && result.data.items > 0 && result.data.items.status == 'pending' ? 25 : 10;
        setOrderProgress(p)
    }

    const getCountries = async () => {
        let result: any = await getCountriesList();
        setCountries(result.data);
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
    const saveCustAddress = async (e) => {
        if (validateAddress()) {

        }
    }

    const validateAddress = () => {
        let error = {};
        let formIsValid = true;

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

    const showMore = () => {
        setMaxitems(1000);
    }

    const sortHandler = (sortOrder) => {
        order.items.sort(compareValues(sortOrder))
        setOrder(order);
        // console.log(order.items);
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
                (order == 0) ? (comparison * -1) : comparison
            );
        };
    }

    return (
        <section className="order-detail-main">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="order-detail-head">
                            <h2><IntlMessages id="order.orderDetails" /></h2>
                            <p><IntlMessages id="order.thanksForOrder" /></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="delivery-bar">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="order-detail-head">
                                {/* change this after clarification */}
                                <p><strong>
                                    {order.status == 'complete' ? <IntlMessages id="order.itsDelivered" /> : order.status == 'pending' ?
                                        <IntlMessages id="order.itsPending" /> : order.status == 'processing' ? <IntlMessages id="order.itsProcessing" />
                                            : order.status}
                                </strong></p>
                                {order.status == 'complete' && <p><IntlMessages id="order.delivered" /> {order.shipping_amount}</p>}
                                <div className="progress-bar-area">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                            aria-valuenow={orderProgress} aria-valuemin={0} aria-valuemax={100} style={{ width: `${orderProgress}%` }}></div>
                                    </div>
                                </div>
                                <p>
                                    {order.status == 'complete' ? <IntlMessages id="order.yourParcelDelivered" /> : order.status == 'pending' ?
                                        <IntlMessages id="order.yourParcelPending" /> : order.status == 'processing' ? <IntlMessages id="order.yourParcelProcessing" />
                                            : order.status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="order-number">
                            <h4><IntlMessages id="order.orderNo" />: {order.sku}</h4>
                            <div className="row">
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.purchaseDate" /></strong></p>
                                    <p>{moment(order['created_at']).format('ddd, D MMMM YYYY')}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.shippingDate" /></strong></p>
                                    {/* <p>{order['shipment_date'] ? moment(order['shipment_date']).format('ddd, D MMMM YYYY'): ''}</p> */}
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.paymentMethod" /></strong></p>
                                    <p>{order['payment-method'] ? capitalize(order['payment-method'].split('_')[0]) : "-"}</p>
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
                    <div className="col-md-6">
                        <div className="order-delivery-address">
                            <div className="Address-title">
                                <span className="float-start"><IntlMessages id="order.deliveryAddress" /></span>
                                <Link to="#" onClick={toggleAddressModal} className="float-end"><IntlMessages id="order.change" /></Link>
                                <div className="clearfix"></div>
                            </div>
                            <p>
                                {order['delivery_address']?.firstname + ' ' + order['delivery_address']?.lastname}<br />
                                {order['delivery_address']?.street}<br />
                                {order['delivery_address']?.postcode}<br />
                                {order['delivery_address']?.city}<br />
                                {order['delivery_address']?.country_id}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="order-delivery-address">
                            <div className="Address-title">
                                <span><IntlMessages id="order.orderTotal" /></span>
                            </div>
                            <div className="product-total-price">
                                <p><IntlMessages id="order.subTotal" /><span className="text-end">{siteConfig.currency}{formatprice(order.base_subtotal)}</span></p>
                                <p><IntlMessages id="order.shipping" /><span className="text-end">{siteConfig.currency}{formatprice(order.base_shipping_amount)}</span></p>
                                <p><IntlMessages id="order.tax" /><span className="text-end">{siteConfig.currency}{formatprice(order.shipping_amount)}</span></p>
                                <hr />
                                <div className="final-price"><IntlMessages id="order.total" /><span>{siteConfig.currency}{formatprice(order.grand_total)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-12 return-complaint-btns">
                        {/* <div className="float-start">
                            <Link to=""><IntlMessages id="order.returnProducts" /></Link>
                            <Link to=""><IntlMessages id="order.makeAComplaint" /></Link>
                        </div> */}
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
                            <li key={i}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="product-image">
                                            <img alt="{item.name}" src={item.extension_attributes.item_image} />
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="pro-name-tag mb-5">
                                        <div className="float-start">
                                                {item.extension_attributes.barnd && ( <div className="product_name"><Link to={'/search/' + item.extension_attributes.barnd}>{item.extension_attributes.barnd}</Link></div>)}
                                                <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                <p>{capitalize(item.product_type)}</p>
                                            </div>
                                            {/* <div className="float-start">
                                                {item.extension_attributes.barnd && (
                                                    <b> <Link to={'/search/' + item.extension_attributes.barnd}><strong>{item.extension_attributes.barnd}</strong></Link></b>)}
                                                <p> <Link to={'/product-details/' + item.sku}><strong>{item.name}</strong></Link></p>
                                                <p>{capitalize(item.product_type)}</p>
                                            </div> */}
                                            <Link to="#" className="float-end text-end order-pro-price">{siteConfig.currency}{formatprice(item.price)}</Link>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="pro-name-tag">
                                            {/* <p>One Size</p> */}
                                            {/* will add this in alpha */}
                                            <p><strong><IntlMessages id="order.productNo" /></strong> {item.product_id}</p>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}


                </ul>
                {order && order.items && order.items.length > 10 && <div className="show-more-btn">
                    <Link to="#" onClick={showMore} className="btn btn-secondary">
                        <IntlMessages id="order.showMore" />
                    </Link>
                </div>}
            </div>

            {/* change delivery address modalc */}
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
                            <input type="text" className="form-control" id="telephone"
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
                            <label className="form-label">Country<span className="maindatory">*</span></label>
                            <select value={custAddForm.country_id} onChange={handleAddChange} id="country_id" className="form-select">
                                {countries && countries.map(opt => {
                                    return (<option key={opt.id} value={opt.id}>{opt.full_name_english}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country"]}</span>
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
    mapStateToProps
)(OrderDetails);