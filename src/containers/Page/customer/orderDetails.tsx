import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { searchOrders } from '../../../redux/pages/customers';
import moment from 'moment';
import IntlMessages from "../../../components/utility/intlMessages";


function OrderDetails(props) {

    const [orderId, setOrderId] = useState(props.match.params.orderId);
    const [order, setOrder]: any = useState({});

    useEffect(() => {
        console.log(props.match.params.orderId)
        setOrderId(props.match.params.orderId)
        getData();
    }, []);

    const getData = async () => {
        let result: any = await searchOrders(orderId);
        setOrder(result.data);
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
                                <p><strong><IntlMessages id="order.itsDelivered" /></strong></p>
                                <p><IntlMessages id="order.delivered" /> Mon, 31 May 2021</p>
                                <div className="progress-bar-area">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                            aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                                <p><IntlMessages id="order.yourParcelDelivered" /></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="order-number">
                            <h4><IntlMessages id="order.orderNo" />: 101098675674686434</h4>
                            <div className="row">
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.purchaseDate" /></strong></p>
                                    <p>{moment(order.created_at).format('ddd, D MMMM YYYY')}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.shippingDate" /></strong></p>
                                    <p>Mon, 10 May 2021</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.paymentMethod" /></strong></p>
                                    <p>{order.payment?.method}</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong><IntlMessages id="order.products" /></strong></p>
                                    <p>{order.items?.length}</p>
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
                                <a href="" className="float-end"><IntlMessages id="order.change" /></a>
                                <div className="clearfix"></div>
                            </div>
                            <p>
                                {order.billing_address?.firstname + ' ' + order.billing_address?.lastname}<br />
                                {order.billing_address?.street}<br />
                                {order.billing_address?.postcode}<br />
                                {order.billing_address?.city}<br />
                                {order.billing_address?.country_id}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="order-delivery-address">
                            <div className="Address-title">
                                <span><IntlMessages id="order.orderTotal" /></span>
                            </div>
                            <div className="product-total-price">
                                <p><IntlMessages id="order.subTotal" /><span className="text-end">${order.base_subtotal}</span></p>
                                <p><IntlMessages id="order.shipping" /><span className="text-end">${order.base_shipping_amount}</span></p>
                                <p><IntlMessages id="order.tax" /><span className="text-end">$0</span></p>
                                <hr />
                                <div className="final-price"><IntlMessages id="order.total" /><span>${order.grand_total}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-12 return-complaint-btns">
                        <div className="float-start">
                            <a href=""><IntlMessages id="order.returnProducts" /></a>
                            <a href=""><IntlMessages id="order.makeAComplaint" /></a>
                        </div>
                        <div className="float-end">
                            <div className="btn-group">
                                <button type="button" className="btn btn-link dropdown-toggle" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Sort By
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><button className="dropdown-item" type="button">Price: high to low</button></li>
                                    <li><button className="dropdown-item" type="button">Price: low to high</button></li>
                                </ul>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <ul className="order-pro-list">
                    {order && order.items && order.items.map(item => {
                        return (
                            <li>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="product-image">
                                            <img src={item.extension_attributes.item_image} />
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="pro-name-tag mb-5">
                                            <div className="float-start">
                                                <p><strong>{item.name}</strong></p>
                                                <p>{item.product_type}</p>
                                            </div>
                                            <a href="" className="float-end text-end order-pro-price">${item.price}</a>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="pro-name-tag">
                                            <p>One Size</p>
                                            <p><strong><IntlMessages id="order.productNo" /></strong> 123456789</p>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}


                </ul>
                <div className="show-more-btn"><a href="" className="btn btn-secondary"><IntlMessages id="order.showMore" /></a></div>
            </div>

        </section>
    );
}

function mapStateToProps(state) {
    return {
        state: state
    };
};
export default connect(
    mapStateToProps
)(OrderDetails);