import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { InputNumber, Slider } from 'antd';
import CLELogo from '../../../image/CLIlogo.png';
import moment from 'moment';
import searchIcon from '../../../image/Icon_zoom_in.svg';
import { getInvoice, getPayoutOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import { getCookie } from '../../../helpers/session';
import { capitalize, formatprice } from '../../../components/utility/allutils';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


function MyPayouts(props) {
    const intl = useIntl();
    const [myOrder, setMyOrders] = useState([])
    const ref = useRef();
    const [accBalance, setAccBalance] = useState([])
    const [range, setRange] = useState({ low: 0, high: 0 })
    const [status, setStatus] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDates, setToDates] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [commission, setCommission] = useState(0)
    const [totalP, setTotalP] = useState(0)
    const [showRawPDF, setShowRawPDF] = useState(false)
    const [payoutData, setPayoutData] = useState([])

    useEffect(() => {
        getDataOfPayouts()
        return (
            setMyOrders([])
        )


    }, [])
    const getOrdersByStatus = (e) => {
        const { value } = e.target;
        setStatus(value)
        getDataOfPayouts(fromDate, toDates, e.target.value, range.low, range.high, searchTerm, sortOrder)
    }

    const getOrdersByDate = (start, end, label) => {
        let dateFrom = moment(start).format("MM/DD/YYYY")
        let dateTo = moment(end).format("MM/DD/YYYY");
        setFromDate(dateFrom);
        setToDates(dateTo);
        getDataOfPayouts(dateFrom, dateTo, status, range.low, range.high, searchTerm, sortOrder)
    }

    const getOrdersByPrice = async (range) => {
        let from = range[0];
        let to = range[1];
        setRange(prevState => ({
            ...prevState,
            low: from,
            high: to
        }))
        getDataOfPayouts(fromDate, toDates, status, from, to, searchTerm, sortOrder)
    }

    const setSort = async (e) => {
        setSortOrder(e.target.value)
        getDataOfPayouts(fromDate, toDates, status, range.low, range.high, searchTerm, e.target.value)
    }
    const getOrdersBySearchTerm = async (e) => {
        if (e.target.value.length >= 3) {
            setSearchTerm(e.target.value);
        }
        else {
            setSearchTerm("");
        }
        getDataOfPayouts(fromDate, toDates, status, range.low, range.high, e.target.value, sortOrder)
    }

    const columns = [
        {
            name: 'Price',
            selector: row => row.price,
            button: true,
            cell: row => (
                <Link to={`/vendor/payoutdetails/${row.payout_id}`}>{row.price ? formatprice(row.price) : 0}</Link>
            )

        },
        {
            name: 'Date',
            selector: row => row.date,
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => (
                // <span className='green'>{capitalize(row.status)}</span>
                <div>
                    {row.status === "scheduled" ? <span className="scheduled">{capitalize(row.status)}</span> : ""}
                    {row.status === "pending" ? <span className="pending">{capitalize(row.status)}</span> : ""}
                    {row.status === "processing" ? <span className="processing">{capitalize(row.status)}</span> : ""}
                    {row.status === "hold" ? <span className="hold">{capitalize(row.status)}</span> : ""}
                    {row.status === "paypal_ipn" ? <span className="paypal_ipn">{capitalize(row.status)}</span> : ""}
                    {row.status === "paid" ? <span className="paid">{capitalize(row.status)}</span> : ""}

                    {row.status === "error" ? <span className="error">{capitalize(row.status)}</span> : ""}

                    {row.status === "canceled" ? <span className="canceled">{capitalize(row.status)}</span> : ""}
                </div>
            )
        },
        { // To change column
            name: <i className="fa fa-file-alt" aria-hidden="true"></i>,
            selector: row => row.data,
            cell: row => {

                if (row.data.payout_status === 'paid') {
                    return (
                        <p onClick={() => sortHandler(row.data.payout_id)}>
                            <i className="fa fa-file-alt" aria-hidden="true"></i> Invoice</p>
                    )
                }
            }

        },
    ];


    const sortHandler = async (payoutId) => {
        let data: any = await getInvoice(payoutId);

        let response = []
        if (data && data.data.length > 0 && data.data[0]) {
            response['Payout_info'] = data.data[0].Payout_info;
            response['Payout_orders'] = data.data[0].Payout_orders
            response['po_total'] = data.data[0].po_total
            response['selleraddress'] = data.data[0].selleraddress
        }
        console.log(response)
        setPayoutData(response)
        setShowRawPDF(true)
        printDocument();
    };
    async function getDataOfPayouts(date_from: any = '', date_to: any = '', stat: any = '', frPrice: any = '', toPrice: any = '', term: any = '', sort_order = 'asc') {
        let page_size = siteConfig.pageSize;

        let result: any = await getPayoutOrders(date_from, date_to, stat, frPrice, toPrice, page_size, sort_order, term)
        let dataObj = result && result.data[0] && result.data[0].OrderData.length > 0 ? result.data[0].OrderData : [];
        let dataLListing = [];
        if (dataObj.length > 0) {
            dataLListing = dataObj.map((data) => {
                let orderLoop: any = {};
                orderLoop.price = siteConfig.currency + data.total_payout;
                orderLoop.status = data.payout_status;
                orderLoop.date = moment(data.created_at).format('DD MMMM YYYY');
                orderLoop.payout_id = data.payout_id;
                orderLoop.data = data;
                return orderLoop;
            });
        }
        setMyOrders(dataLListing)
        let dataObj2 = result && result.data[0] ? result.data[0] : {};
        let dataLListing2 = [];
        dataLListing2 = [{
            subtotal: dataObj2.subtotal,
            commission: dataObj2.commission,
        }]
        setAccBalance(dataLListing2)
        if (dataLListing2[0].subtotal) setSubtotal(dataLListing2[0].subtotal)
        if (dataLListing2[0].commission) setCommission(dataLListing2[0].commission)
        if (dataLListing2[0].subtotal && dataLListing2[0].commission) setTotalP(dataLListing2[0].subtotal - dataLListing2[0].commission)


    }

    const handleChange = ({ selectedRows }) => {
        console.log('Selected Rows: ', selectedRows);
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

                var ratio = imageWidth / imageHeight >= pageWidth / pageHeight ? pageWidth / imageWidth : pageHeight / imageHeight;
                //pdf = new jsPDF(this.state.orientation, undefined, format);
                //     console.log(imageWidth * ratio, imageHeight * ratio)
                pdf.addImage(imgData, 'JPEG', 20, 20, 400, 600);
                pdf.save("invoice.pdf");


            });
        setShowRawPDF(false);
    }

    return (
        <div className="col-sm-9">
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
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].street : ""}</td>
                                    <th style={{ "textAlign": "left" }}>العنوان السطر 1</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].street : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Region</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].region : ""}</td>
                                    <th style={{ "textAlign": "left" }}>منطقة</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].region : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>City</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].city : ""}</td>
                                    <th style={{ "textAlign": "left" }}>مدينة</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].city : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Country</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].countryName : ""}</td>
                                    <th style={{ "textAlign": "left" }}>دولة</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].countryName : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Zip</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].zip : ""}</td>
                                    <th style={{ "textAlign": "left" }}>أزيز</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].zip : ""}</td>
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
                                            <td>{moment(data.invoice_created_at).format('DD MMMM YYYY')}</td>
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

            )}
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="vendor.mypayouts" /></h1>
                            <p><IntlMessages id="payout.description" /></p>
                        </div>
                    </div>
                    <div className="range_slider">
                        <div className="range_inner">
                            <div className="row">
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="status" /></span>
                                        <select className="form-select" aria-label="Default select example" value={status} onChange={getOrdersByStatus}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="pending">{intl.formatMessage({ id: "product.pending" })}</option>
                                            <option value="scheduled">{intl.formatMessage({ id: "payout.scheduled" })}</option>
                                            <option value="processing">{intl.formatMessage({ id: "payout.processing" })}</option>
                                            <option value="hold">{intl.formatMessage({ id: "payout.hold" })}</option>
                                            <option value="paypal_ipn">{intl.formatMessage({ id: "payout.paypal_ipn" })}</option>
                                            <option value="paid">{intl.formatMessage({ id: "payout.paid" })}</option>
                                            <option value="error">{intl.formatMessage({ id: "payout.error" })}</option>
                                            <option value="canceled">{intl.formatMessage({ id: "payout.cancelled" })}</option>

                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.date" /></span>
                                        <DateRangePicker
                                            onCallback={getOrdersByDate}
                                            initialSettings={{
                                                startDate: moment(),
                                                endDate: moment(),
                                                ranges: {
                                                    'All': "",
                                                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                                }
                                            }}
                                        >
                                            <input type="text" className="form-control" />
                                        </DateRangePicker>
                                        {/* <span className="form-label"><IntlMessages id="order.date" /></span>
                                        <select className="form-select" aria-label="Default select example" onChange={}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select> */}
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-2">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.price" /></span>
                                        <div className='pricerangeouter' >
                                            <InputNumber
                                                min={1}
                                                max={20000}
                                                readOnly={true}
                                                value={range.low}
                                                onChange={getOrdersByPrice}
                                            />
                                            <span>-</span>
                                            <InputNumber
                                                min={1}
                                                max={20000}
                                                readOnly={true}
                                                value={range.high}
                                                onChange={getOrdersByPrice}
                                            />
                                        </div>
                                        <Slider range max={20000} defaultValue={[range.low, range.high]} onAfterChange={getOrdersByPrice} />
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src={searchIcon} alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchPlaceholder" })} className="form-control me-1" onChange={getOrdersBySearchTerm} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <table>
                    <thead><IntlMessages id="account.balance" /></thead>
                    <tbody>
                        <tr>
                            <th><IntlMessages id="order.subTotal" /></th>
                            <td>{siteConfig.currency}{subtotal ? formatprice(subtotal) : 0}</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="commission" /></th>
                            <td>-{siteConfig.currency}{commission ? formatprice(commission) : 0}</td>
                        </tr>

                        <tr>
                            <th><IntlMessages id="order.total" /></th>
                            <td>{siteConfig.currency}{totalP ? formatprice(totalP) : 0}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className="row">
                    <div className="float-right">
                        <div className="sort_by">
                            <div className="sortbyfilter">
                                <select value={sortOrder} onChange={setSort} className="form-select customfliter" aria-label="Default select example">
                                    <option value="">{intl.formatMessage({ id: "sorting" })}</option>
                                    <option value="asc">{intl.formatMessage({ id: "filterPriceAsc" })}</option>
                                    <option value="desc">{intl.formatMessage({ id: "filterPriceDesc" })}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={myOrder}
                    // selectableRows
                    pagination={true}
                // onSelectedRowsChange={handleChange}
                />
            </section>

        </div>

    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(MyPayouts);