import  { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { searchOrders, getCountriesList, getorderReturnstatusapi, updateOrderAddress, checkIfReturnExists, getRegionsByCountryID } from '../../../redux/pages/customers';
import moment from 'moment';
import IntlMessages from "../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { capitalize, formatprice, getCountryName, getRegionName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import notification from '../../../components/notification';
import { useIntl } from 'react-intl';
import { COUNTRIES } from '../../../config/counties';

function OrderDetails(props) {
    const intl = useIntl();
    const [custId, setCustid] = useState(props.token.cust_id);
    const [countries, setCountries] = useState([]); // for countries dropdown
    const [orderId, setOrderId] = useState(props.match.params.orderId);
    const [maxItems, setMaxitems] = useState(10);
    const [orderProgress, setOrderProgress] = useState(0);
    const [order, setOrder]: any = useState([]);
    const [regions, setRegions] = useState([]);
    const [showReturn, setShowReturn] = useState(false);
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
        orderDetails['payment-method'] = result.data.items[0] && result.data.items[0].payment.additional_information[0] ? capitalize(result.data.items[0].payment.additional_information[0]) : "-";
        orderDetails['total_item_count'] = result.data.items[0] ? result.data.items[0].total_item_count : 0;
        orderDetails['delivery_address'] = result.data.items[0] && result.data.items[0].extension_attributes && result.data.items[0].extension_attributes.shipping_assignments && result.data.items[0].extension_attributes.shipping_assignments[0].shipping ? result.data.items[0].extension_attributes.shipping_assignments[0].shipping.address : 0;
        orderDetails['base_subtotal'] = result.data.items[0] ? result.data.items[0].base_subtotal : 0;
        orderDetails['base_discount_amount'] = result.data.items[0] ? result.data.items[0].base_discount_amount : 0;
        orderDetails['base_shipping_amount'] = result.data.items[0] ? result.data.items[0].base_shipping_amount : 0;
        orderDetails['base_shipping_tax_amount'] = result.data.items[0] ? result.data.items[0].base_shipping_tax_amount : 0;
        orderDetails['base_tax_amount'] = result.data.items[0] ? result.data.items[0].base_tax_amount : 0;
        orderDetails['grand_total'] = result.data.items[0] ? result.data.items[0].grand_total : 0;
        orderDetails['items'] = result.data.items[0] ? result.data.items[0].items : {};
        orderDetails['entity_id'] = result.data.items[0] ? result.data.items[0].entity_id : 0;
        orderDetails['returnStatus'] = getorderReturnstatus(orderDetails['entity_id'])
        setOrder(orderDetails);

        let checkreturn: any = await checkIfReturnExists(orderDetails['entity_id']);



        let myObject = checkreturn?.data?.[0];

        let resultShow = myObject.filter(val => {
            return val.value === 'true';
        });
        if (resultShow.length > 0) {
            setShowReturn(true);
        }

        const p = result.data && result.data.items && result.data.items > 0 && result.data.items.status === 'processing' ? 10 : result.data && result.data.items && result.data.items > 0 && result.data.items.status === 'complete' ? 100 : result.data && result.data.items && result.data.items > 0 && result.data.items.status === 'pending' ? 25 : 10;
        setOrderProgress(p)
    }

    const getorderReturnstatus = async (id) => {
        let result: any = await getorderReturnstatusapi(id);
        return result.data;

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
            custAddForm.customer_id = custId;
            custAddForm.address_type = 'shipping';
            custAddForm.email = props.token.token_email;
            custAddForm.orderId = order.entity_id;
            custAddForm.post_code = custAddForm.postcode;
            let result: any = await updateOrderAddress(custAddForm);
            if (result.data === 'address updated') {
                getData();
                setChangeAddressModal(!changeAddressModal);
                notification("success", "", "Address updates");
            } else {
                setChangeAddressModal(!changeAddressModal);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
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
    const handleCountryChange = async (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }));
        getRegions(value);
    }

    const getRegions = async (value, i?) => {
        const res: any = await getRegionsByCountryID(value);
        if (res.data.available_regions === undefined) {
            setRegions([]);
            if (i) {
                setCustAddForm(prevState => ({
                    ...prevState,
                    region: ''
                }));
            }
        } else {
            setRegions(res.data.available_regions);
        }
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
                                    {order.status === 'complete' ? <IntlMessages id="order.itsDelivered" /> : order.status === 'pending' ?
                                        <IntlMessages id="order.itsPending" /> : order.status === 'processing' ? <IntlMessages id="order.itsProcessing" />
                                            : order.status}
                                </strong></p>
                                {order.status === 'complete' && <p><IntlMessages id="order.delivered" /> {order.shipping_amount}</p>}
                                <div className="progress-bar-area">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                            aria-valuenow={orderProgress} aria-valuemin={0} aria-valuemax={100} style={{ width: `${orderProgress}%` }}></div>
                                    </div>
                                </div>
                                <p>
                                    {order.status === 'complete' ? <IntlMessages id="order.yourParcelDelivered" /> : order.status === 'pending' ?
                                        <IntlMessages id="order.yourParcelPending" /> : order.status === 'processing' ? <IntlMessages id="order.yourParcelProcessing" />
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
                            <h4><IntlMessages id="order.orderNo" />: {order.increment_id}</h4>
                            <div className="row">
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.purchaseDate" /></strong></p>
                                    <p>{moment(order['created_at']).format('ddd, D MMMM YYYY')}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="shipment.date" /></strong></p>                                   
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
                                {order['delivery_address'] &&  order['delivery_address'].region ? getRegionName(order['delivery_address'].country_id,order['delivery_address'].region) : ""}<br/>
                                {order['delivery_address'] ? getCountryName(order['delivery_address'].country_id) : ""}
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
                    {showReturn && (
                        <div className="col-md-12 return-complaint-btns">
                            {order.returnStatus && (
                                <div className="float-start">
                                    <Link to={`/customer/create-return/${order.increment_id}`}><IntlMessages id="order.returnProducts" /></Link>                                  
                                </div>
                            )}
                            <div className="clearfix"></div>
                        </div>
                    )}
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
                                                {item.extension_attributes.barnd && (<div className="product_name"><Link to={'/search/' + item.extension_attributes.barnd}>{item.extension_attributes.barnd}</Link></div>)}
                                                <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                <p>{capitalize(item.product_type)}</p>
                                            </div>
                                            <Link to="#" className="float-end text-end order-pro-price text-decoration-none">{siteConfig.currency}{formatprice(item.price)}</Link>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="pro-name-tag">
                                            <p><strong><IntlMessages id="order.productNo" /></strong> {item.sku}</p>
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
                                {COUNTRIES && COUNTRIES.map((opt, i) => {
                                    return (<option key={i} value={opt.id}>{opt.full_name_english ? opt.full_name_english : opt.id}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country"]}</span>
                        </div>
                        {regions.length > 0 &&
                            <div className="width-100 mb-3 form-field">
                                <label className="form-label">
                                    <IntlMessages id="myaccount.region" /></label>
                                <select value={custAddForm.region} onChange={handleAddChange} id="region" className="form-select">
                                    <option value="">{intl.formatMessage({ id: "select" })}</option>
                                    {regions && regions.map(opt => {
                                        return (<option key={opt.id} value={opt.id} >
                                            {opt.name}</option>);
                                    })}
                                </select>
                                <span className="error">{errors.errors["region"]}</span>
                            </div>}
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