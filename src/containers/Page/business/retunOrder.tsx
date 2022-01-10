import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { getReturnDetail } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { Link } from "react-router-dom";
import { getCountryName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";

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
            <section className="order-detail-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="order-detail-head">
                                <h2>Return Details</h2>
                                <p>We get it, sometimes something just doesn't work for you and you want your
                                    money back. You can return your products here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <p>Order Number : {returnDetails['info'] ? returnDetails['info'].rma_id : ""}</p>
            <p>Purchase Date : {returnDetails['info'] && returnDetails['info'].purchase_date ? moment(returnDetails['info'].purchase_date).format('ddd DD MMMM YYYY') : ""}</p>
            <p>Shipment Date : {returnDetails['info'] && returnDetails['info'].shipment_date ? moment(returnDetails['info'].shipment_date).format('ddd DD MMMM YYYY') : ""}</p>
            <p>Return Date : {returnDetails['info'] && returnDetails['info'].return_date ? moment(returnDetails['info'].return_date).format('ddd DD MMMM YYYY') : ""}</p>
            <p>Payment Method: {returnDetails['info'] ? returnDetails['info'].payment_method : ""}</p>
            <p>Returned Product: {returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
            <p>Exchanged Product: {returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
            <div>
                User Information:
                {returnDetails['address'] ?
                    <div>

                        {returnDetails['address'].firstname}
                        {returnDetails['address'].lastname}
                        {returnDetails['address'].street}
                        {returnDetails['address'].postcode}
                        {returnDetails['address'].city}
                        {returnDetails['address'].region}
                        {getCountryName(returnDetails['address'].country_id)}

                    </div>
                    : ""}
            </div>
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
                                        <p>{item.item_condition}</p>
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
)(RetunOrder);