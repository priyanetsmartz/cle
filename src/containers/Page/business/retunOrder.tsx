import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { getReturnDetail } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { Link } from "react-router-dom";
import { capitalize, getCountryName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import cross from '../../image/cross.svg';
function RetunOrder(props) {
    const { returnId }: any = useParams();
    const [returnDetails, setReturnDetails] = useState([])

    useEffect(() => {
        getReturnDetailFxn(returnId)
    }, [props.languages])

    async function getReturnDetailFxn(orderId) {
        let results: any = await getReturnDetail(orderId);
        let data = [];
        if (results && results.data && results.data.length > 0) {
            data['info'] = results.data[0].info;
            data['address'] = results.data[0].address;
            data['items'] = results.data[0].items;
        }
        setReturnDetails(data);
    }
    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1>Return Details</h1>
                            <h2>We get it, sometimes something just doesn't work for you and you want your
                                money back.  You can return your products here.</h2>
                        </div>
                        <section>
                            <div className="return-det">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h5>Order number: {returnDetails['info'] ? returnDetails['info'].rma_id : ""}</h5>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Purchase Date</h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].purchase_date ? moment(returnDetails['info'].purchase_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>

                                    <div className="col-sm-3">
                                        <h6>Shipment Date</h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].shipment_date ? moment(returnDetails['info'].shipment_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Return Date</h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].return_date ? moment(returnDetails['info'].return_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Payment Method</h6>
                                        <p>{returnDetails['info'] ? returnDetails['info'].payment_method : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Returned Product</h6>
                                        <p>{returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Exchanged Product</h6>
                                        <p>{returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="return-user-info">
                                            <h5>User Information</h5>
                                            {returnDetails['address'] ?
                                                <address>

                                                    {returnDetails['address'].firstname}<br />
                                                    {returnDetails['address'].lastname}<br />
                                                    {returnDetails['address'].street}<br />
                                                    {returnDetails['address'].postcode}<br />
                                                    {returnDetails['address'].city}<br />
                                                    {returnDetails['address'].region}<br />
                                                    {getCountryName(returnDetails['address'].country_id)}

                                                </address>
                                                : ""}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="return-user-total">
                                            <h5>Return Total</h5>
                                            <table className="table table-borderless mb-0">
                                                <tr>
                                                    <td>Subtotal</td>
                                                    <th className="text-end">$8,533</th>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <th className="text-end">$0</th>
                                                </tr>
                                                <tr className="r-tax">
                                                    <td>Tax</td>
                                                    <th className="text-end">$741</th>
                                                </tr>
                                                <tr className="tot-bor">
                                                    <th>Tax</th>
                                                    <th className="text-end fin-p">$9,274</th>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="container mb-5">
                            {returnDetails['items'] && returnDetails['items'].length > 0 && (
                                <ul className="order-pro-list">
                                    {returnDetails['items'].map((item, i) => {
                                        // console.log(item);
                                        return (<li key={i}>
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
                                                        {item.product_type === 'simple' ? "" : <p>One Size</p>}
                                                        <p><strong>Product no.</strong> {item.product_id}</p>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                                <p>{capitalize(item.item_condition)}</p>
                                            </div>
                                        </li>
                                        )
                                    })}
                                </ul>
                            )}
                            {returnDetails['items'] && returnDetails['items'].length > 3 && (
                                <div className="show-more-btn"><Link to="#" className="btn btn-secondary"><IntlMessages id="order.showMore" /></Link></div>
                            )}
                        </div>
                        <section className="return-foo">
                            <button>Confirm Return</button>
                        </section>

                    </div>
                </div>
            </div>
        </main >
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
)(RetunOrder);