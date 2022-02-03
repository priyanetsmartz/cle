import { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { checkIfReturnExists, createReturnRequest, getRegionsByCountryID, getReturnReasonList, searchOrders, updateOrderAddress } from '../../../redux/pages/customers';
import moment from 'moment';
import IntlMessages from "../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import { Link, useParams } from "react-router-dom";
import { capitalize, formatprice, getCountryName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import ReturnFooter from './returnFooter';
import { useIntl } from 'react-intl';
import { COUNTRIES } from '../../../config/counties';
import notification from '../../../components/notification';

function CreateReturn(props) {
    const intl = useIntl();
    const selectRef = useRef();
    const { returnId }: any = useParams();
    const [custId, setCustid] = useState(props.token.cust_id);
    const [maxItems, setMaxitems] = useState(10);
    const [order, setOrder]: any = useState([]);
    const [regions, setRegions] = useState([]);
    const [issueList, setIssueList]: any = useState([]);
    const [changeAddressModal, setChangeAddressModal] = useState(false);
    const [returnOrExchange, setReturnOrExchange] = useState('');
    const [returnOrExchangeComment, setReturnOrExchangeComment] = useState('');
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
    }, []);

    const getReturnReasonListFxn = async () => {
        let result: any = await getReturnReasonList()
        setIssueList(result.data);
    }

    const getData = async (returnId) => {
        let orderDetails = [];
        let result: any = await searchOrders(returnId);
        // console.log(result.data.items[0].payment.additional_information[0])
        orderDetails['entity_id'] = result.data.items[0] ? result.data.items[0].entity_id : 0;
        orderDetails['increment_id'] = result.data.items[0] ? result.data.items[0].increment_id : 0;
        orderDetails['created_at'] = result.data.items[0] ? result.data.items[0].created_at : 0;
        orderDetails['shipment_date'] = result.data.items[0] && result.data.items[0].extension_attributes && result.data.items[0].extension_attributes.shipment_date ? result.data.items[0].extension_attributes.shipment_date : 0;
        orderDetails['payment-method'] = result.data.items[0]?.payment?.additional_information?.[0];
        orderDetails['total_item_count'] = result.data.items[0] ? result.data.items[0].total_item_count : 0;
        orderDetails['delivery_address'] = result.data.items[0] && result.data.items[0].extension_attributes && result.data.items[0].extension_attributes.shipping_assignments && result.data.items[0].extension_attributes.shipping_assignments[0].shipping ? result.data.items[0].extension_attributes.shipping_assignments[0].shipping.address : 0;
        orderDetails['base_subtotal'] = result.data.items[0] ? result.data.items[0].base_subtotal : 0;
        orderDetails['base_discount_amount'] = result.data.items[0] ? result.data.items[0].base_discount_amount : 0;
        orderDetails['base_shipping_amount'] = result.data.items[0] ? result.data.items[0].base_shipping_amount : 0;
        orderDetails['base_shipping_tax_amount'] = result.data.items[0] ? result.data.items[0].base_shipping_tax_amount : 0;
        orderDetails['base_tax_amount'] = result.data.items[0] ? result.data.items[0].base_tax_amount : 0;
        orderDetails['grand_total'] = result.data.items[0] ? result.data.items[0].grand_total : 0;
        let orderItems = result.data.items[0] ? result.data.items[0].items : {};

        let orderData = orderItems.filter(function (e) {
            return (e.qty_shipped >= 1 && e.qty_refunded === 0);
        });
        let checkreturn: any = await checkIfReturnExists(orderDetails['entity_id']);


        let myObject = checkreturn?.data?.[0];

        let resultShow = myObject.filter(val => {
            return val.value === 'false';
        });
        // console.log(resultShow)
        // console.log(orderData)

        var onlyInReturn = orderData.filter(comparer(resultShow));


        orderDetails['items'] = onlyInReturn;
        setOrder(orderDetails);
    }
    function comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                //  console.log(parseInt(other.id),current.item_id )
                return parseInt(other.id) === current.item_id
            }).length == 0;
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
    const saveCustAddress = async (e) => {
        if (validateAddress()) {
            custAddForm.customer_id = custId;
            custAddForm.address_type = 'shipping';
            custAddForm.email = props.token.token_email;
            custAddForm.orderId = order.entity_id;
            custAddForm.post_code = custAddForm.postcode;
            // let data = {
            //     "entity": custAddForm
            // }
            // console.log(custAddForm)
            let result: any = await updateOrderAddress(custAddForm);
            if (result.data === 'address updated') {
                getData(returnId);
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


    const sortHandler = (sortOrder) => {
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

    const handleProductSelect = (prodID) => {
        console.log(prodID);
    }
    const selectReason = (event) => {
        let attribute_code = event.target.getAttribute("data-attribute");
        setReasonObject(prevState => ({
            ...prevState,
            [attribute_code]: event.target.value
        }))
    }
    const handleChange = (e) => {
        setReturnOrExchangeComment(e.target.value);
    }

    const selectReturnOrExchange = (event) => {
        setReturnOrExchange(event.target.value)
    }
    const handleSubmitClick = async (e) => {

        if (reasonObject.length === 0) {
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchangeProducts" }));
            return false;
        }
        if (returnOrExchange === "" || returnOrExchange === null) {
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchange" }));
            return false;
        }
        let returnInfoData = {
            returnInfo: {
                orderId: order['entity_id'],
                rma_reason: returnOrExchange,
                comment_text: returnOrExchangeComment,
                items: reasonObject
            }
        }
        //    console.log(returnInfoData)
        let result: any = await createReturnRequest(returnInfoData);
        console.log(result.data.status)
        if (result?.data?.[0]?.status === true) {
            let key = Object.values(result?.data?.[0]?.rma);
            let url = `/customer/return-details/${key[0]}`;
            // console.log(key[0], url)
            window.location.href = url;
            notification("success", "", "Return created");
        } else {
            notification("error", "", result?.data?.[0]?.message);
        }

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
                                    {/* <p>{order['shipment_date'] ? moment(order['shipment_date']).format('ddd, D MMMM YYYY'): ''}</p> */}
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
                                {/* {console.log(item)} */}
                                <li onClick={() => handleProductSelect(item.item_id)}>
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
                                                {/* <p>One Size</p> */}
                                                {/* will add this in alpha */}
                                                <p><strong><IntlMessages id="order.productNo" /></strong> {item.sku}</p>
                                                <div className="clearfix"></div>

                                            </div>

                                        </div>
                                    </div>
                                </li>

                                <select className="form-select customfliter" aria-label="Default select example" data-attribute={item.item_id} onChange={selectReason} >
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
                                {order['delivery_address'] && order['delivery_address'].country_id ? getCountryName(order['delivery_address'].country_id) : ""}
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
                                <p><IntlMessages id="order.tax" /><span className="text-end">{siteConfig.currency}{formatprice(order.shipping_amount)}</span></p>
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
                                <Link to="#" className="btn btn-primary" onClick={handleSubmitClick} ><IntlMessages id="order.returnProducts" /></Link>
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
)(CreateReturn);