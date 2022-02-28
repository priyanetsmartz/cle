import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { InputNumber, Slider } from 'antd';
import moment from 'moment';
import { Link } from "react-router-dom";
import searchIcon from '../../../image/Icon_zoom_in.svg';
import { getVendorReturns } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { capitalize, formatprice } from '../../../components/utility/allutils';


function MyReturnsComplaints(props) {
    const intl = useIntl();
    const [myOrder, setMyOrders] = useState([])
    const [range, setRange] = useState({ low: 0, high: 20000 })
    const [status, setStatus] = useState();
    const [statusOptions, setStatusOptions] = useState([]);
    const [sortOrder, setSortOrder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getVendorReturnsData()
        return (
            setMyOrders([])
        )
    }, [])

    async function getVendorReturnsData(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {
        setIsLoading(true);
        let pageSize = props.pageData ? props.pageData : "";
        let result: any = await getVendorReturns(props.languages, pageSize, status, from, to, term, dateFrom, dateTo, sortorder);

        let dataObj = result && result.data && result.data.length > 0 ? result.data[0] : [];
        let dataLListing = []
        if (dataObj && dataObj.data && dataObj.data.length > 0) {

            let dataD = props.pageData ? dataObj.data.slice(0, 5) : dataObj.data;

            dataLListing = dataD.map((data, index) => {
                let orderLoop: any = {};
                let priceT = data.grand_total ? parseFloat(data.grand_total).toFixed(2) : 0
                let formatPrice = formatprice(priceT);
                orderLoop.increment_id = [{ 'increment_id': data.increment_id, 'entity_id': data.entity_id }];
                orderLoop.status = data.rma_status;
                orderLoop.date = moment(data.created_at).format('DD MMMM YYYY');
                orderLoop.total = siteConfig.currency + ' ' + formatPrice;
                return orderLoop;
            });
        }

        if (dataObj && dataObj.status_list && Object.keys(dataObj.status_list).length > 0) {

            setStatusOptions(dataObj.status_list)
        }

        setMyOrders(dataLListing)
        setIsLoading(false);

    }

    const getOrdersByStatus = async (e) => {
        const { value } = e.target;
        setStatus(value)
        getVendorReturnsData(value, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const datePickerCallback = async (start, end, label) => {
        let from = moment(start).format("MM-DD-YYYY"), to = moment(end).format("MM-DD-YYYY");
        if (label === 'All') {
            setDateFilter(prevState => ({
                ...prevState,
                from: '',
                to: ''
            }))
            getVendorReturnsData(status, range.low, range.high, searchTerm, '', '', sortOrder);
        } else {
            setDateFilter(prevState => ({
                ...prevState,
                from: from,
                to: to
            }))

            getVendorReturnsData(status, range.low, range.high, searchTerm, from, to, sortOrder);
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
        getVendorReturnsData(status, from, to, searchTerm, dateFilter.from, dateFilter.to, sortOrder)
    }

    const getOrdersBySearchTerm = async (e) => {

        if (e.target.value.length >= 3) {
            setTimeout(() => {
                setSearchTerm(e.target.value)
            }, 3000)
        } else {
            setSearchTerm("")
        }
        getVendorReturnsData(status, range.low, range.high, e.target.value, dateFilter.from, dateFilter.to, sortOrder)
    }

    const sortOrdersHandler = async (e) => {
        setSortOrder(e.target.value);
        getVendorReturnsData(status, range.low, range.high, searchTerm, dateFilter.from, dateFilter.to, e.target.value)
    }

    const columns = [
        {
            name: intl.formatMessage({ id: 'orderNumber' }),
            sortable: true,
            cell: row => (
                <Link to={`/vendor/returns-complaints/${row.increment_id[0].entity_id}`}>{row.increment_id[0].increment_id}</Link>

            )
        },
        {
            name: intl.formatMessage({ id: 'order.date' }),
            selector: row => row.date,
            sortable: true
        },
        {
            name: intl.formatMessage({ id: 'status' }),
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <div>
                    {row.status === "declined" || row.status === "decline" ? <span className="decline">{capitalize(intl.formatMessage({ id: row.status }))}</span> : ""}
                    {row.status === "pending" ? <span className="pending">{capitalize(intl.formatMessage({ id: row.status }))}</span> : ""}
                    {row.status === "approved" ? <span className="approved">{capitalize(intl.formatMessage({ id: row.status }))}</span> : ""}
                    {row.status === "acknowledged" ? <span className="acknowledged">{capitalize(intl.formatMessage({ id: row.status }))}</span> : ""}
                    {row.status === "received" ? <span className="received">{capitalize(intl.formatMessage({ id: row.status }))}</span> : ""}
                    {row.status === "accept" ? <span className="accept">{capitalize(intl.formatMessage({ id: row.status }))}</span> : ""}

                </div>
            )
        },
        {
            name: intl.formatMessage({ id: 'order.total' }),
            selector: row => row.total,
        },
    ];

    const paginationComponentOptions = {
        noRowsPerPage: true,
    };

    return (
        <div className={props.pageData ? "col-sm-12":"col-sm-9" }>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    {!props.pageData && (
                        <>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h1><IntlMessages id="vendor.returnandcomplaints" /></h1>
                                    <p><IntlMessages id="salesOrder.description.1" /><br /><IntlMessages id="salesOrder.description.2" /></p>
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

                                                    {Object.keys(statusOptions).map((item, i) => {
                                                        return (
                                                            <option value={item} key={i}>{intl.formatMessage({ id: statusOptions[item] })}</option>
                                                        )
                                                    })}

                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
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
                        </>
                    )}


                    <DataTable
                        progressPending={isLoading}
                        columns={columns}
                        data={myOrder}
                        pagination={true}
                        paginationComponentOptions={paginationComponentOptions}
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
        items: state.Cart.items,
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(MyReturnsComplaints);