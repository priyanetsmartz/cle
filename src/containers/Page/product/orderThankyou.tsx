import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { orderDetailbyId } from '../../../redux/cart/productApi';
import IntlMessages from "../../../components/utility/intlMessages";
import moment from 'moment';
import { Link } from "react-router-dom";
import { checkCustomerLogin, getCountryName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import Form from './order-form';
import { useHistory } from "react-router";
function OrderThankyou(props) {
    let history = useHistory();
    const query = new URLSearchParams(props.location.search);
    const orderId = query.get('id')
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        if (orderId) {
            getOrderDetails(orderId);
        } else {
            window.location.href = '/';
        }

        return () => {
            setOrderDetails({})
        }
    }, [props.token])

    async function getOrderDetails(orderId) {
        let results: any = await orderDetailbyId(orderId);
        let orderDetails = {};
        orderDetails['user'] = results.data ? results.data.customer_email : "";
        let user = await checkCustomerLogin();
        if (orderDetails['user'] !== user?.token_email) {
            history.push('/');
        }
        orderDetails['increment_id'] = results.data ? results.data.increment_id : 0;
        orderDetails['created_at'] = results.data ? results.data.created_at : 0;
        orderDetails['shipment_date'] = results.data && results.data.extension_attributes && results.data.extension_attributes.shipment_date ? results.data.extension_attributes.shipment_date : 0;
        orderDetails['payment-method'] = results?.data?.payment?.additional_information?.[0] ? results?.data?.payment?.additional_information?.[0] : "-";
        orderDetails['total_item_count'] = results.data ? results.data.total_item_count : 0;
        orderDetails['delivery_address'] = results.data && results.data.extension_attributes && results.data.extension_attributes.shipping_assignments && results.data.extension_attributes.shipping_assignments[0].shipping ? results.data.extension_attributes.shipping_assignments[0].shipping.address : 0;
        orderDetails['base_subtotal'] = results.data ? results.data.base_subtotal : 0;
        orderDetails['base_discount_amount'] = results.data ? results.data.base_discount_amount : 0;
        orderDetails['base_shipping_amount'] = results.data ? results.data.base_shipping_amount : 0;
        orderDetails['base_shipping_tax_amount'] = results.data ? results.data.base_shipping_tax_amount : 0;
        orderDetails['base_tax_amount'] = results.data ? results.data.base_tax_amount : 0;
        orderDetails['grand_total'] = results.data ? results.data.grand_total : 0;
        orderDetails['items'] = results.data ? results.data.items : {};
       
        setOrderDetails(orderDetails);
    }
    return (
        <main>
            <section className="order-detail-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="order-detail-head">
                                <h2><IntlMessages id="order.placed" /></h2>
                                <p><IntlMessages id="order.summary" /></p>
                            </div>
                        </div>
                    </div>
                </div>
                <Form />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="order-number">
                                <h2><IntlMessages id="order.orderDetails" /></h2>
                                <h4><IntlMessages id="order.orderNo" />: {orderDetails['increment_id']}</h4>
                                <div className="row">
                                    <div className="col-md-3">
                                        <p><strong><IntlMessages id="order.purchaseDate" /></strong></p>
                                        <p>{moment(orderDetails['created_at']).format("ddd,D MMMM YYYY")}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong><IntlMessages id="order.shippingDate" /></strong></p>
                                        <p>{orderDetails['shipment_date'] !== 'N/A' ? moment(orderDetails['shipment_date']).format("ddd,D MMMM YYYY") : ""} </p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong><IntlMessages id="order.paymentMethod" /></strong></p>
                                        <p>{(orderDetails['payment-method'])}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong><IntlMessages id="order.products" /></strong></p>
                                        <p>{orderDetails['total_item_count']}</p>
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

                                    <div className="clearfix"></div>
                                </div>
                                <p>
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].firstname : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].street : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].postcode : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].city : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].region : ""}<br />
                                    {orderDetails['delivery_address'] ? getCountryName(orderDetails['delivery_address'].country_id) : ""}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="order-delivery-address">
                                <div className="Address-title">
                                    <span><IntlMessages id="order.orderTotal" /></span>
                                </div>
                                <div className="product-total-price">
                                    <p><IntlMessages id="order.subTotal" /><span className="text-end">{siteConfig.currency}{orderDetails['base_subtotal']}</span></p>
                                    <p><IntlMessages id="order.discount" />  <span className="text-end">{siteConfig.currency}{orderDetails['base_discount_amount']}</span></p>
                                    <p><IntlMessages id="order.shipping" /><span className="text-end">{siteConfig.currency}{orderDetails['base_shipping_amount']}</span></p>
                                    <p><IntlMessages id="order.tax" /><span className="text-end">{siteConfig.currency}{orderDetails['base_tax_amount'] + orderDetails['base_shipping_tax_amount']}</span></p>
                                    <hr />
                                    <div className="final-price"><IntlMessages id="order.total" /><span>{siteConfig.currency}{orderDetails['grand_total']}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mb-5">
                    {orderDetails['items'] && orderDetails['items'].length > 0 && (
                        <ul className="order-pro-list">
                            {orderDetails['items'].map((item, i) => {

                                return (<li key={i}>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="product-image">
                                                <img src={item.extension_attributes.item_image} alt={item.name} />
                                            </div>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="pro-name-tag mb-5">
                                                <div className="float-start">
                                                    <p><strong>{item.name}</strong></p>
                                                </div>
                                                <Link to="#" className="float-end text-end order-pro-price">{siteConfig.currency}{item.original_price}</Link>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="pro-name-tag">
                                                {item.product_type === 'simple' ? "" : <p><IntlMessages id="onesize" /></p>}
                                                <p><strong><IntlMessages id="order.productNo" /></strong> {item.sku}</p>
                                                <div className="clearfix"></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                )
                            })}
                        </ul>
                    )}
                    {orderDetails['items'] && orderDetails['items'].length > 3 && (
                        <div className="show-more-btn"><Link to="#" className="btn btn-secondary"><IntlMessages id="order.showMore" /></Link></div>
                    )}
                </div>

            </section>


        </main>
    )
}


const mapStateToProps = (state) => {

    return {
        token: state.session.user
    }
}
export default connect(
    mapStateToProps,
    {}
)(OrderThankyou);