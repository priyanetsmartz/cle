import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getCountryName } from "../../../components/utility/allutils";
import IntlMessages from "../../../components/utility/intlMessages";
import { retrunDetails } from "../../../redux/pages/customers";
import { siteConfig } from "../../../settings";
import ReturnFooter from "./returnFooter";

function OrdersAndReturns(props) {
    const { returnId }: any = useParams();
    const [returnDetails, setReturnDetails] = useState([]);
    useEffect(() => {
        getReturnDetailFxn(returnId);
    }, []);

    async function getReturnDetailFxn(orderId) {
        let results: any = await retrunDetails(orderId);
        let data = [];
        if (results && results.data && results.data.length > 0) {
            data['info'] = results.data[0].info;
            data['address'] = results.data[0].address;
            data['items'] = results.data[0].items;
            data['return_total'] = results.data[0].return_total;
        }
        setReturnDetails(data);
    }
    return (
        <main>

            <section className="order-detail-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
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
                                <h4><IntlMessages id="return_number" />: {returnDetails['info'] ? returnDetails['info'].rma_increment_id : ""}</h4>
                                <div className="row">
                                    <div className="col-md-3">
                                        <p><strong>Purchase Date</strong></p>
                                        <p>{returnDetails['info'] && returnDetails['info'].purchase_date ? moment(returnDetails['info'].purchase_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong>Shipping Date</strong></p>
                                        <p>{returnDetails['info'] && returnDetails['info'].shipment_date ? moment(returnDetails['info'].shipment_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong>Payment Method</strong></p>
                                        <p>{returnDetails['info'] ? returnDetails['info'].payment_method : ""}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong>Products</strong></p>
                                        <p>{returnDetails['info'] ? returnDetails['info'].return_qty : 0}</p>
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
                    {returnDetails['items'] && returnDetails['items'].length > 0 && (
                        <ul className="order-pro-list order-return-list">
                            {returnDetails['items'].map((item, i) => {
                                return (
                                    <li className="pb-0 ps-0 pe-0 border">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="product-image">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="pro-name-tag mb-5">
                                                    <div className="float-start">
                                                        <p><strong>{item.brand}</strong></p>
                                                        <p>{item.name}</p>
                                                    </div>
                                                    <Link to="#" className="float-end text-end order-pro-price">{siteConfig.currency}{item.price}</Link>
                                                    <div className="clearfix"></div>
                                                </div>
                                                <div className="pro-name-tag">
                                                    <p>One Size</p>
                                                    <p><strong>Product no.</strong> {item.product_id}</p>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-12">
                                                <select className="form-select" aria-label="Default select example">
                                                    <option selected>Choose the reason</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div> */}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                <div className="container mb-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="order-delivery-address">
                                <div className="Address-title">
                                    <span className="float-start">Delivery address</span>
                                    {/* <Link to="#" className="float-end">Change</Link> */}
                                    <div className="clearfix"></div>
                                </div>
                                {returnDetails['address'] ?
                                    <p>

                                        {returnDetails['address'].firstname}<br />
                                        {returnDetails['address'].lastname}<br />
                                        {returnDetails['address'].street}<br />
                                        {returnDetails['address'].postcode}<br />
                                        {returnDetails['address'].city}<br />
                                        {returnDetails['address'].region}<br />
                                        {returnDetails['address'].country_id ? getCountryName(returnDetails['address'].country_id) : ""}

                                    </p>
                                    : ""}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="order-delivery-address">
                                <div className="Address-title">
                                    <span>Delivery address</span>
                                </div>
                                <div className="product-total-price">
                                    <p>Sub Total<span className="text-end">{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].subtotal : 0}</span></p>
                                    <p>Shipping<span className="text-end">{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].shipping : 0}</span></p>
                                    <p>Tax<span className="text-end">{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].tax : 0}</span></p>
                                    <hr />
                                    <div className="final-price">Total<span>{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].grand_total : 0}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <ReturnFooter />
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