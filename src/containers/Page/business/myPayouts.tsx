import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { InputNumber, Slider } from 'antd';
import moment from 'moment';
import searchIcon from '../../../image/Icon_zoom_in.svg';
import { getInvoice, getPayoutOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import { getCookie } from '../../../helpers/session';
import { capitalize } from '../../../components/utility/allutils';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Link } from "react-router-dom";


function MyPayouts(props) {
    const intl = useIntl();
    const [myOrder, setMyOrders] = useState([])
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
                <Link to={`/vendor/payoutdetails/${row.payout_id}`}>{row.price}</Link>
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
                <span className='green'>{capitalize(row.status)}</span>
            ),
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

    const columns2 = [
        {
            name: 'Subtotal',
            selector: row => row.subtotal,
        },
        {
            name: 'Commission',
            selector: row => row.commission,
        },
    ];
    const sortHandler = async (payoutId) => {
        let data: any = await getInvoice(payoutId);
      
        let response = []
        if(data && data.data.length > 0 && data.data[0]){
            response['Payout_info'] = data.data[0].Payout_info;
            response['Payout_orders'] = data.data[0].Payout_orders
            response['po_total'] = data.data[0].po_total
            response['selleraddress'] = data.data[0].selleraddress
        }
        setPayoutData(response)
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

    return (
        <div className="col-sm-9">
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
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchorderid" })} className="form-control me-1" onChange={getOrdersBySearchTerm} />
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
                            <td>{siteConfig.currency}{subtotal}</td>
                        </tr>
                        <tr>
                            <th><IntlMessages id="commission" /></th>
                            <td>{siteConfig.currency}{commission}</td>
                        </tr>

                        <tr>
                            <th><IntlMessages id="order.total" /></th>
                            <td>{siteConfig.currency}{totalP}</td>
                        </tr>
                    </tbody>
                </table>
                <br></br>
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
                    selectableRows
                    pagination={true}
                    onSelectedRowsChange={handleChange}
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