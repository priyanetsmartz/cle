import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { getOrderDetail } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { Link } from "react-router-dom";
import { getCountryName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";

function VendorOrderDetail(props) {
    const { orderId }: any = useParams();
    const [orderDetails, setOrderDetails] = useState([])
    const [orderNumber, setOrderNumber] = useState('')
    const[orderPurchaseDate,setOrderPurchaseDate]= useState('')
    const[orderPayment,setOrderPayment]= useState('')
    const[deliveryCost,setDeliveryCost]= useState('')
    const [paymentStatus, setPaymentStatus] = useState('')
    const[billingAddr, setBillingAddr] = useState({
        'name':'',
        'street':'',
        'city':'',
        'region':'',
        'country':'',
        'postalCode':''
    })

    const[shippingAddr, setShippingAddr] = useState({
        'name':'',
        'street':'',
        'city':'',
        'region':'',
        'country':'',
        'postalCode':''
    })

    const[currency, setCurrency] = useState('')
    const[deliveryMethod,setDeliveryMethod]= useState('')
    const[subtotal, setSubtotal]  = useState(0)
    const [shipping, setShipping]= useState(0)
    const[tax, setTax] = useState(0)
    const[total, setTotal] = useState(0)


    useEffect(() => {
        getOrderDetailFxn(orderId)
    }, [props.languages])

    async function getOrderDetailFxn(orderId) {
        let results: any = await getOrderDetail(props.languages, orderId);
        console.log("results",results);
        let data = [];
        let productsData = [];
        if (results && results.data && results.data.length > 0) {
            // data['info'] = results.data[0].info;
            // data['address'] = results.data[0].address;
            // data['items'] = results.data[0].items;
            data = results.data
            setOrderNumber(data[0][0].po_increment_id )
            setOrderPurchaseDate(moment(data[0][0].purchase_date).format('DD MMMM YYYY'))
            setOrderPayment(data[0][0].payment_method)
            setOrderPayment(data[0][0].payment_method)
            setDeliveryCost(data[0][0].delivery_cost)
            setDeliveryMethod(data[0][0].delivery_method)
            setSubtotal(data[0][0].order_total.subtotal)
            setShipping(data[0][0].order_total.shipping)
            setTax(data[0][0].order_total.tax)
            setTotal(data[0][0].order_total.grand_total)
            setCurrency(siteConfig.currency)
            setPaymentStatus(data[0][0].invoice_data.invoice_status)
            
            if(data[0][0].billing_address.length>0){
                let addr:any = data[0][0].billing_address[0]
                let str = ''
                addr.street.map(s=>{
                    str+=s
                })

                setBillingAddr(prevState => ({
                    ...prevState,
                    'name':addr.billingname,
                    'street':str,
                    'city':addr.city,
                    'region':addr.region,
                    'country':addr.country,
                    'postalCode':addr.postcode
                }))         
            }
            if(data[0][0].shipping_address.length>0){
                let addr = data[0][0].shipping_address[0]
                let str = ''
                addr.street.map(s=>{
                    str+=s
                })
                setShippingAddr(prevState => ({
                    ...prevState,
                    'name':addr.shippingname,
                    'street':str,
                    'city':addr.city,
                    'region':addr.region,
                    'country':addr.country,
                    'postalCode':addr.postcode
                })) 
                
            }
            if(data[0][0].product_data && data[0][0].product_data.productinfo.length>0 )
            productsData=data[0][0].product_data.productinfo;
        }
        setOrderDetails(productsData);
    
    }
    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1><IntlMessages id="orderdetail.title"/></h1>
                            <h2><IntlMessages id = "orderdetail.description"/></h2>
                        </div>


                        <section>
                            <div className="return-det">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h5><IntlMessages id="order.orderNo"/>: {orderNumber} (<IntlMessages id = "paymentstatus"/>: {paymentStatus})</h5>
                                    </div>

                                    <div className="col-sm-3">
                                        <h6><IntlMessages id = "order.purchaseDate"/></h6>
                                        <p>{orderPurchaseDate}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id = "order.paymentMethod"/></h6>
                                        <p>{orderPayment}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id  ="deliveryOption"/></h6>
                                        <p>{deliveryMethod}/{deliveryCost}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="return-user-info">
                                            <h5><IntlMessages id = "checkout.billingAdd"/></h5>
                                            <address>
                                                {billingAddr.name}<br />
                                                {billingAddr.street}<br />
                                                {billingAddr.city}<br />
                                                {billingAddr.region}<br />
                                                {billingAddr.country}
                                            </address>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="return-user-info">
                                            <h5><IntlMessages id = "order.deliveryAddress"/></h5>
                                            <address>
                                                {shippingAddr.name}<br />
                                                {shippingAddr.street}<br />
                                                {shippingAddr.city}<br />
                                                {shippingAddr.region}<br />
                                                {shippingAddr.country}
                                            </address>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="return-user-total">
                                            <h5><IntlMessages id = "returntotal"/></h5>
                                            <table className="table table-borderless mb-0">
                                                <tr>
                                                    <td><IntlMessages id = "subtotal"/></td>
                                                    <th className="text-end">{currency}{subtotal}</th>
                                                </tr>
                                                <tr>
                                                    <td><IntlMessages id = "order.shipping"/></td>
                                                    <th className="text-end">{currency}{shipping}</th>
                                                </tr>
                                                <tr className="r-tax">
                                                    <td><IntlMessages id = "tax"/></td>
                                                    <th className="text-end">{currency}{tax}</th>
                                                </tr>
                                                <tr className="tot-bor">
                                                    <th><IntlMessages id = "total"/></th>
                                                    <th className="text-end fin-p">{currency}{total}</th>
                                                </tr>
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
                {orderDetails.length>0?
                orderDetails.map(product => (
                    <div className="row">
                    <div className="col-md-12">
                        <div className="order-number">
                            <hr></hr>
                            <div className="row">
                                <div className="col-md-2">
                                    <img height="84px" width="56px" src = {product['img']}></img>
                                </div>
                                <div className="col-md-4">
                                    <p><strong>{product['brand']}</strong></p>
                                    <p>{product['name']}</p>
                                    <br/>
                                    <p>{product['configOptionValue']}</p>
                                    <p><strong>{product['productId']}</strong></p>
                                </div>
                                
                                <div className="col-md-1">
                                </div>
                                <div className="col-md-1">
                                    <p><strong><IntlMessages id="price" /></strong></p>
                                    <p>{currency}{product['price']}</p>
                                </div>
                                <div className="col-md-1">
                                    <p><strong><IntlMessages id="quantity" /></strong></p>
                                    <p>{product['qty_ordered']}</p>
                                </div>
                                <div className="col-md-1">
                                    <p><strong><IntlMessages id="tax" /></strong></p>
                                    <p>{currency}{product['tax_amount']}</p>
                                </div>
                                <div className="col-md-1">
                                    <p><strong><IntlMessages id="total" /></strong></p>
                                    <p>{currency}{product['rowTotal']}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )):<p><IntlMessages id = "norecords"/></p>}

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