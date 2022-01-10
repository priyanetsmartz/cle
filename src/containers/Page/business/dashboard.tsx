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
import { closePopup, dataTiles } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { getVendorOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';

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

    useEffect(() => {
        let pop = getCookie('popUp');
        if (localToken.showpop === 0 || pop === 'true')
            setMyDashboardModal(false)
        else
            setMyDashboardModal(true)
        let currentDate = moment().format('DD/MM/YYYY');
        let oldDate = moment().subtract(1, 'months').format('DD/MM/YYYY');
        getDataTiles(oldDate, currentDate);
        getDataOfOrders()
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
        let result: any = await getVendorOrders(props.languages, siteConfig.pageSize, "", 0, 0, "", "", "","");
        let dataObj = result && result.data && result.data.length > 0 ? result.data[0] : [];
        // console.log(dataObj)
        let dataLListing = [];
        if (dataObj && dataObj.length > 0) {
            dataLListing = dataObj.slice(0, 5).map((data, index) => {
                let orderLoop: any = {};
                orderLoop.orderNumber = data.increment_id;
                orderLoop.status = data.status;
                orderLoop.products = parseInt(data.products);
                orderLoop.total = siteConfig.currency + ' ' + data.total;
                return orderLoop;
            });
        }

        setMyOrders(dataLListing)

    }
    const columns = [
        {
            name: 'Order number',
            selector: row => row.orderNumber,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
        {
            name: 'Products',
            selector: row => row.products,
        },
        {
            name: 'Total',
            selector: row => row.total,
        }
    ];
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
        setDataTilesData(results.data)
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
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="seller.announcements" /></h1>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            {items.length > 0 && (
                                <div className="row">
                                    {items.map((item, i) => {
                                        return (<div className="col-sm-6 bg-light" key={i}>
                                            <div className="panel panel-info">
                                                <div className="panel-heading">
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <i className="fa fa-users"></i>
                                                        </div>
                                                        <div className="col-sm-8 text-right">
                                                            <p className="announcement-heading">{item.title}</p>
                                                            <div className="announcement-text"><div dangerouslySetInnerHTML={{ __html: item.full_content }} /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="page_by">
                            <div className="col-md-12 pagination">
                                {/* //   {console.log(pagination)} */}
                                {pagination > 1 && (
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center">
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
                </div >
            </section>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="datatiles" /></h1>
                            <ul className='filter-tiles'>
                                <li className={active === 0 ? 'active' : ""} onClick={() => { handleChange(0) }} ><IntlMessages id="month" /></li>
                                <li className={active === 1 ? 'active' : ""} onClick={() => { handleChange(1) }} ><IntlMessages id="quarter" /></li>
                                <li className={active === 2 ? 'active' : ""} onClick={() => { handleChange(2) }} ><IntlMessages id="year" /></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="container">
                            <div className="card-columns" style={{ columnCount: 3 }}>
                                <div className="card bg-light">
                                    <div className="card-body text-center">
                                        <h3><IntlMessages id="users" /></h3>
                                        <p className="card-text"><IntlMessages id="sometextinsidethefilthcard" /></p>
                                    </div>
                                </div>
                                <div className="card bg-light ">
                                    <div className="card-body text-center">
                                        <h3><IntlMessages id="order.orders" /></h3>
                                        <p className="card-text">{dataTilesData['totalOrder'] ? dataTilesData['totalOrder'] : 0}</p>
                                    </div>
                                </div>
                                <div className="card bg-light">
                                    <div className="card-body text-center">
                                        <h3><IntlMessages id="payments" /></h3>
                                        <p className="card-text">{dataTilesData['payoutAmount'] ? dataTilesData['payoutAmount'] : 0}</p>
                                    </div>
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
                            <h1><IntlMessages id="myOrders" /></h1>
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