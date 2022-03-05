import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { getCookie, setCookie } from '../../../helpers/session';
import { GetAnouncements } from '../../../redux/pages/magazineList';
import IntlMessages from "../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import DataTable from 'react-data-table-component';
import { Link } from "react-router-dom";
import HtmlContent from '../../partials/htmlContent';
import Magazine from '../home/magazine';
import { closePopup, getPayoutOrders, getVendorReturns } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { getVendorOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import { capitalize, formatprice } from '../../../components/utility/allutils';
import { useIntl } from 'react-intl';
import MyAnalysisDataTiles from './myAnalysis/DataTiles';


function Dashboard(props) { //Dashboard functional component 
    const intl = useIntl();
    const language = getCookie('currentLanguage');
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));

    let lang = props.languages ? props.languages : language;
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(1);
    const [page, setCurrent] = useState(1);

    const [vendorName, SetVendorName] = useState(localToken.vendor_name);
    const [myDashboardModal, setMyDashboardModal] = useState(true);
    const [myOrders, setMyOrders] = useState([]);
    const [myReturn, setMyReturn] = useState([]);
    const [myPayouts, setMyPayouts] = useState([]);

    const [isLoadingOrders, setIsLoadingOrders] = useState(true)
    const [isLoadingReturns, setIsLoadingReturns] = useState(true)
    const [isLoadingPayouts, setIsLoadingPayouts] = useState(true)
    useEffect(() => {
        let pop = getCookie('popUp');
        if (localToken?.showpop === "1" || localToken?.showpop === 1 || pop === localToken?.vendor_id)
            setMyDashboardModal(false)
        else
            setMyDashboardModal(true)
        getDataOfOrders()
        getVendorReturnsData()
        getDataOfPayouts();

        return () => {
            setItems([]);
            setMyDashboardModal(false)
            setPagination(1)
            SetVendorName('')
            setMyOrders([])
        }
    }, [])
    useEffect(() => {
        getDataOfCategory(lang, 9, page, 'published_at', 'desc')
    }, [page])



    const goToNextPage = (e) => {// function to navigate between announcement pages : next page
        e.preventDefault();
        setCurrent((page) => page + 1);

    }
    const goToPreviousPage = (e) => {// function to navigate between announcement pages : previous page
        e.preventDefault();
        setCurrent((page) => page - 1);

    }
    async function getDataOfOrders() {// function to get Sales Orders of vendor and setting the value of 'myOrders' to be displayed in data table of sales order
        setIsLoadingOrders(true)
        let result: any = await getVendorOrders(props.languages, siteConfig.pageSize, "", 0, 0, "", "", "", "");
        let dataObj = result && result.data && result.data.length > 0 ? result.data[0] : [];

        let dataLListing = [];

        if (dataObj && dataObj.OrderArray && dataObj.OrderArray.length > 0) {
            let detail = dataObj.OrderArray;

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
        setMyOrders(dataLListing)
        setIsLoadingOrders(false)

    }
    const columns = [ // react data table defining the columns of sales order
        {
            name: intl.formatMessage({ id: 'order' }),
            selector: row => row.increment_id,
            sortable: true,
            cell: row => (
                <Link to={`/vendor/sales-orders/${row.increment_id}`}>{row.increment_id}</Link>

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
                    {row.status === "Ready to Ship" ? <span className="ready-to-ship">{intl.formatMessage({ id: row.status })}</span> : ""}
                    {row.status === "Canceled" ? <span className="canceled">{intl.formatMessage({ id: row.status })}</span> : ""}
                    {row.status === "Shipped" ? <span className="shipped">{intl.formatMessage({ id: row.status })}</span> : ""}
                    {row.status === "Pending" ? <span className="pending">{intl.formatMessage({ id: row.status })}</span> : ""}
                    {row.status === "Delivered" ? <span className="delivered">{intl.formatMessage({ id: row.status })}</span> : ""}
                    {row.status === "Returned" ? <span className="returned">{intl.formatMessage({ id: row.status })}</span> : ""}

                </div>
            )
        },
        {
            name: intl.formatMessage({ id: 'order.total' }),
            selector: row => row.total ? siteConfig.currency + ' ' + row.total : 0,
        },
    ];

    const returnColumns = [ // react data table defining the columns of return and complaints order
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

    const columnsPayouts = [ // react data table defining the columns of my payouts
        {
            name: intl.formatMessage({ id: 'order.price' }),
            selector: row => row.price,
            button: true,
            cell: row => (
                <Link to={`/vendor/payoutdetails/${row.payout_id}`}>{row.price}</Link>
            )

        },
        {
            name: intl.formatMessage({ id: 'order.date' }),
            selector: row => row.date,
        },
        {
            name: intl.formatMessage({ id: 'status' }),
            selector: row => row.status,
            cell: row => (
                <span className='green'>{(intl.formatMessage({ id: capitalize(row.status) }))}</span>
            ),
        },
        { 
            name: <i className="fa fa-file-alt" aria-hidden="true"></i>,
            selector: row => row.data,
            cell: row => {

                if (row.data.payout_status === 'paid') {
                    return (
                        <Link to={`/vendor/payoutdetails/${row.payout_id}`}>{intl.formatMessage({ id: 'view' })}</Link>
                    )
                }
            }

        },
    ];

    // vendor return:  function to get My return Orders of vendor and setting the value of 'myReturn' to be displayed in data table of my returns

    async function getVendorReturnsData(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {
        setIsLoadingReturns(true)
        let result: any = await getVendorReturns(props.languages, siteConfig.pageSize, status, from, to, term, dateFrom, dateTo, sortorder, 'created_at');

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
        setIsLoadingReturns(false)

    }



// function to get My payout Orders of vendor and setting the value of 'myPayouts' to be displayed in data table of my payouts
    async function getDataOfPayouts(date_from: any = '', date_to: any = '', stat: any = '', frPrice: any = '', toPrice: any = '', term: any = '', sort_order = 'asc') {
        let page_size = siteConfig.pageSize;
        setIsLoadingPayouts(true)
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
        setIsLoadingPayouts(false)

    }

    // function to get the announcements and setting the value of 'items' to be displayed in announcement section. This function is getting called in useEffect hook
    async function getDataOfCategory(languages, cat, page, sortBy = "published_at", sortByValue = "desc") {
        let result: any = await GetAnouncements(languages, cat, page, sortBy, sortByValue, 2);
        let paginationSize = result && result.data && result.data.length > 0 ? result.data[0].total_page : 0;
        setPagination(paginationSize);
        setItems(result?.data);

    }
    async function openDashboardModal(oldDate, currentDate) { // function to toggle the value of 'myDashboardModal'. On the basis of this variable, modal is opened or closed.
        await closePopup(1);
        setCookie("popUp", localToken?.vendor_id)
        setMyDashboardModal(!myDashboardModal);
    }
    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    {/* Annuouncement section start */}
                    <div className="row mb-3">
                        <div className="col-sm-12">
                            <h2><IntlMessages id="seller.announcements" /></h2>
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
                                                <div className="announcement-text"><p dangerouslySetInnerHTML={{ __html: item.full_content }} /></div>
                                            </div>

                                        </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>



                        <div className="page_by">
                            <div className="col-md-12 pagination justify-content-center">
                                {pagination > 1 && (
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center align-items-center">
                                            <li
                                                className={`previousAnno ${page === 1 ? 'disabled' : ''}`}>
                                                <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className={`page-link pagenextAnno ${page === 1 ? 'disabled' : ''}`} aria-disabled="true"><i className="fa fa-chevron-left" aria-hidden="true"></i></Link>
                                            </li>
                                            <li className='pageofpage'><IntlMessages id="page" /> <span className='active'>{page}</span> <IntlMessages id="of" /> {pagination}</li>
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
                    {/* Announcement section end */}
                    <HtmlContent identifier="startselling" />

                </div >
            </section>
            <MyAnalysisDataTiles />
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2><IntlMessages id="vendor.salesOrders" /></h2>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            <div className="row">
                                <DataTable
                                    progressPending={isLoadingOrders}
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
                            <h2><IntlMessages id="vendor.returnandcomplaints" /></h2>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            <div className="row">
                                <DataTable
                                    progressPending={isLoadingReturns}
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
                            <h2><IntlMessages id="vendor.mypayouts" /></h2>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            <div className="row">
                                <div className="tbl-payout">
                                    <DataTable
                                        progressPending={isLoadingPayouts}
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
                        <div className="cont-wrapper" >
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