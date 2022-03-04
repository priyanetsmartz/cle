import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getCountryName } from "../../../components/utility/allutils";
import IntlMessages from "../../../components/utility/intlMessages";
import { retrunDetails } from "../../../redux/pages/customers";
import { siteConfig } from "../../../settings";
import ReturnFooter from "./returnFooter";
import { Progress } from 'antd';

function OrdersAndReturns(props) {
    const { returnId }: any = useParams();
    const [orderProgress, setOrderProgress] = useState(0);
    const [returnDetails, setReturnDetails] = useState([]);
    useEffect(() => {
        getReturnDetailFxn(returnId);
    }, []);

    async function getReturnDetailFxn(returnId) {
        let results: any = await retrunDetails(returnId);
        let data = [];
        if (results && results.data && results.data.length > 0) {
            data['info'] = results?.data?.[0]?.info;
            data['address'] = results?.data?.[0]?.address;
            data['items'] = results?.data?.[0]?.items;
            data['return_total'] = results?.data?.[0]?.return_total;
            data['status'] = results?.data?.[0]?.info?.rma_status
            data['trackInfo'] = results?.data?.[0]?.trackInfo
        }
        console.log(results?.data?.[0].trackInfo)
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
                <div className="delivery-bar">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 offset-md-2">
                                <div className="order-detail-head row">
                                    {/* change this after clarification */}
                                    <p className="col-md-8">
                                        <strong>
                                            {returnDetails?.['status'] === 'complete' ? <IntlMessages id="order.itsDelivered" /> : returnDetails?.['status'] === 'pending' ?
                                                <IntlMessages id="return.itsPending" /> : returnDetails?.['status'] === 'processing' ? <IntlMessages id="order.itsProcessing" />
                                                    : returnDetails?.['status'] === 'canceled' ? <IntlMessages id="order.canceled" />
                                                        : returnDetails?.['status']}
                                        </strong>
                                    </p>
                                    {returnDetails?.['trackInfo']?.length !== 0 && (
                                        <div className="col-md-4 align-self-end mb-2"><label className="form-label"></label><Link to={{ pathname: `http://www.dhl.com/en/express/tracking.html?AWB=${returnDetails?.['trackInfo']?.number}&brand=DHL` }} target="_black" className="btn btn-primary track-btn" ><IntlMessages id="track" /></Link></div>
                                    )}
                                    {returnDetails?.['status'] === 'complete' && <p><IntlMessages id="order.delivered" /> {returnDetails?.['shipping_amount']}</p>}
                                    <div className="progress-bar-area">

                                        {returnDetails?.['status'] === 'canceled' ? <Progress
                                            strokeLinecap="square"
                                            percent={orderProgress}
                                            showInfo={false}
                                            strokeWidth={15}
                                            status="exception" />
                                            :
                                            <Progress
                                                strokeColor={{
                                                    '0%': '#87d068',
                                                    '100%': '#108ee9',
                                                }}
                                                strokeLinecap="square"
                                                percent={orderProgress}
                                                showInfo={false}
                                                strokeWidth={15}
                                                status="active"
                                            />
                                        }

                                    </div>

                                </div>

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
                                        <p><strong><IntlMessages id="order.purchaseDate" /></strong></p>
                                        <p>{returnDetails['info'] && returnDetails['info'].purchase_date ? moment(returnDetails['info'].purchase_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong><IntlMessages id="order.shippingDate" /></strong></p>
                                        <p>{returnDetails['info'] && returnDetails['info'].shipment_date ? moment(returnDetails['info'].shipment_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong><IntlMessages id="order.paymentMethod" /></strong></p>
                                        <p>{returnDetails['info'] ? returnDetails['info'].payment_method : ""}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <p><strong><IntlMessages id="order.products" /></strong></p>
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
                                    <IntlMessages id="create.return.details1" />
                                    <IntlMessages id="create.return.details2" />
                                </p>
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
                                                <div className="product-image p-2">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="pro-name-tag">
                                                    <div className="float-start">
                                                        <p><strong>{item.brand}</strong></p>
                                                        <p>{item.name}</p>
                                                    </div>
                                                    <Link to="#" className="float-end text-end order-pro-price text-decoration-none">{siteConfig.currency}{item.price}</Link>
                                                    <div className="clearfix"></div>
                                                </div>
                                                <div className="pro-name-tag">
                                                    <p><IntlMessages id="onesize" /></p>
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
                </div>

                <div className="container mb-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="order-delivery-address">
                                <div className="Address-title">
                                    <span className="float-start"><IntlMessages id="order.deliveryAddress" /></span>

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
                                    <span><IntlMessages id="return.total" /></span>
                                </div>
                                <div className="product-total-price">
                                    <p><IntlMessages id="order.subTotal" /><span className="text-end">{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].subtotal : 0}</span></p>
                                    <p><IntlMessages id="order.shipping" /><span className="text-end">{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].shipping : 0}</span></p>
                                    <p><IntlMessages id="order.tax" /><span className="text-end">{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].tax : 0}</span></p>
                                    <hr />
                                    <div className="final-price"><IntlMessages id="order.total" /><span>{returnDetails['return_total'] ? siteConfig.currency + ' ' + returnDetails['return_total'].grand_total : 0}</span></div>
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