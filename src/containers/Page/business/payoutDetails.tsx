import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { connect } from 'react-redux'
import './deletepop.css';
import IntlMessages from "../../../components/utility/intlMessages";
import { getInvoice, getPayoutDetails } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import CLELogo from '../../../image/CLIlogo.png';
import moment from 'moment';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatprice } from '../../../components/utility/allutils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function MyPayoutDetails(props) {

    useEffect(() => {
        getDetails()
    }, [props.languages]);
    const { payoutId }: any = useParams();
    const [payoutData, setPayoutData] = useState({});
    const [payoutOrders, setPayoutOrders] = useState([]);
    const [invoiceData, setInvoiceData] = useState({});
    const [allData, setAlldata] = useState({})
    const [subtotal, setSubtotal] = useState(0)
    const [commission, setCommission] = useState(0)
    const [withdrawal, setWithdrawal] = useState(0)
    const [myPayoutDetails, setMyPayoutDetails] = useState([])
    const [page, setPage] = useState(3)
    const [dateOfRequest, setDateOfRequest] = useState('')
    const [dateOfPayment, setDateOfPayment] = useState('')
    const [numberOfOrders, setNumberOfOrders] = useState(0)
    const [billType, setBillType] = useState('')
    const [showRawPDF, setShowRawPDF] = useState(false)
    const [payoutDataInvoice, setPayoutDataInvoice] = useState([])

    async function getDetails() {
        let result: any = await getPayoutDetails(payoutId)
        //console.log("reult3",result);
        if (result && result.data[0]) {
            setAlldata(result.data[0])
            setPayoutData(result.data[0].PayoutData[0])
            setPayoutOrders(result.data[0].PayoutOrders)
            setInvoiceData(result.data[0].invoiceData)
            setSubtotal(result.data[0].subtotal)
            setCommission(result.data[0].commission)
            setWithdrawal(result.data[0].subtotal - result.data[0].commission)
            setDateOfRequest(moment(result.data[0].PayoutData[0].created_at).format('DD MMMM YYYY'))
            setNumberOfOrders(result.data[0].PayoutData[0].total_orders)
            if (result.data[0].invoiceData.invoiceDate) {
                setDateOfPayment(moment(result.data[0].invoiceData.invoiceDate).format('DD MMMM YYYY'))
            } else {
                setDateOfPayment('')
            }
        }

        let dataObj: any = result && result.data[0] && result.data[0].PayoutOrders ? result.data[0].PayoutOrders : []

        let dataListing = [];
        if (dataObj.length > 0) {
            //console.log("dataOj", dataObj)
            dataListing = dataObj.map(data => {
                //   /  console.log("data", data)
                let detailLoop: any = {};
                detailLoop.orderNumber = data.order_increment_id;
                detailLoop.link_to_orderdetails = data.link_to_orderdetails;
                detailLoop.date = moment(data.order_created_at).format('DD MMMM YYYY');
                detailLoop.total = data.amount.total_payout ? siteConfig.currency + ' ' + formatprice(data.amount.total_payout) : 0
                return detailLoop;
            })
        }
        setMyPayoutDetails(dataListing)

    }

    const columns = [{
        name: 'Order',
        selector: row => row.orderNumber,
    },
    {
        name: 'Date',
        selector: row => row.date,
    },
    {
        name: 'Link to order details',
        cell: row => (
            <Link to={`/vendor/sales-orders/${row.link_to_orderdetails}`}>View Order Detail</Link>

        )
    },
    {
        name: 'Total',
        selector: row => row.total,
    }
    ]


    const sortHandler = async (payoutId) => {
        let data: any = await getInvoice(payoutId);

        let response = []
        if (data && data.data.length > 0 && data.data[0]) {
            response['Payout_info'] = data.data[0].Payout_info;
            response['Payout_orders'] = data.data[0].Payout_orders
            response['po_total'] = data.data[0].po_total
            response['selleraddress'] = data.data[0].selleraddress
        }
        // console.log(response)
        setPayoutDataInvoice(response)
        setShowRawPDF(true)
        printDocument();
    };

    const printDocument = () => {
        const input = document.getElementById('pdfdiv');
        html2canvas(input)
            .then((canvas: any) => {
                var imgData = canvas.toDataURL("image/jpeg", 1);
                var pdf = new jsPDF("p", "px", "a4");
                var pageWidth = pdf.internal.pageSize.getWidth();
                var pageHeight = pdf.internal.pageSize.getHeight();
                var imageWidth = canvas.width;
                var imageHeight = canvas.height;

                // var ratio = imageWidth / imageHeight >= pageWidth / pageHeight ? pageWidth / imageWidth : pageHeight / imageHeight;
                //pdf = new jsPDF(this.state.orientation, undefined, format);
                //     console.log(imageWidth * ratio, imageHeight * ratio)
                pdf.addImage(imgData, 'JPEG', 20, 20, 400, 600);
                pdf.save("invoice.pdf");


            });
        setShowRawPDF(false);
    }
    return (
        <main>
            {showRawPDF && (
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
                                        <td>-</td>
                                        {/* <td>{payoutDataInvoice && payoutDataInvoice['Payout_info'] && payoutData['Payout_info'].length > 0 ? '#' + payoutDataInvoice['Payout_info'][0].payout_id : ""}</td> */}
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
                                        <td>{payoutDataInvoice && payoutDataInvoice['Payout_info'] && payoutDataInvoice['Payout_info'].length > 0 ? moment(payoutDataInvoice['Payout_info'][0].created_at).format('DD MMMM YYYY') : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>Due Date</td>
                                        <td>-</td>
                                        <td>{payoutDataInvoice && payoutDataInvoice['Payout_info'] && payoutDataInvoice['Payout_info'].length > 0 ? moment(payoutDataInvoice['Payout_info'][0].date_to).format('DD MMMM YYYY') : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td>-</td>
                                        <td>{payoutDataInvoice && payoutDataInvoice['Payout_info'] && payoutDataInvoice['Payout_info'].length > 0 ? payoutDataInvoice['Payout_info'][0].payout_status : ""}</td>
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
                                    <th style={{ "textAlign": "right", "backgroundColor": "#ddd" }}>Seller</th>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Name</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>-</td>
                                    <th style={{ "textAlign": "left" }}>اسم</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>-</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Address Line 1</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].street : ""}</td>
                                    <th style={{ "textAlign": "left" }}>العنوان السطر 1</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].street : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Region</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].region : ""}</td>
                                    <th style={{ "textAlign": "left" }}>منطقة</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].region : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>City</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].city : ""}</td>
                                    <th style={{ "textAlign": "left" }}>مدينة</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].city : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Country</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].countryName : ""}</td>
                                    <th style={{ "textAlign": "left" }}>دولة</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].countryName : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Zip</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].zip : ""}</td>
                                    <th style={{ "textAlign": "left" }}>أزيز</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutDataInvoice && payoutDataInvoice['selleraddress'] ? payoutDataInvoice['selleraddress'].zip : ""}</td>
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
                                {payoutDataInvoice && payoutDataInvoice['Payout_orders'] && payoutDataInvoice['Payout_orders'].length > 0 && payoutDataInvoice['Payout_orders'].map((data, index) => {
                                    // console.log(data)
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.order_increment_id}</td>
                                            <td>{data.invoice_id}</td>
                                            <td>{data.invoice_created_at ? moment(data.invoice_created_at).format('DD MMMM YYYY') : ''}</td>
                                            <td>{data.invoice_status}</td>
                                            <td>{data.order_amount.subtotal}</td>
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
                                    <td>{payoutDataInvoice && payoutDataInvoice['Payout_info'] && payoutDataInvoice['Payout_info'].length > 0 ? payoutDataInvoice['Payout_info'][0].total_orders : ""}</td>
                                    <td>{siteConfig.currency} {payoutDataInvoice && payoutDataInvoice['Payout_info'] && payoutDataInvoice['Payout_info'].length > 0 ? payoutDataInvoice['Payout_info'][0].payment_paid : ""}</td>
                                    <td>{siteConfig.currency} {payoutDataInvoice && payoutDataInvoice['Payout_info'] && payoutDataInvoice['Payout_info'].length > 0 ? payoutDataInvoice['Payout_info'][0].total_payment : ""}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p>Notes:</p>
                        <p>Thanks you for the payment . You just made our day.</p>
                    </section>
                    <br />
                    <br />

                </div>

            )}
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1><IntlMessages id="payout.detail" /></h1>
                            <h2><IntlMessages id="payoutdetail.description" /></h2>
                        </div>
                        <section>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="dateofrequest" /></h6>
                                                    <p>{dateOfRequest}</p>
                                                </div>

                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="dateofpayment" /></h6>
                                                    <p>{dateOfPayment}</p>
                                                </div>


                                            </div>
                                            <div className="row">

                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="i/r" /></h6>
                                                    <p>{billType}</p>
                                                </div>

                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="nooforders" /></h6>
                                                    <p>{numberOfOrders}</p>
                                                </div>


                                            </div>
                                            <div className="row">

                                                <div className="col-sm-12">
                                                    <Link to="#" onClick={() => sortHandler(payoutId)}>
                                                        Download invoice/receipt</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="">
                                            <table className="table table-borderless payout">
                                                <thead><IntlMessages id="withdrawalamount" /></thead>
                                                <tbody>
                                                    <tr>
                                                        <td><IntlMessages id="subtotal" /></td>
                                                        <th className="text-end">{siteConfig.currency}{formatprice(subtotal)}</th>
                                                    </tr>
                                                    <tr>
                                                        <td><IntlMessages id="commission" /></td>
                                                        <th className="text-end">-{siteConfig.currency}{formatprice(commission)}</th>
                                                    </tr>

                                                    <tr>
                                                        <th className="bor-top-2"><IntlMessages id="withdrawal" /></th>
                                                        <th className="bor-top-2 text-end dark-co">{siteConfig.currency}{formatprice(withdrawal)}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="mb-5">

                            <DataTable
                                columns={columns}
                                data={myPayoutDetails}
                            />
                        </div>


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

    };
}

export default connect(
    mapStateToProps
)(MyPayoutDetails);