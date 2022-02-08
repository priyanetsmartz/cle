import React, { useEffect, useState } from 'react';
import CLELogo from '../../../image/CLIlogo.png';
import moment from 'moment';
import { sessionService } from 'redux-react-session';
import { siteConfig } from '../../../settings';

function PdfDocument(props) {
    const [payoutData, setPayoutData] = useState({});
    const [vendorName, setVendorName] = useState('')
    useEffect(() => {
        getVendor()
        setPayoutData(props.data)
    }, [props.languages]);
    async function getVendor() {
        let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
        setVendorName(vendor.vendor_name);
    }
    return (
            <div className="main-wrapper" id="pdfdiv" style={{ "width": "80%", "margin": " 0 auto" }}>
                <div className="header">
                    <img src={CLELogo} alt="cle-logo" style={{ "display": "block", "margin": "0 auto", "width": "120px" }} />
                    <p style={{ "textAlign": "center" }}>Tax Invoice</p>
                </div>
                <br />
                <br />

                <div className="head-main" style={{ "overflow": "auto" }}>
                    <div style={{ "float": "left", "width": "50%" }}>
                        <table style={{ "width": "100%", "textAlign": "left", "borderWidth": "1px" }} cellPadding="5" cellSpacing="5">
                            <table>
                                <tr>
                                    <td>Invoice#</td>
                                    <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? '#' + payoutData['Payout_info'][0].payout_id : ""}</td>
                                </tr>
                            </table>
                        </table>
                        <br />
                        <br />
                        <br />
                        <table style={{ "width": "100%", "textAlign": "left", "borderWidth": "1px" }} cellPadding="5" cellSpacing="5">
                            <table>
                                <tr>
                                    <td>Invoice Issue Date</td>
                                    <td>-</td>
                                    <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? moment(payoutData['Payout_info'][0].created_at).format('DD MMMM YYYY') : ""}</td>
                                </tr>
                                <tr>
                                    <td>Due Date</td>
                                    <td>-</td>
                                    <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? moment(payoutData['Payout_info'][0].date_to).format('DD MMMM YYYY') : ""}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>-</td>
                                    <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? payoutData['Payout_info'][0].payout_status : ""}</td>
                                </tr>
                                {/* <tr>
                          <td>P.O.#</td>
                          <td>-</td>
                          <td>-</td>
                      </tr> */}
                            </table>
                        </table>
                    </div>
                    <div style={{ "float": "left", "width": "50%" }}></div>
                </div>
                <br />
                <br />

                <section>
                    <table style={{ "width": "100%", "borderWidth": "1px" }} cellPadding="5" cellSpacing="5">
                        <tbody>
                            <tr>
                                <th style={{ "textAlign": "left", "backgroundColor": "#ddd" }} colSpan={5}>Seller</th>
                                <th style={{ "textAlign": "right", "backgroundColor": "#ddd" }}></th>
                            </tr>
                            <tr>
                                <th style={{ "textAlign": "left" }}>Name</th>
                                <td style={{ "textAlign": "center" }}></td>
                                {/* <td style={{ "textAlign": "right" }}>-</td>
                      <th style={{ "textAlign": "left" }}>اسم</th>
                      <td style={{ "textAlign": "center" }}>-</td> */}
                                <td style={{ "textAlign": "right" }}>{vendorName}</td>
                            </tr>
                            <tr>
                                <th style={{ "textAlign": "left" }}>Address Line 1</th>
                                <td style={{ "textAlign": "center" }}></td>
                                <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].street : ""}</td>
                                {/* <th style={{ "textAlign": "left" }}>العنوان السطر 1</th>
                      <td style={{ "textAlign": "center" }}></td>
                      <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].street : ""}</td> */}
                            </tr>
                            <tr>
                                <th style={{ "textAlign": "left" }}>Region</th>
                                <td style={{ "textAlign": "center" }}>-</td>
                                <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].region : ""}</td>
                                {/* <th style={{ "textAlign": "left" }}>منطقة</th>
                      <td style={{ "textAlign": "center" }}>-</td>
                      <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].region : ""}</td> */}
                            </tr>
                            <tr>
                                <th style={{ "textAlign": "left" }}>City</th>
                                <td style={{ "textAlign": "center" }}></td>
                                <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].city : ""}</td>
                                {/* <th style={{ "textAlign": "left" }}>مدينة</th>
                      <td style={{ "textAlign": "center" }}></td>
                      <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].city : ""}</td> */}
                            </tr>
                            <tr>
                                <th style={{ "textAlign": "left" }}>Country</th>
                                <td style={{ "textAlign": "center" }}></td>
                                <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].countryName : ""}</td>
                                {/* <th style={{ "textAlign": "left" }}>دولة</th>
                      <td style={{ "textAlign": "center" }}></td>
                      <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].countryName : ""}</td> */}
                            </tr>
                            <tr>
                                <th style={{ "textAlign": "left" }}>Zip</th>
                                <td style={{ "textAlign": "center" }}>-</td>
                                <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].zip : ""}</td>
                                {/* <th style={{ "textAlign": "left" }}>أزيز</th>
                      <td style={{ "textAlign": "center" }}>-</td>
                      <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].zip : ""}</td> */}
                            </tr>

                        </tbody>
                    </table>
                </section>
                <br />
                <br />

                <section>
                    <table style={{ "width": "100%", "textAlign": "center", "borderWidth": "1px" }} cellPadding="5" cellSpacing="5">
                        <tbody>
                            <tr>
                                <th style={{
                                    "backgroundColor": "#ddd", "textAlign": "left"
                                }} colSpan={3}>Line Items</th>
                                <th style={{ "backgroundColor": "#ddd", "textAlign": "right" }} colSpan={3}>Items</th>
                            </tr>
                            <tr>
                                <th style={{ "backgroundColor": "#ddd" }}>#</th>
                                <th style={{ "backgroundColor": "#ddd" }}>Order Id </th>
                                <th style={{ "backgroundColor": "#ddd" }}>Invoice Id</th>
                                <th style={{ "backgroundColor": "#ddd" }}>Invoice Created</th>
                                <th style={{ "backgroundColor": "#ddd" }}>Invoice Status</th>
                                <th style={{ "backgroundColor": "#ddd" }}>Order Amount</th>
                            </tr>
                            {payoutData && payoutData['Payout_orders'] && payoutData['Payout_orders'].length > 0 && payoutData['Payout_orders'].map((data, index) => {
                                // console.log(data)
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.order_increment_id}</td>
                                        <td>{data.invoice_id}</td>
                                        <td>{moment(data.invoice_created_at).format('DD MMM YYYY')}</td>
                                        <td>{data.invoice_status}</td>
                                        <td>{siteConfig.currency} {data.order_amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                </section>
                <br />
                <br />


                <section>

                    <table style={{ "width": "100%", "textAlign": "center", "borderWidth": "1px" }} cellPadding="5" cellSpacing="5">
                        <tbody>
                            <tr>
                                <th style={{
                                    "backgroundColor": "#ddd", "textAlign": "left"
                                }} colSpan={3}>Total Amount</th>
                                <th style={{ "backgroundColor": "#ddd", "textAlign": "right" }} colSpan={3}></th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>Total Orders</th>
                                <th>Total Paid</th>
                                <th>Total Payment</th>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? payoutData['Payout_info'][0].total_orders : ""}</td>
                                <td>{siteConfig.currency} {payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? payoutData['Payout_info'][0].payment_paid : ""}</td>
                                <td>{siteConfig.currency} {payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? payoutData['Payout_info'][0].total_payment : ""}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>Notes:</p>
                    <p>Thanks you for the payment . You just made our day.</p>
                </section>
                <br />
                <br />

            </div>
    );
}

export default PdfDocument;