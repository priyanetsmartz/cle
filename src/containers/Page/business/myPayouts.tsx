import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { Slider } from 'antd';
import moment from 'moment';
import searchIcon from '../../../image/Icon_zoom_in.svg';
import { getPayoutOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import { getCookie } from '../../../helpers/session';


function MyPayouts(props) {
    const intl = useIntl();
    const [myOrder, setMyOrders] = useState([])
    const [orderDate, setOrderDate] = useState('');
    const [range, setRange] = useState([0, 20000])
    const [status, setStatus] = useState('');
    const [pageSize, setPageSize] = useState(siteConfig.pageSize);
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDates, setToDates] = useState('');
    const [defData, setDefData] = useState([]); 
    const language = getCookie('currentLanguage');
    useEffect(() => {
        getDataOfPayouts()
        return (
            setMyOrders([])
        )

    
    }, [])
    const getOrdersByStatus = (e) =>{
        const { value } = e.target;
        setStatus(e.target.value)
        console.log("stat", status, e.target.value)
        getDataOfPayouts()
               
    }

    const getOrdersByDate = (e) =>{
        const { value } = e.target;
        let filter = parseInt(value);
        let fromDate;
        let currentDate = moment(new Date());
        if (filter === 1 || filter === 3 || filter === 6) {
            fromDate = moment(currentDate).subtract(filter, 'M').toJSON();
        } else {
            fromDate = moment(`${filter}-01-01`).toJSON();
        }
        //console.log(fromDate)
        setOrderDate(fromDate);
        const dateFrom = moment(fromDate).format("DD/MM/YYYY");
        const dateTo = moment(currentDate.toJSON()).format("DD/MM/YYYY");

        setFromDate(dateFrom);
        setToDates(dateTo);
        getDataOfPayouts();
    }

    const getOrdersByPrice = async(e) =>{
        let from = range[0];
        let to = range[1];
        setRange([from, to]);
        getDataOfPayouts();
    }

    const getOrdersBySearchTerm = async(e) =>{
        if (e.target.value.length >= 3) {
            setSearchTerm(e.target.value);
            getDataOfPayouts();
        }
    else{
        setMyOrders(defData);
    }
    }
    
    const columns = [
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => (
                <select defaultValue={row.status}>
                    <option value="paid">{intl.formatMessage({ id: "payout.paid" })}</option>
                    <option value="2">{intl.formatMessage({ id: "product.pending" })}</option>
                    <option value="3">{intl.formatMessage({ id: "product.sold" })}</option>
                    <option value="4">{intl.formatMessage({ id: "product.rejected" })}</option>
                </select>

            ),
        },
        {
            name: 'Total',
            selector: row => row.total,
        },
    ];
    async function getDataOfPayouts() {
        //po_date_from, po_date_to, po_status, po_fromPrice, po_toPrice , page_size, sort_order, search
        let po_date_from = fromDate?fromDate:null;
        let po_date_to = toDates?toDates:null;
        let po_status = status?status:null;
        let po_fromPrice = range[0]?range[0]:null;
        let po_toPrice = range[1]?range[1]:null;
        let page_size = siteConfig.pageSize;
        let sort_order = "asc";
        let search = searchTerm?searchTerm:null;
        let result: any = await getPayoutOrders(po_date_from, po_date_to, po_status, po_fromPrice, po_toPrice , page_size, sort_order, search)

        console.log("check result", result, result.data[0])
        let dataObj = result && result.data[0] && result.data[0].OrderData.length > 0 ? result.data[0].OrderData : [];
        console.log(dataObj)
        if (dataObj.length > 0) {
            const dataLListing = dataObj.map((data, index) => {
                let orderLoop: any = {};
                orderLoop.price = siteConfig.currency + data.total_payout;
                orderLoop.status = data.payout_status;
                orderLoop.date = moment(data.created_at).format('DD MMMM YYYY');
                //orderLoop.total = ;
                return orderLoop;
            });

            setMyOrders(dataLListing)
            setDefData(defData);
        }

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
                            <p><IntlMessages id="salesOrder.description.1" /><br /><IntlMessages id="salesOrder.description.2" /></p>
                        </div>
                    </div>
                    <div className="range_slider">
                        <div className="range_inner">
                            <div className="row">
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="status" /></span>
                                        <select className="form-select" aria-label="Default select example" value={status}  onChange = {getOrdersByStatus}>
                                            <option value="0">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="paid">{intl.formatMessage({ id: "payout.paid" })}</option>
                                            <option value="2">{intl.formatMessage({ id: "product.pending" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "product.sold" })}</option>
                                            <option value="4">{intl.formatMessage({ id: "product.rejected" })}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.date" /></span>
                                        <select className="form-select" aria-label="Default select example" onChange={getOrdersByDate}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-2">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.price" /></span>
                                        <Slider range max={20000} defaultValue={[0, 20000]} onAfterChange={getOrdersByPrice}/>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src={searchIcon} alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchorderid" })} className="form-control me-1"  onChange={getOrdersBySearchTerm}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col-sm-6 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="changeStatus" />:</span>
                                        <select className="form-select" aria-label="Default select example" >
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-grid col-sm-4 mb-4">
                                    <button type="button" className="btn btn-secondary" >
                                        <IntlMessages id="myaccount.edit" />
                                    </button>
                                </div>
                            </div> */}
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