import { connect } from "react-redux";
import { Link } from "react-router-dom";



function OrdersAndReturns(props) {

    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="new-breadcrumb">
                            <ol className="breadcrumb mt-0">
                                <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                                <li className="breadcrumb-item"><Link to="#">My Account</Link></li>
                                <li className="breadcrumb-item"><Link to="#">My Orders and Returns</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Return details</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <section className="order-detail-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="order-detail-head">
                                <h2>Return details</h2>
                                <p>We get it, Sometimes something just doesn't work for you and you want money back. You can return your
                                    product here.</p>
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
                        <div className="col-md-12 return-complaint-btns">
                            <div className="float-start w-75">
                                <p>
                                    Select items for return by clicking on the product. Please choose the reason if you want to return the
                                    product. Product without chosen reason won't be returned.
                                </p>
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
                    <ul className="order-pro-list order-return-list">
                        <li className="pb-0 ps-0 pe-0 border">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="product-image">
                                        <img src="images/minicart_p1.png" alt="" />
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="pro-name-tag mb-5">
                                        <div className="float-start">
                                            <p><strong>Gucci</strong></p>
                                            <p>Web Strip &amp; gold PVD watch</p>
                                        </div>
                                        <Link to="#" className="float-end text-end order-pro-price">$1,344</Link>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="pro-name-tag">
                                        <p>One Size</p>
                                        <p><strong>Product no.</strong> 123456789</p>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <select className="form-select" aria-label="Default select example">
                                        <option selected>Choose the reason</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                            </div>
                        </li>
                        <li className="pb-0 ps-0 pe-0 border">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="product-image">
                                        <img src="images/minicart_p1.png" alt="" />
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="pro-name-tag mb-5">
                                        <div className="float-start">
                                            <p><strong>Gucci</strong></p>
                                            <p>Web Strip &amp; gold PVD watch</p>
                                        </div>
                                        <Link to="#" className="float-end text-end order-pro-price">$1,344</Link>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="pro-name-tag">
                                        <p>One Size</p>
                                        <p><strong>Product no.</strong> 123456789</p>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <select className="form-select" aria-label="Default select example">
                                        <option selected>Choose the reason</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                            </div>
                        </li>
                    </ul>
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
                    <div className="row mt-5">
                        <div className="col-md-12">
                            <div className="return-pro-btn float-end"><Link to="#" className="btn btn-primary">Return Products</Link></div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>

            </section>

            <section className="return-footer-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 pe-0">
                            <div className="black-bg-footer">
                                <div className="black-bg-inner">
                                    <h2>Return Policy</h2>
                                    <p>We want to make sure returns are as easy as possible to do, but if you need more information on our
                                        Return Policy.</p>
                                    <Link to="#" className="btn-white-primary">Check out</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 ps-0">
                            <div className="blue-bg-footer">
                                <div className="black-bg-inner">
                                    <h2>Contact Us</h2>
                                    <p>We are here to help and answer any questions you might have. We look forward to hearing from you!</p>
                                    <Link to="#" className="btn-white-primary">Contact Us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}



function mapStateToProps(state) {
    return {
        state: state
    };
};
export default connect(
    mapStateToProps
)(OrdersAndReturns);