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
import { capitalize, checkVendorLogin, formatprice } from '../../../components/utility/allutils';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LoaderGif from '../Loader';


function MyPayouts(props) {
    const [vendorName, setVendorName] = useState('')
    const intl = useIntl();
    const [myOrder, setMyOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [accBalance, setAccBalance] = useState([])
    const [range, setRange] = useState({ low: 0, high: 20000 })
    const [status, setStatus] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [subtotal, setSubtotal] = useState(0);
    const [commission, setCommission] = useState(0)
    const [totalP, setTotalP] = useState(0)
    const [showRawPDF, setShowRawPDF] = useState(false)
    const [payoutData, setPayoutData] = useState([])

    useEffect(() => {
        getVendor()
        getDataOfPayouts()
        return (
            setMyOrders([])
        )
    }, [])

    async function getVendor() {
        let vendor: any = await checkVendorLogin();
        setVendorName(vendor.vendor_name);
    }
    const getOrdersByStatus = (e) => { //Status filter is applied by changing the value of status and calling getDataOfPayouts
        const { value } = e.target;
        setStatus(value)
        getDataOfPayouts(dateFilter.from, dateFilter.to, e.target.value, range.low, range.high, searchTerm, sortOrder)
    }

    const getOrdersByDate = (start, end, label) => {//Date filter is applied by changing the value of to and from dates and calling getDataOfPayouts
        let from = moment(start).format("MM/DD/YYYY"), to = moment(end).format("MM/DD/YYYY");
        if (label === 'All') {
            setDateFilter(prevState => ({
                ...prevState,
                from: '',
                to: ''
            }))
            getDataOfPayouts('', '', status, range.low, range.high, searchTerm, sortOrder)
        } else {
            setDateFilter(prevState => ({
                ...prevState,
                from: from,
                to: to
            }))
            getDataOfPayouts(from, to, status, range.low, range.high, searchTerm, sortOrder)
        }


    }

    const getOrdersByPrice = async (range) => {//Price filter is applied by changing the value of to and from price and calling getDataOfPayouts
        let from = range[0];
        let to = range[1];
        setRange(prevState => ({
            ...prevState,
            low: from,
            high: to
        }))
        getDataOfPayouts(dateFilter.from, dateFilter.to, status, from, to, searchTerm, sortOrder)
    }

    const setSort = async (e) => {//Sorting of orders is done by changing the value of sortOrder and calling getDataOfPayouts
        setSortOrder(e.target.value)
        getDataOfPayouts(dateFilter.from, dateFilter.to, status, range.low, range.high, searchTerm, e.target.value)
    }
    const getOrdersBySearchTerm = async (e) => {// Search is done on the basis of search text(if length of text is >=3) and calling getDataOfPayouts
        if (e.target.value.length >= 3) {
            setSearchTerm(e.target.value);
        }
        else {
            setSearchTerm("");
        }
        getDataOfPayouts(dateFilter.from, dateFilter.to, status, range.low, range.high, e.target.value, sortOrder)
    }

    const columns = [//columns are defined here  data table  of my payouts
        {
            name: intl.formatMessage({ id: 'id' }),
            selector: row => row.payout_id,
            button: true,
            cell: row => {
                return (<Link to={`/vendor/payoutdetails/${row.payout_id}`}>{row.payout_id}</Link>
                )
            }

        },
        {
            name: intl.formatMessage({ id: 'price' }),
            selector: row => row.price,
            button: true,
            cell: row => {
                let formatPrice = formatprice(row.price);
                return (<Link to={`/vendor/payoutdetails/${row.payout_id}`}>{formatPrice}</Link>
                )
            }

        },
        {
            name: intl.formatMessage({ id: 'order.date' }),
            selector: row => row.date,
        },
        {
            name: intl.formatMessage({ id: 'status' }),
            selector: row => row.status,
            cell: row => (
                <div>
                    {row.status === "scheduled" ? <span className="scheduled">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}
                    {row.status === "pending" ? <span className="pending">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}
                    {row.status === "processing" ? <span className="processing">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}
                    {row.status === "hold" ? <span className="hold">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}
                    {row.status === "paypal_ipn" ? <span className="paypal_ipn">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}
                    {row.status === "paid" ? <span className="paid">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}

                    {row.status === "error" ? <span className="error">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}

                    {row.status === "canceled" ? <span className="canceled">{intl.formatMessage({ id: capitalize(row.status) })}</span> : ""}
                </div>
            )
        },
        {
            name: <i className="fa fa-file-alt" aria-hidden="true"></i>,
            selector: row => row.data,
            cell: row => {

                if (row.data.payout_status === 'paid') {
                    return (
                        <p onClick={() => sortHandler(row.data.payout_id)}>
                            <i className="fa fa-file-alt" aria-hidden="true"></i> {intl.formatMessage({ id: 'Invoice' })}</p>
                    )
                }
            }

        },
    ];

    const paginationComponentOptions = {
        noRowsPerPage: true,
    };
    const sortHandler = async (payoutId) => {//calls method which is hitting API to get the invoice data from backend.
        let data: any = await getInvoice(payoutId);

        let response = []
        if (data && data.data.length > 0 && data.data[0]) {
            response['Payout_info'] = data.data[0].Payout_info;
            response['Payout_orders'] = data.data[0].Payout_orders
            response['po_total'] = data.data[0].po_total
            response['selleraddress'] = data.data[0].selleraddress
        }
        setPayoutData(response)
        setShowRawPDF(true)
        printDocument();
    };
    async function getDataOfPayouts(date_from: any = '', date_to: any = '', stat: any = '', frPrice: any = '', toPrice: any = '', term: any = '', sort_order: any = '') { // to get the detail of payouts so that we can set in data table and also other parameters like subtotal and commission on this page
        let page_size = siteConfig.pageSize;
        setIsLoading(true)
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
        setIsLoading(false);
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
    const printDocument = () => {// function to create pdf for invoice data coming from backend
        const input = document.getElementById('pdfdiv');
        html2canvas(input)
            .then((canvas: any) => {
                var imgData = canvas.toDataURL("image/jpeg", 1);
                var pdf = new jsPDF("p", "px", "a4");
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
                                        <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 && payoutData['Payout_info']?.[0]?.created_at ? moment(payoutData['Payout_info'][0].created_at).format('DD MMMM YYYY') : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>Due Date</td>
                                        <td>-</td>
                                        <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 && payoutData['Payout_info']?.[0]?.date_to ? moment(payoutData['Payout_info']?.[0]?.date_to).format('DD MMMM YYYY') : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td>-</td>
                                        <td>{payoutData && payoutData['Payout_info'] && payoutData['Payout_info'].length > 0 ? capitalize(payoutData['Payout_info'][0].payout_status) : ""}</td>
                                    </tr>
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
                                    <td style={{ "textAlign": "right" }}>{vendorName}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Address Line 1</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].street : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Region</th>
                                    <td style={{ "textAlign": "center" }}>-</td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].region : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>City</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].city : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Country</th>
                                    <td style={{ "textAlign": "center" }}></td>
                                    <td style={{ "textAlign": "right" }}>{payoutData && payoutData['selleraddress'] ? payoutData['selleraddress'].countryName : ""}</td>
                                </tr>
                                <tr>
                                    <th style={{ "textAlign": "left" }}>Zip</th>
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
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.order_increment_id}</td>
                                            <td>{data.invoice_id}</td>
                                            <td>{data?.invoice_created_at ? moment(data.invoice_created_at).format('DD MMM YYYY') : ""}</td>
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

                        <p>{intl.formatMessage({ id: 'Notes' })}:</p>
                        <p>{intl.formatMessage({ id: 'thanksforpayment' })}</p>
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
                                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
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
                                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
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
                                                },
                                                locale: {
                                                    format: "DD/MM/YYYY"
                                                }
                                            }}
                                        >
                                            <input type="text" className="form-control" />
                                        </DateRangePicker>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
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
                                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
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

                    <div className="clearfix"></div>
                    <div className="border p-3">
                        <table className="table table-borderless payout">
                            <thead><IntlMessages id="account.balance" /></thead>
                            <tbody>
                                <tr>
                                    <td><IntlMessages id="order.subTotal" /></td>
                                    <th className="text-end">{siteConfig.currency}{formatprice(subtotal)}</th>
                                </tr>
                                <tr>
                                    <td><IntlMessages id="commission" /></td>
                                    <th className="text-end">-{siteConfig.currency}{formatprice(commission)}</th>
                                </tr>

                                <tr>
                                    <th className="bor-top-2"><IntlMessages id="order.total" /></th>
                                    <td className="bor-top-2 text-end dark-col">{siteConfig.currency}{formatprice(totalP)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

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

                    <div className="tbl-payout">
                        <DataTable
                            columns={columns}
                            data={myOrder}
                            pagination={true}
                            progressPending={isLoading}
                            progressComponent={<LoaderGif />}
                            paginationComponentOptions={paginationComponentOptions}
                        />
                    </div>
                </div>
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