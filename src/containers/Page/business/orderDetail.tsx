import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { getOrderDetail, getReturnDetail } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { Link } from "react-router-dom";
import { getCountryName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";

function VendorOrderDetail(props) {
    const { orderId }: any = useParams();
    const [returnDetails, setReturnDetails] = useState([])

    useEffect(() => {
        getOrderDetailFxn(orderId)
    }, [props.languages])

    async function getOrderDetailFxn(orderId) {
        let results: any = await getOrderDetail(orderId);
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
                            <h1>Order details</h1>
                            <h2>You can manage your client' order here.</h2>
                        </div>


                        <section>
                            <div className="return-det">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h5>Order number: #0055 (Payment status: Paid)</h5>
                                    </div>
                                    
                                    <div className="col-sm-3">
                                        <h6>Purchase date</h6>
                                        <p>Mon, 10 May 2021</p>
                                    </div>                                    
                                    <div className="col-sm-3">
                                        <h6>Payment method</h6>
                                        <p>Mastercard</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Delivery option</h6>
                                        <p>13</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="return-user-info">
                                            <h5>User Information</h5>
                                            <address>
                                                Ann Smith<br />
                                                Baker Street<br />
                                                40-333<br />
                                                London<br />
                                                Great Britain
                                            </address>
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
                    </div>
                </div>
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