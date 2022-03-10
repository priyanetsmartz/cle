import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, Link } from "react-router-dom";
import { changeOrderSatus, getOrderDetail } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import notification from '../../../components/notification';
import { formatprice } from '../../../components/utility/allutils';


function VendorOrderDetail(props) {
    const intl = useIntl();
    const { orderId }: any = useParams();
    const [orderDetails, setOrderDetails] = useState([])
    const [orderNumber, setOrderNumber] = useState('')
    const [orderPurchaseDate, setOrderPurchaseDate] = useState('')
    const [orderPayment, setOrderPayment] = useState('')
    const [deliveryCost, setDeliveryCost] = useState('')
    const [statusOrder, selectStatusOrder] = useState('')
    const [orderStatus, setOrderStatus] = useState(0);
    const [loader, setLoader] = useState(false);
    const [statusCode, setStatusCode] = useState("0");
    const [show, setShow] = useState(false)
    const [billingAddr, setBillingAddr] = useState({
        'name': '',
        'street': '',
        'city': '',
        'region': '',
        'country': '',
        'postalCode': ''
    })

    const [shippingAddr, setShippingAddr] = useState({
        'name': '',
        'street': '',
        'city': '',
        'region': '',
        'country': '',
        'postalCode': ''
    })

    const [currency, setCurrency] = useState('')
    const [deliveryMethod, setDeliveryMethod] = useState('')
    const [subtotal, setSubtotal] = useState(0)
    const [shipping, setShipping] = useState(0)
    const [tax, setTax] = useState(0)
    const [total, setTotal] = useState(0)
    const [statusOrderComment, setstatusOrderComment] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    useEffect(() => {
        getOrderDetailFxn(orderId)
    }, [props.languages])

    async function getOrderDetailFxn(orderId, sort_order: any = '') {// api to get details of order and specifying the values like orderDetails, order number, purchase date, payment method, delivery cost, delivery method etc.
        sort_order = sort_order ? sort_order : sortOrder;

        let results: any = await getOrderDetail(props.languages, orderId, sort_order);

        let data = [];
        let productsData = [];
        if (results && results.data && results.data.length > 0) {
            data = results.data
            setOrderNumber(data[0][0].po_increment_id)
            setOrderPurchaseDate(moment(data[0][0].purchase_date).format('ddd DD MMMM YYYY; hh:mm a'))
            setOrderPayment(data[0][0].payment_method)
            setDeliveryCost(data[0][0].delivery_cost)
            setDeliveryMethod(data[0][0].delivery_method)
            setSubtotal(data[0][0].order_total.subtotal)
            setShipping(data[0][0].order_total.shipping)
            setTax(data[0][0].order_total.tax)
            setTotal(data[0][0].order_total.grand_total)
            setCurrency(siteConfig.currency)
            setOrderStatus(data[0][0].udropship_statuslabel)
            setStatusCode(data[0][0].udropship_status)


            if (data[0][0].billing_address.length > 0) {
                let addr: any = data[0][0].billing_address[0]
                let str = ''
                addr.street.map(s => {
                    str += s
                })

                setBillingAddr(prevState => ({
                    ...prevState,
                    'name': addr.billingname,
                    'street': str,
                    'city': addr.city,
                    'region': addr.region,
                    'country': addr.country,
                    'postalCode': addr.postcode
                }))
            }
            if (data[0][0].shipping_address.length > 0) {
                let addr = data[0][0].shipping_address[0]
                let str = ''
                addr.street.map(s => {
                    str += s
                })
                setShippingAddr(prevState => ({
                    ...prevState,
                    'name': addr.shippingname,
                    'street': str,
                    'city': addr.city,
                    'region': addr.region,
                    'country': addr.country,
                    'postalCode': addr.postcode
                }))

            }
            if (data[0][0].product_data && data[0][0].product_data.productinfo.length > 0)
                productsData = data[0][0].product_data.productinfo;
        }
        setOrderDetails(productsData);

    }

    const selectStatus = (event) => {// on the selection of reject, text box will open to enter the reason.
        selectStatusOrder(event.target.value)
        if (event.target.value === 'reject') {
            setShow(true)
        } else {
            setShow(false)
        }
    }

    const handleChange = (e) => {
        setstatusOrderComment(e.target.value);
    }

    const handleSubmitClick = async (e) => {//if status selected is reject, and comment is not entered,it will decline. Otherwise, if everything is ok, then it will hit api and change the order status

        if (statusOrder === "" || statusOrder === null) {
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchange" }));
            return false;
        }
        if (statusOrder === "reject" && statusOrderComment === '') {
            notification("error", "", intl.formatMessage({ id: "order.decline" }));
            return false;
        }
        setLoader(true)
        let result: any = await changeOrderSatus(orderId, statusOrder, statusOrderComment);
        if (result?.data) {
            setLoader(false)
            selectStatusOrder('')
            setstatusOrderComment('')
            getOrderDetailFxn(orderId)
            notification("success", "", intl.formatMessage({ id: "orderstatusupdate" }));
        } else {
            setLoader(false)
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }

    }

    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1><IntlMessages id="orderdetail.title" /></h1>
                            <h2><IntlMessages id="orderdetail.description" /></h2>
                        </div>

                        <section>
                            <div className="return-det">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h5><IntlMessages id="order.orderNo" />: {orderNumber} </h5>
                                    </div>
                                    {statusCode === "0" && (
                                        <div className="col-sm-12">

                                            <div className="row my-3">
                                                <div className="col-md-3 mb-2">
                                                    <label className="form-label"><IntlMessages id="status"></IntlMessages></label>
                                                    <select className="form-select customfliter" aria-label="Default select example" onChange={selectStatus} >
                                                        <option value="">{intl.formatMessage({ id: "select" })}</option>
                                                        <option value="accept">{intl.formatMessage({ id: "accept" })}</option>
                                                        <option value="reject">{intl.formatMessage({ id: "decline" })}</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3 align-self-end mb-2">
                                                    <label className="form-label"></label>
                                                    <Link to="#" className="btn btn-secondary m-0" onClick={handleSubmitClick} style={{ "display": !loader ? "inline-block" : "none" }} ><IntlMessages id="confirm.order" /></Link>
                                                    <div className="spinner btn btn-secondary m-0" style={{ "display": loader ? "inline-block" : "none" }}>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                         <IntlMessages id="loading" />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-2">
                                                    {show && (<div className='return-comment' >
                                                        <label className="form-label"><IntlMessages id="reasonofrejection" /></label>
                                                        <textarea className="form-control customfliter" rows={3} onChange={handleChange} value={statusOrderComment}>
                                                        </textarea>
                                                    </div>)}
                                                </div>
                                            </div>

                                        </div>
                                    )}

                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="status" /></h6>
                                        <p>{orderStatus}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="order.purchaseDate" /></h6>
                                        <p>{orderPurchaseDate}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="order.paymentMethod" /></h6>
                                        <p><i className="fas fa-money-check"></i> {orderPayment}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="deliveryOption" /></h6>
                                        <p>{deliveryMethod}/{formatprice(deliveryCost)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="return-user-info">
                                            <h5><IntlMessages id="checkout.billingAdd" /></h5>
                                            <address>
                                                {billingAddr?.name}<br />
                                                {billingAddr?.street}<br />
                                                {billingAddr?.city}<br />
                                                {billingAddr?.postalCode}<br />
                                                {billingAddr?.country}
                                            </address>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="return-user-info">
                                            <h5><IntlMessages id="order.deliveryAddress" /></h5>
                                            <address>
                                                {shippingAddr.name}<br />
                                                {shippingAddr.street}<br />
                                                {shippingAddr.city}<br />
                                                {shippingAddr.postalCode}<br />
                                                {shippingAddr.country}
                                            </address>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="return-user-total">
                                            <h5><IntlMessages id="order.orderTotal" /></h5>
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td><IntlMessages id="subtotal" /></td>
                                                        <th className="text-end">{currency}{formatprice(subtotal)}</th>
                                                    </tr>
                                                    <tr>
                                                        <td><IntlMessages id="order.shipping" /></td>
                                                        <th className="text-end">{currency}{formatprice(shipping)}</th>
                                                    </tr>
                                                    <tr className="r-tax">
                                                        <td><IntlMessages id="tax" /></td>
                                                        <th className="text-end">{currency}{formatprice(tax)}</th>
                                                    </tr>
                                                    <tr className="tot-bor">
                                                        <th><IntlMessages id="total" /></th>
                                                        <th className="text-end fin-p">{currency}{formatprice(total)}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </section>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="container">
                {orderDetails.length > 0 ?
                    orderDetails.map((product, i) => (
                        <div key={i} className="row">
                            <div className="col-md-12">
                                <div className="order-number">
                                    <hr></hr>
                                    <div className="row">
                                        <div className="col-md-1">
                                            <img height="84px" width="56px" src={product['img']} alt={product['name']} />
                                        </div>
                                        <div className="col-md-3">
                                            <p><strong>{product['brand']}</strong></p>
                                            <p>{product['name']}</p>
                                            <br />
                                            <p>{product['configOptionValue']}</p>
                                            <p><strong><IntlMessages id="order.productNo" /> {product['productId']}</strong></p>
                                        </div>
                                        <div className="col-md-2">
                                            <p><strong><IntlMessages id="price" /></strong></p>
                                            <p>{currency}{formatprice(product['price'])}</p>
                                        </div>
                                        <div className="col-md-2">
                                            <p><strong><IntlMessages id="quantity" /></strong></p>
                                            <p>{formatprice(product['qty_ordered'])}</p>
                                        </div>
                                        <div className="col-md-2">
                                            <p><strong><IntlMessages id="tax" /></strong></p>
                                            <p>{currency}{formatprice(product['tax_amount'])}</p>
                                        </div>
                                        <div className="col-md-2 high-col">
                                            <p><strong><IntlMessages id="total" /></strong></p>
                                            <p>{currency}{formatprice(product['rowTotal'])}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <p><IntlMessages id="norecords" /></p>}

            </div>
        </main>
    )
}

const mapStateToProps = (state) => {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages
    }
}
export default connect(
    mapStateToProps
)(VendorOrderDetail);