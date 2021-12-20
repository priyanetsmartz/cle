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
import { dataTiles } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import moment from 'moment';
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
    useEffect(() => {
        if (getCookie("popUp"))
            setMyDashboardModal(false)
        else
            setMyDashboardModal(true)
        getDataOfCategory(lang, 9, 1, 'published_at', 'desc')
        let currentDate = moment().format('DD/MM/YYYY');
        let oldDate = moment().subtract(1, 'months').format('DD/MM/YYYY');
        getDataTiles(oldDate, currentDate);
        return () => {
            setItems([]);
            setMyDashboardModal(false)
            setDataTilesData([])
            setActive(0)
            setPagination(1)
            setflagDates([])
            SetVendorName('')
        }
    }, [])

    async function getDataOfCategory(languages, cat, page, sortBy = "published_at", sortByValue = "desc") {
        let result: any = await GetDataOfCategory(languages, cat, page, sortBy, sortByValue, 2);
        setPagination(Math.ceil(6 / 2));
        setItems(result.data);

    }
    const openDashboardModal = () => {
        setCookie("popUp", true)
        setMyDashboardModal(!myDashboardModal);
    }
    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        setDataTilesData(results.data)
    }
    const goToNextPage = (e) => {
        let lang = props.languages ? props.languages : language;
        e.preventDefault();
        setCurrent((page) => page + 1);

    }
    function changePage(event) {
        let lang = props.languages ? props.languages : language;

        event.preventDefault()
        const pageNumber = Number(event.target.textContent);
        setCurrent(pageNumber);
    }
    const getPaginationGroup = () => {
        let start = Math.floor((page - 1) / pageSize) * pageSize;
        let fill = pagination > 5 ? 4 : pagination;
        //  console.log (new Array(fill).fill(fill).map((_, idx) => start + idx + 1))
        return new Array(fill).fill(fill).map((_, idx) => start + idx + 1);
    };
    const goToPreviousPage = (e) => {
        let lang = props.languages ? props.languages : language;

        e.preventDefault();
        setCurrent((page) => page - 1);

    }

    const columns = [
        {
            name: 'Order number',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Products',
            selector: row => row.products,
        },
        {
            name: 'Total',
            selector: row => row.total,
        },
    ];
    const data = [
        {
            id: 1,
            title: 'Beetlejuice1',
            status: 'Delivered',
            products: 1,
            total: 20000
        },
        {
            id: 2,
            title: 'Beetlejuice2',
            status: 'Delivered',
            products: 2,
            total: 20000
        },
        {
            id: 3,
            title: 'Beetlejuice3',
            status: 'Delivered',
            products: 4,
            total: 20000
        }
    ]
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
                                {pagination > 1 && (<nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-center">
                                        <li
                                            className={`page-item prev ${page === 1 ? 'disabled' : ''}`}>
                                            <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className="page-link" aria-disabled="true"><IntlMessages id="pagination-prev" /></Link>
                                        </li>
                                        {getPaginationGroup().map((i, index) => (
                                            <li className="page-item" key={i}><Link className={`page-link ${page === i ? 'active' : ''}`} onClick={changePage} to="#">{i}</Link></li>
                                        ))}
                                        <li className={`page-item next ${page === pagination ? 'disabled' : ''}`} >
                                            <Link className="page-link" onClick={(e) => { goToNextPage(e); }}
                                                to="/"><IntlMessages id="pagination-next" /></Link>
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
                                    data={data}
                                    highlightOnHover
                                    pointerOnHover
                                    striped={true}
                                />
                            </div>
                        </div>
                    </div>
                </div >
            </section>
            <section className="my_profile_sect mb-4">
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
    return {

    }
}

export default connect(
    mapStateToProps
)(Dashboard);