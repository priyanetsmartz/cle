import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { orderDetailbyId } from '../../../redux/cart/productApi';
import moment from 'moment';
import { Link } from "react-router-dom";
import { capitalize } from '../../../components/utility/allutils';

function OrderThankyou(props) {
    const query = new URLSearchParams(props.location.search);
    const orderId = query.get('id')
    const [orderDetails, setOrderDetails] = useState({});
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        getOrderDetails(orderId);

        return () => {
            //
        }
    }, [])

    async function getOrderDetails(orderId) {
        let results: any = await orderDetailbyId(orderId);
        let orderDetails = {};
        orderDetails['increment_id'] = results.data ? results.data.increment_id : 0;
        orderDetails['created_at'] = results.data ? results.data.created_at : 0;
        orderDetails['shipment_date'] = results.data && results.data.extension_attributes && results.data.extension_attributes.shipment_date ? results.data.extension_attributes.shipment_date : 0;
        orderDetails['payment-method'] = results.data ? results.data.payment.method : "-";
        orderDetails['total_item_count'] = results.data ? results.data.total_item_count : 0;
        orderDetails['delivery_address'] = results.data && results.data.extension_attributes && results.data.extension_attributes.shipping_assignments && results.data.extension_attributes.shipping_assignments[0].shipping ? results.data.extension_attributes.shipping_assignments[0].shipping.address : 0;
        orderDetails['base_subtotal'] = results.data ? results.data.base_subtotal : 0;
        orderDetails['base_discount_amount'] = results.data ? results.data.base_discount_amount : 0;
        orderDetails['base_shipping_amount'] = results.data ? results.data.base_shipping_amount : 0;
        orderDetails['base_shipping_tax_amount'] = results.data ? results.data.base_shipping_tax_amount : 0;
        orderDetails['base_tax_amount'] = results.data ? results.data.base_tax_amount : 0;
        orderDetails['grand_total'] = results.data ? results.data.grand_total : 0;
        orderDetails['items'] = results.data ? results.data.items : {};
        console.log(orderDetails)
        setOrderDetails(orderDetails);
    }
    return (
        <main>
            <section className="order-detail-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="order-detail-head">
                                <h2>The order has been paid</h2>
                                <p>Thanks for your order! Check out the details below!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row delivery-bar">
                        <div className="col-md-8 offset-md-2">
                            <div className="marketing_secs">

                                <h2>checkout process feedback</h2>
                                <p>Please, answer 3 questions and help us be better.</p>

                                <div className="width-100%">
                                    <div className="steps-sec">

                                        <div className="stepwizard">
                                            <div className="stepwizard-row">
                                                <div className="stepwizard-step">
                                                    <button type="button" className="btn btn-primary btn-circle"><span className="text">1</span></button>
                                                </div>
                                                <div className="stepwizard-step">
                                                    <button type="button" className="btn btn-default btn-circle"><span className="text">2</span></button>
                                                </div>
                                                <div className="stepwizard-step">
                                                    <button type="button" className="btn btn-default btn-circle" disabled><span
                                                        className="text">3</span></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p>Is the Checkout process is clear for you? Choose an answer from 1 to 5 (1-it's chaotic; 5-it's
                                    perfect).</p>


                                <div className="choose-shopping">

                                    <button type="button" className="btn btn-outline-primary me-2">1</button>
                                    <button type="button" className="btn btn-outline-primary me-2">2</button>
                                    <button type="button" className="btn btn-outline-primary me-2">3</button>
                                    <button type="button" className="btn btn-outline-primary me-2">4</button>
                                    <button type="button" className="btn btn-outline-primary me-2">5</button>

                                </div>



                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="order-number">
                                <h2>Order Details</h2>
                                <h4>Order number: {orderDetails['increment_id']}</h4>
                                <div className="row">
                                    <div className="col-md-3">
                                        <p><strong>Purchase Date</strong></p>
                                        <p>{moment(orderDetails['created_at']).format("ddd,D MMMM YYYY")}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong>Shipping Date</strong></p>
                                        <p>{orderDetails['shipment_date'] !== 'N/A' ? moment(orderDetails['shipment_date']).format("ddd,D MMMM YYYY") : ""} </p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong>Payment Method</strong></p>
                                        <p>{orderDetails['payment-method']}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong>Products</strong></p>
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
                                    <span className="float-start">Delivery address</span>
                                    <Link to="#" className="float-end">Change</Link>
                                    <div className="clearfix"></div>
                                </div>
                                <p>
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].firstname : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].street : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].postcode : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].city : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].region : ""}<br />
                                    {orderDetails['delivery_address'] ? orderDetails['delivery_address'].country_id : ""}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="order-delivery-address">
                                <div className="Address-title">
                                    <span>Order Total</span>
                                </div>
                                <div className="product-total-price">
                                    <p>Sub Total<span className="text-end">${orderDetails['base_subtotal']}</span></p>
                                    <p>Discount  <span className="text-end">${orderDetails['base_discount_amount']}</span></p>
                                    <p>Shipping<span className="text-end">${orderDetails['base_shipping_amount']}</span></p>
                                    <p>Tax<span className="text-end">${orderDetails['base_tax_amount'] + orderDetails['base_shipping_tax_amount']}</span></p>
                                    <hr />
                                    <div className="final-price">Total<span>${orderDetails['grand_total']}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mb-5">
                    {orderDetails['items'] && orderDetails['items'].length > 0 && (
                        <ul className="order-pro-list">
                            {orderDetails['items'].map((item, i) => {
                                // console.log(item);
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
                                                    {/* <p>Web Strip &amp; gold PVD watch</p> */}
                                                </div>
                                                <Link to="#" className="float-end text-end order-pro-price">${item.original_price}</Link>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="pro-name-tag">
                                                {item.product_type === 'simple' ? "" : <p>One Size</p>}
                                                <p><strong>Product no.</strong> {item.product_id}</p>
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
                        <div className="show-more-btn"><Link to="#" className="btn btn-secondary">Show More</Link></div>
                    )}
                </div>

            </section>


        </main>
    )
}


const mapStateToProps = (state) => {

    return {

    }
}
export default connect(
    mapStateToProps,
    {}
)(OrderThankyou);