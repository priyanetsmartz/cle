import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { InputNumber, Slider } from 'antd';
import moment from 'moment';
import { Link } from "react-router-dom";
import searchIcon from '../../../image/Icon_zoom_in.svg';
import { getVendorOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { formatprice } from '../../../components/utility/allutils';


function MySalesOrders(props) {
    const intl = useIntl();
    const [myOrder, setMyOrders] = useState([])
    const [sortOrder, setSortOrder] = useState('');
    const [range, setRange] = useState({ low: 0, high: 0 })
    const [status, setStatus] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    useEffect(() => {
        getDataOfOrders()
        return (
            setMyOrders([])
        )

    }, [props.languages])

    async function getDataOfOrders(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {
        let result: any = await getVendorOrders(props.languages, siteConfig.pageSize, status, from, to, term, dateFrom, dateTo, sortorder)
        let dataObj = result && result.data && result.data.length > 0 && result.data[0] && result.data[0].OrderArray ? result.data[0].OrderArray : [];
        let dataLListing = []
        if (dataObj.length > 0) {
            dataLListing = dataObj.map((data, index) => {
                let orderLoop: any = {};
                let price = data.total ? formatprice(data.total) : 0;
                orderLoop.increment_id = data.increment_id;
                orderLoop.status = data.status;
                orderLoop.date = moment(data.created_at).format('DD MMMM YYYY');
                orderLoop.total = price;
                return orderLoop;
            });
        }
        setMyOrders(dataLListing)

    }

    const getOrdersByStatus = async (e) => {
        const { value } = e.target;
        setStatus(value)
        getDataOfOrders(value, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const datePickerCallback = async (start, end, label) => {
        console.log(moment(start).format("MM/DD/YYYY"), moment(end).format("MM/DD/YYYY"), label);
        let from = moment(start).format("MM/DD/YYYY"), to = moment(end).format("MM/DD/YYYY");
        if (label === 'All') {
            setDateFilter(prevState => ({
                ...prevState,
                from: '',
                to: ''
            }))
            getDataOfOrders(status, range.low, range.high, searchTerm, '', '', sortOrder)
        } else {
            setDateFilter(prevState => ({
                ...prevState,
                from: from,
                to: to
            }))
            getDataOfOrders(status, range.low, range.high, searchTerm, from, to, sortOrder)
        }
    }

    const getOrdersByPrice = async (range) => {
        let from = range[0];
        let to = range[1];
        setRange(prevState => ({
            ...prevState,
            low: from,
            high: to
        }))
        getDataOfOrders(status, from, to, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const getOrdersBySearchTerm = async (e) => {
        if (e.target.value.length >= 3) {
            setTimeout(() => {
                setSearchTerm(e.target.value)
            }, 3000)
        } else {
            setSearchTerm("")
        }
        getDataOfOrders(status, range.low, range.high, e.target.value, dateFilter.from, dateFilter.to, sortOrder)
    }

    const sortOrdersHandler = async (e) => {
        setSortOrder(e.target.value);
        getDataOfOrders(status, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, e.target.value)
    }

    const columns = [
        {
            name: 'Order',
            selector: row => row.increment_id,
            sortable: true,
            cell: row => (
                <Link to={`/vendor/sales-orders/${row.increment_id}`}>{row.increment_id}</Link>

            )
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                // <span className='green'>{row.status}</span>

                <div>
                    {row.status === "Ready to Ship" ? <span className="ready-to-ship">{row.status}</span> : ""}
                    {row.status === "Canceled" ? <span className="canceled">{row.status}</span> : ""}
                    {row.status === "Shipped" ? <span className="shipped">{row.status}</span> : ""}
                    {row.status === "Pending" ? <span className="pending">{row.status}</span> : ""}
                    {row.status === "Delivered" ? <span className="delivered">{row.status}</span> : ""}
                    {row.status === "Returned" ? <span className="returned">{row.status}</span> : ""}

                </div>
            )
        },
        {
            name: 'Total',
            selector: row => row.total ? siteConfig.currency + ' ' + row.total : 0,
        },
    ];


    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="salesOrder.title" /></h1>
                            <p><IntlMessages id="salesOrder.description.1" /><br /><IntlMessages id="salesOrder.description.2" /></p>
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
                                            <option value="0">{intl.formatMessage({ id: "product.pending" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "Shipped" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "readytoship" })}</option>
                                            <option value="4">{intl.formatMessage({ id: "onhold" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "canceled" })}</option>
                                            <option value="7">{intl.formatMessage({ id: "delivered" })}</option>
                                            <option value="9">{intl.formatMessage({ id: "acknowledged" })}</option>
                                            <option value="11">{intl.formatMessage({ id: "returned" })}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.date" /></span>
                                        <DateRangePicker
                                            onCallback={datePickerCallback}
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
                    <div className="row">
                        <div className="float-right">
                            <div className="sort_by">
                                <div className="sortbyfilter">
                                    <select value={sortOrder} onChange={sortOrdersHandler} className="form-select customfliter" aria-label="Default select example">
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
                </div>
            </section>
        </div>

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
)(MySalesOrders);