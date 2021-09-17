import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { searchOrders } from '../../../redux/pages/customers';


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
                            <h2>Order details</h2>
                            <p>Thanks for your order! Check out the details below.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="delivery-bar">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="order-detail-head">
                                <p><strong>It's Delivered</strong></p>
                                <p>Delivered Mon, 31 May 2021</p>
                                <div className="progress-bar-area">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                            aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                                <p>Your parcel has been delivered. We hope you love it!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="order-number">
                            <h4>Order number: 101098675674686434</h4>
                            <div className="row">
                                <div className="col-md-3">
                                    <p><strong>Purchase Date</strong></p>
                                    <p>Mon, 10 May 2021</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong>Shipping Date</strong></p>
                                    <p>Mon, 10 May 2021</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong>Payment Method</strong></p>
                                    <p>Mastercard</p>
                                </div>
                                <div className="col-md-3">
                                    <p><strong>Products</strong></p>
                                    <p>23</p>
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
                                <a href="" className="float-end">Change</a>
                                <div className="clearfix"></div>
                            </div>
                            <p>
                                Anna Smith<br />
                                Baker Street<br />
                                40-333<br />
                                London<br />
                                Great Britain
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="order-delivery-address">
                            <div className="Address-title">
                                <span>Delivery address</span>
                            </div>
                            <div className="product-total-price">
                                <p>Sub Total<span className="text-end">$1,237</span></p>
                                <p>Shipping<span className="text-end">$0</span></p>
                                <p>Tax<span className="text-end">$107</span></p>
                                <hr />
                                <div className="final-price">Total<span>$1,344</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-12 return-complaint-btns">
                        <div className="float-start">
                            <a href="">Return products</a>
                            <a href="">Make a complaint</a>
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
                    <li>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="product-image">
                                    <img src="images/minicart_p1.png" />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="pro-name-tag mb-5">
                                    <div className="float-start">
                                        <p><strong>Gucci</strong></p>
                                        <p>Web Strip &amp; gold PVD watch</p>
                                    </div>
                                    <a href="" className="float-end text-end order-pro-price">$1,344</a>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="pro-name-tag">
                                    <p>One Size</p>
                                    <p><strong>Product no.</strong> 123456789</p>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="product-image">
                                    <img src="images/minicart_p1.png" />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="pro-name-tag mb-5">
                                    <div className="float-start">
                                        <p><strong>Gucci</strong></p>
                                        <p>Web Strip &amp; gold PVD watch</p>
                                    </div>
                                    <a href="" className="float-end text-end order-pro-price">$1,344</a>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="pro-name-tag">
                                    <p>One Size</p>
                                    <p><strong>Product no.</strong> 123456789</p>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="show-more-btn"><a href="" className="btn btn-secondary">Show More</a></div>
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