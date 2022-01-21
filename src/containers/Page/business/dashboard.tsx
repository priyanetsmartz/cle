import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { getCookie, setCookie } from '../../../helpers/session';
import { GetDataOfCategory } from '../../../redux/pages/magazineList';
import IntlMessages from "../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import DataTable from 'react-data-table-component';
import { Link } from "react-router-dom";
import HtmlContent from '../../partials/htmlContent';
import Magazine from '../home/magazine';
import { closePopup, dataTiles, getInvoice, getPayoutOrders, getVendorReturns } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { getVendorOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import { capitalize, formatprice } from '../../../components/utility/allutils';

function Dashboard(props) {
    const language = getCookie('currentLanguage');
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    const [pageSize, setPageSize] = useState(siteConfig.pageSize);
    let lang = props.languages ? props.languages : language;
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(1);
    const [page, setCurrent] = useState(1);
    const [dataTilesData, setDataTilesData] = useState([]);
    const [flagDates, setflagDates] = useState([]);
    const [active, setActive] = useState(0);
    const [vendorName, SetVendorName] = useState(localToken.vendor_name);
    const [myDashboardModal, setMyDashboardModal] = useState(true);
    const [myOrders, setMyOrders] = useState([]);
    const [myReturn, setMyReturn] = useState([]);
    const [myPayouts, setMyPayouts] = useState([]);
    const [showRawPDF, setShowRawPDF] = useState(false)
    const [payoutData, setPayoutData] = useState([])

    useEffect(() => {
        let pop = getCookie('popUp');
        if (localToken.showpop === 0 || pop === 'true')
            setMyDashboardModal(false)
        else
            setMyDashboardModal(true)
        let currentDate = moment().format('MM/DD/YYYY');
        let oldDate = moment().subtract(1, 'months').format('MM/DD/YYYY');
        getDataTiles(oldDate, currentDate);
        getDataOfOrders()
        getVendorReturnsData()
        getDataOfPayouts();
        return () => {
            setItems([]);
            setMyDashboardModal(false)
            setDataTilesData([])
            setActive(0)
            setPagination(1)
            setflagDates([])
            SetVendorName('')
            setMyOrders([])
        }
    }, [])
    useEffect(() => {
        getDataOfCategory(lang, 9, page, 'published_at', 'desc')
    }, [page])



    const goToNextPage = (e) => {
        let lang = props.languages ? props.languages : language;
        e.preventDefault();
        setCurrent((page) => page + 1);

    }
    const goToPreviousPage = (e) => {
        e.preventDefault();
        setCurrent((page) => page - 1);

    }
    async function getDataOfOrders() {
        let result: any = await getVendorOrders(props.languages, siteConfig.pageSize, "", 0, 0, "", "", "", "");
        let dataObj = result && result.data && result.data.length > 0 ? result.data[0] : [];
        //  console.log(dataObj)
        let dataLListing = [];

        if (dataObj && dataObj.OrderArray && dataObj.OrderArray.length > 0) {
            let detail = dataObj.OrderArray;
            // console.log(detail)
            dataLListing = detail.slice(0, 5).map((data, index) => {
                let orderLoop: any = {};
                let price = data.total ? formatprice(data.total) : 0;
                orderLoop.increment_id = data.increment_id;
                orderLoop.status = data.status;
                orderLoop.date = moment(data.created_at).format('DD MMMM YYYY');
                orderLoop.total = price;
                return orderLoop;
            });
        }
        // console.log(dataLListing)
        setMyOrders(dataLListing)

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

    const returnColumns = [
        {
            name: 'Number',
            sortable: true,
            cell: row => (
                <Link to={`/vendor/returns-complaints/${row.increment_id[0].entity_id}`}>{row.increment_id[0].increment_id}</Link>

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
                // <span className='green'>{capitalize(row.status)}</span>
                <div>
                    {row.status === "declined" || row.status === "decline" ? <span className="decline">{capitalize(row.status)}</span> : ""}
                    {row.status === "pending" ? <span className="pending">{capitalize(row.status)}</span> : ""}
                    {row.status === "approved" ? <span className="approved">{capitalize(row.status)}</span> : ""}
                    {row.status === "acknowledged" ? <span className="acknowledged">{capitalize(row.status)}</span> : ""}
                    {row.status === "received" ? <span className="received">{capitalize(row.status)}</span> : ""}
                    {row.status === "accept" ? <span className="accept">{capitalize(row.status)}</span> : ""}
                </div>
            )
        },
        {
            name: 'Total',
            selector: row => row.total,
        },
    ];

    const columnsPayouts = [
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
        setPayoutData(response)
        setShowRawPDF(true)
        // printDocument();
    };
    // vendor return 

    async function getVendorReturnsData(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {
        let result: any = await getVendorReturns(props.languages, siteConfig.pageSize, status, from, to, term, dateFrom, dateTo, sortorder);

        let dataObj = result && result.data && result.data.length > 0 ? result.data[0] : [];
        let dataLListing = []
        if (dataObj && dataObj.data && dataObj.data.length > 0) {
            let dataD = dataObj.data;

            dataLListing = dataD.slice(0, 5).map((data, index) => {
                let orderLoop: any = {};
                orderLoop.increment_id = [{ 'increment_id': data.increment_id, 'entity_id': data.entity_id }];
                orderLoop.status = data.rma_status;
                orderLoop.date = moment(data.created_at).format('DD MMMM YYYY');
                orderLoop.total = siteConfig.currency + ' ' + data.grand_total;
                return orderLoop;
            });
        }

        setMyReturn(dataLListing)

    }

    async function getDataOfPayouts(date_from: any = '', date_to: any = '', stat: any = '', frPrice: any = '', toPrice: any = '', term: any = '', sort_order = 'asc') {
        let page_size = siteConfig.pageSize;

        let result: any = await getPayoutOrders(date_from, date_to, stat, frPrice, toPrice, page_size, sort_order, term)
        let dataObj = result && result.data[0] && result.data[0].OrderData.length > 0 ? result.data[0].OrderData : [];
        let dataLListing = [];
        if (dataObj.length > 0) {
            dataLListing = dataObj.slice(0, 5).map((data) => {
                let orderLoop: any = {};
                orderLoop.price = siteConfig.currency + data.total_payout;
                orderLoop.status = data.payout_status;
                orderLoop.date = moment(data.created_at).format('DD MMMM YYYY');
                orderLoop.payout_id = data.payout_id;
                orderLoop.data = data;
                return orderLoop;
            });
        }
        setMyPayouts(dataLListing)

    }
    async function getDataOfCategory(languages, cat, page, sortBy = "published_at", sortByValue = "desc") {
        let result: any = await GetDataOfCategory(languages, cat, page, sortBy, sortByValue, 2);
        // console.log(Math.ceil(result.data.length / 2))
        let paginationSize = result && result.data && result.data.length > 0 ? result.data[0].total_page : 0;
        //   console.log(paginationSize)
        setPagination(paginationSize);
        setItems(result.data);

    }
    async function openDashboardModal(oldDate, currentDate) {
        let results: any = await closePopup(0);
        setCookie("popUp", true)
        setMyDashboardModal(!myDashboardModal);
    }
    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        if (results && results.data) {
            setDataTilesData(results.data)
        }

    }


    const handleChange = (flag) => {
        let dates = [];
        if (flag === 0) {
            dates['start'] = moment().format('DD/MM/YYYY');
            dates['end'] = moment().subtract(1, 'months').format('DD/MM/YYYY');
        } else if (1) {
            let quater = moment().quarter();
            dates['start'] = moment().quarter(quater).startOf('quarter').format('DD/MM/YYYY');
            dates['end'] = moment().quarter(quater).endOf('quarter').format('DD/MM/YYYY');
        } else {
            dates['start'] = moment().startOf('year').format('DD/MM/YYYY');
            dates['end'] = moment().endOf('year').format('DD/MM/YYYY');
        }
        setActive(flag)
        //  setflagDates(dates)
        getDataTiles(dates['start'], dates['end'])
    }
    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="seller.announcements" /></h1>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="">
                            {items.length > 0 && (
                                <div className="importance">
                                    {items.map((item, i) => {
                                        return (<div className="importance-card" key={i}>

                                            <div className="importance-icon">
                                                <i className="fa fa-percent"></i>
                                            </div>
                                            <div className="important-cont">
                                                <p className="announcement-heading">{item.title}</p>
                                                <p className="announcement-text"><div dangerouslySetInnerHTML={{ __html: item.full_content }} /></p>
                                            </div>

                                        </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>



                        <div className="page_by">
                            <div className="col-md-12 pagination justify-content-center">
                                {/* //   {console.log(pagination)} */}
                                {pagination > 1 && (
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center align-items-center">
                                            <li
                                                className={`previousAnno ${page === 1 ? 'disabled' : ''}`}>
                                                <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className="page-link" aria-disabled="true"><i className="fa fa-chevron-left" aria-hidden="true"></i></Link>
                                            </li>
                                            <li className='pageofpage'>Page {page} of {pagination}</li>
                                            <li className={`nextAnno ${page === pagination ? 'disabled' : ''}`} >
                                                <Link className={`page-link pagenextAnno ${page === pagination ? 'disabled' : ''}`} onClick={(e) => { goToNextPage(e); }}
                                                    to="/"><i className="fa fa-chevron-right" aria-hidden="true"></i></Link>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </div>
                    </div>
					
					<section className="start-selling">
						<div className="row">
							<div className="col-sm-8">
								<div className="sell-cont">
									<h3>Start selling</h3>
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
									<a href="#" className="btn btn-secondary">Start selling</a>
								</div>
							</div>
							<div className="col-sm-4">
								<img src="../images/best-priofile.svg" className="img-fluid" />
							</div>
						</div>
					</section>
					
                </div >
            </section>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="datatiles" /></h1>
                            <ul className='filter-tiles'>
                                <li className={active === 0 ? 'active' : ""} onClick={() => { handleChange(0) }} ><IntlMessages id="month" /></li>
                                <li className={active === 1 ? 'active' : ""} onClick={() => { handleChange(1) }} ><IntlMessages id="quarter" /></li>
                                <li className={active === 2 ? 'active' : ""} onClick={() => { handleChange(2) }} ><IntlMessages id="year" /></li>
                            </ul>
                        </div>
                    </div>


                    <div className="row mb-4" style={{ columnCount: 3 }}>
                        <div className="col-sm-12 col-md-4">
                            <div className="card-info">
                                <h5><IntlMessages id="users" /> <i className="fas fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom"></i></h5>
                                <div className="stats">
                                    <h3>30K</h3>
                                    <h4>9%</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="card-info">
                                <h5><IntlMessages id="order.orders" /> <i className="fas fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom"></i></h5>
                                <div className="stats">
                                    <h3>{dataTilesData['totalOrder'] ? dataTilesData['totalOrder'] : 0}</h3>
                                    <h4>10%</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="card-info">
                                <h5><IntlMessages id="payments" /> <i className="fas fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom"></i></h5>
                                <div className="stats">
                                    <h3>{dataTilesData['payoutAmount'] ? dataTilesData['payoutAmount'] : 0}</h3>
                                    <h4>5%</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
            </section>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="salesOrder.title" /></h1>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            <div className="row">
                                <DataTable
                                    columns={columns}
                                    data={myOrders}
                                    highlightOnHover
                                    pointerOnHover
                                    striped={true}
                                />
                            </div>
                        </div>
                    </div>
                </div >
            </section>
            {/* My Returns & Complaints */}
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="vendor.returnandcomplaints" /></h1>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            <div className="row">
                                <DataTable
                                    columns={returnColumns}
                                    data={myReturn}
                                    highlightOnHover
                                    pointerOnHover
                                    striped={true}
                                />
                            </div>
                        </div>
                    </div>
                </div >
            </section>
            {/* My Payouts */}
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="vendor.mypayouts" /></h1>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            <div className="row">
                                <div className="tbl-payout">
									<DataTable
										columns={columnsPayouts}
										data={myPayouts}
										highlightOnHover
										pointerOnHover
										striped={true}
									/>
								</div>
                            </div>
                        </div>
                    </div>
                </div >
            </section>

            <section className="my_profile_sect profilemagazine mb-4">
                <Magazine />
            </section>
            <Modal show={myDashboardModal} className="cookie_popup_login">
                <div className="CLE_pf_details">
                    <Modal.Body className="arabic-rtl-direction">
                        <Link to="#" onClick={openDashboardModal} className="cross_icn"> <i className="fas fa-times"></i></Link>
                        <div className="section" >
                            <h2 className="head-ble"><IntlMessages id="customer.hi" />,</h2>
                            <h2>{vendorName}</h2>
                            <HtmlContent identifier="login_popup" />
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
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

    };
}

export default connect(
    mapStateToProps
)(Dashboard);