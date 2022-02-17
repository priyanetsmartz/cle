import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { dataTiles, removeProduct, searchProducts } from '../../../redux/pages/vendorLogin';
import Modal from "react-bootstrap/Modal";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip as Tool,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { Link } from "react-router-dom";
import { formatprice, getCurrentMonth } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import { useIntl } from 'react-intl';


function MyAnalysis(props) {
    const intl = useIntl()
    let quater = moment().quarter();
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    let venID = localToken && localToken.vendor_id ? localToken.vendor_id : 0;
    const [active, setActive] = useState(0);
    const [dataTilesData, setDataTilesData] = useState([]);
    const [pdata, setPdata] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [pieChart, setPieChart] = useState([]);
    const [showMonth, setShowMonth] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    let currentDate = moment().endOf('month').format('MM/DD/YYYY');
    let oldDate = moment().startOf('month').format('MM/DD/YYYY');
    const [currentMonthkey, setCurrentMonthKey] = useState(getCurrentMonth().num)
    const [sowQuaters, setShowQuaters] = useState(false);
    const [listingData, setListingData] = useState([])
    const [quaterSlider, setQuaterSlider] = useState('')
    const [currentQuater, setCurrentQuater] = useState(quater)
    const [pending, setPending] = useState(true);
    const [vendorId, setVendorId] = useState(venID);
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth().name)
    const [deletePop, setDeletePop] = useState(false);
    const [deleteId, setDeleteID] = useState(0)
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    useEffect(() => {
        getVendorProductListing()
        getDataTiles(oldDate, currentDate);
        return () => {
            setPdata([])
            setPieChart([]);
            setBarChartData([])
        }
    }, [])

    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        if (results && results.data && results.data.length > 0) {
            let tiles_information = results?.data[0]?.tiles_information;
            setPdata(tiles_information?.order_information)
            setBarChartData([tiles_information?.product_information])
            setPieChart(tiles_information?.payout_information)
            setDataTilesData(results?.data[0])
        }
    }
    const handleChange = (flag) => {
        let dates = [];
        if (flag === 0) {
            setShowMonth(true)
            setShowQuaters(false)
            dates['start'] = moment().startOf('month').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('month').format('MM/DD/YYYY');
            getDataTiles(dates['start'], dates['end'])
        } else if (flag === 1) {
            setShowMonth(false)
            setShowQuaters(true)
            handleQuater(currentQuater);
        } else {
            setShowMonth(false)
            setShowQuaters(false)
            dates['start'] = moment().startOf('year').format('DD/MM/YYYY');
            dates['end'] = moment().endOf('year').format('DD/MM/YYYY');
            getDataTiles(dates['start'], dates['end'])
        }
        setActive(flag)

    }
    async function getVendorProductListing(status = '', from: any = '', to: any = '', term: any = "", dateFrom: any = '', dateTo: any = '', sortorder: any = '') {
        setIsLoading(true);
        let result: any = await searchProducts(props.languages, siteConfig.pageSize, status, from, to, term, dateFrom, dateTo, sortorder);

        let dataObj = result && result.data && result.data.length > 0 ? result.data : [];
        let data = dataObj.slice(0, 5);
        const renObjData = data.map(function (data, idx) {

            let productLoop: any = {};

            productLoop.id = data.id;
            productLoop.image = data.img;
            productLoop.product = data;
            productLoop.date = moment(data.created_at).format('DD MMMM YYYY');
            productLoop.status = data.status;
            productLoop.price = siteConfig.currency + data.price;
            return productLoop;
        });
        setListingData(renObjData)
        setIsLoading(false);
        setPending(false)

    }
    async function deleteProduct() {
        let payload = {
            "product": {
                "sku": deleteId,
                "status": 2,
                "custom_attributes": [{
                    "attribute_code": "udropship_vendor",
                    "value": vendorId
                }]
            },
            "saveOptions": true
        }
        await removeProduct(payload)
        getVendorProductListing();
        closePop();
    }
    const closePop = () => {
        setDeletePop(false);
    }
    function handleChangeLeft(i) {

        let monthKey = currentMonthkey - 1;
        let month = moment.monthsShort().filter((name, i) => {
            return i === monthKey
        })
        if (monthKey === -1) return false;
        setCurrentMonthKey(monthKey);
        setCurrentMonth(month[0])
        let input = monthKey + 1;
        const output = moment(input, "MM");
        let startOfMonth = output.startOf('month').format('MM/DD/YYYY');
        let endOfMonth = output.endOf('month').format('MM/DD/YYYY')

        getDataTiles(startOfMonth, endOfMonth);
    }

    function handleChangeRight(i) {

        let monthKey = currentMonthkey + 1;
        if (monthKey === 12) return false;
        let month = moment.monthsShort().filter((name, i) => {
            return i === monthKey
        })
        setCurrentMonthKey(monthKey);
        setCurrentMonth(month[0])
        let input = monthKey + 1;
        const output = moment(input, "MM");
        let startOfMonth = output.startOf('month').format('MM/DD/YYYY');
        let endOfMonth = output.endOf('month').format('MM/DD/YYYY')
        getDataTiles(startOfMonth, endOfMonth);
    }

    function handleQuater(quater) {
        let start = moment().quarter(quater).startOf('quarter').format('MMM');
        let end = moment().quarter(quater).endOf('quarter').format('MMM');
        let part = start + '-' + end;

        let startOfMonth = moment().quarter(quater).startOf('quarter').format('MM/DD/YYYY');
        let endOfMonth = moment().quarter(quater).endOf('quarter').format('MM/DD/YYYY');
        getDataTiles(startOfMonth, endOfMonth);
        setQuaterSlider(part);
    }

    function handleChangeLeftQuater(i) {
        let quarter = currentQuater - 1;
        if (quarter === 0) return false;
        setCurrentQuater(quarter);
        handleQuater(quarter);
    }


    function handleChangeRightQuater(i) {
        let quarter = currentQuater + 1;
        if (quarter === 5) return false;
        setCurrentQuater(quarter);
        handleQuater(quarter);
    }

    const paginationComponentOptions = {
        noRowsPerPage: true,
    };
    const handleDelete = (prodId) => {
        setDeleteID(prodId)
        setDeletePop(true);
    }
    const columns = [
        {
            name: <i className="fa fa-camera" aria-hidden="true"></i>,
            selector: row => row.img,
            cell: row => <img height="84px" width="56px" alt={row.image} src={row.image} />,
        },
        {
            name: intl.formatMessage({ id: 'Product' }),
            sortable: true,
            cell: row => (
                <div>
                    <p className='prodbrand'>{row.product.brand}</p>
                    <p className='prodname'>{row.product.name}</p>
                    <p className='prodId'><span><IntlMessages id="id" />:</span>{row.product.id}</p>
                    <div className='data_value'><ul><li>{<Link to={'/product-details-preview/' + venID + '/' + row.product.sku} target="_blankl" ><IntlMessages id="view" /></Link>}</li><li><Link to="#" onClick={() => { handleDelete(row.product.sku) }} ><IntlMessages id="delete" /></Link></li></ul></div>
                </div>
            ),
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
                    {row.status === "1" ? <span className="active">{intl.formatMessage({ id: "product.active" })}</span> : ""}
                    {row.status === "8" ? <span className="sold">{intl.formatMessage({ id: "product.sold" })}</span> : ""}
                    {row.status === "3" ? <span className="pending">{intl.formatMessage({ id: "product.pending" })}</span> : ""}
                    {row.status === "10" ? <span className="rejected">{intl.formatMessage({ id: "product.rejected" })}</span> : ""}
                    {row.status === "2" ? <span className="disabled">{intl.formatMessage({ id: "product.disabled" })}</span> : ""}
                </div>
            ),
        },
        {
            name: intl.formatMessage({ id: 'price' }),
            selector: row => row.price,
        }
    ];


    const labelPieChart = async (prodId) => {
        setDeleteID(prodId)
        setDeletePop(true);
    }

    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-sm-12">
                            <h2><IntlMessages id="datatiles" /></h2>
                            <ul className='filter-tiles'>
                                <li><Link to="#" className={active === 0 ? 'active' : ""} onClick={() => { handleChange(0) }} ><IntlMessages id="month" /></Link></li>
                                <li><Link to="#" className={active === 1 ? 'active' : ""} onClick={() => { handleChange(1) }} ><IntlMessages id="quarter" /></Link></li>
                                <li><Link to="#" className={active === 2 ? 'active' : ""} onClick={() => { handleChange(2) }} ><IntlMessages id="year" /></Link></li>
                            </ul>

                            {showMonth && (
                                <ul className='monthsname pagination justify-content-center align-items-center'>
                                    <p className='leftarrow' onClick={() => { handleChangeLeft(1) }}> <i className="fa fa-caret-left"></i> </p>
                                    {
                                        <p data-attribute={getCurrentMonth().num}>{currentMonth}</p>
                                    }
                                    <p className='rightarrow' onClick={() => { handleChangeRight(1) }}> <i className="fa fa-caret-right"></i> </p>
                                </ul>
                            )}
                            {sowQuaters && (
                                <ul className='monthsname pagination justify-content-center align-items-center'>
                                    <p className='leftarrow' onClick={() => { handleChangeLeftQuater(1) }}> <i className="fa fa-caret-left"></i> </p>
                                    {
                                        <p>{quaterSlider}</p>
                                    }

                                    <p className='rightarrow' onClick={() => { handleChangeRightQuater(1) }}> <i className="fa fa-caret-right"></i> </p>
                                </ul>
                            )}
                        </div>
                    </div>


                    <div className="row mb-4" style={{ columnCount: 3 }}>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                            <div className="card-info">
                                <h5><IntlMessages id="ordertotal" />
                                    <OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                                <IntlMessages id="totalordersplaces" />
                                            </Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger></h5>
                                <div className="stats">
                                    <h3>{dataTilesData['totalOrder'] ? dataTilesData['totalOrder'] : 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                            <div className="card-info">
                                <h5><IntlMessages id="order.orders" />
                                    <OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                                <IntlMessages id="totalaveragescost" />
                                            </Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger>
                                </h5>
                                <div className="stats">
                                    <h3>{dataTilesData['averageOrder'] ? siteConfig.currency + ' ' + formatprice(parseFloat(dataTilesData['averageOrder']).toFixed(2)) : 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                            <div className="card-info">
                                <h5><IntlMessages id="payments" />  <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                    overlay={(props) => (
                                        <Tooltip id="" {...props} >
                                            <IntlMessages id="totalorderscost" />
                                        </Tooltip>
                                    )}
                                    placement="right"
                                ><i className="fas fa-info-circle" ></i>
                                </OverlayTrigger></h5>
                                <div className="stats">
                                    <h3>{dataTilesData['payoutAmount'] ? siteConfig.currency + ' ' + formatprice(parseFloat(dataTilesData['payoutAmount']).toFixed(2)) : 0}</h3>
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
                            <h2>{intl.formatMessage({ id: 'vendor.myAnalysis' })}</h2>
                            <p>{intl.formatMessage({ id: 'orderInformation' })}</p>


                            {pdata?.length > 0 && (
                                <LineChart width={500} height={300} data={pdata} style={{ data: { fill: '#eee' } }}>
                                    <XAxis dataKey="Created At" />
                                    <YAxis dataKey="Total Cost" domain={[0, 20000]} />
                                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                    <Legend />
                                    <Tool />
                                    <Line type="monotone" dataKey="Total Cost" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="Quantity" stroke="#82ca9d" />
                                </LineChart>
                            )}
                            {pdata?.length === 0 ? <div className='text-center' >No data available</div> : ""}
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2>{intl.formatMessage({ id: 'payoutInformation' })}</h2>

                            {pieChart?.length > 0 && (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart height={250}>
                                        <Pie
                                            data={pieChart}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            isAnimationActive={false}
                                            fill="#8884d8"
                                            dataKey="total_payout_amount"
                                            label={({
                                                cx,
                                                cy,
                                                midAngle,
                                                innerRadius,
                                                outerRadius,
                                                total_payout_amount,
                                                percent,
                                                index
                                            }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                return (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        fill="#8884d8"
                                                        textAnchor={x > cx ? "start" : "end"}
                                                        dominantBaseline="central"
                                                    >

                                                        {pieChart[index].po_created_at} ({siteConfig.currency}{total_payout_amount})
                                                        {/* {`${(percent * 100).toFixed(0)}%`} */}
                                                    </text>
                                                );
                                            }}>
                                            {
                                                pieChart.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                            }
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            {pieChart?.length === 0 ? <div className='text-center' >No data available</div> : ""}
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2>{intl.formatMessage({ id: 'productInformation' })}</h2>
                            {barChartData?.length > 0 && (
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={barChartData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Total Product Count" />
                                    <YAxis />
                                    <Tool />
                                    <Legend />
                                    <Bar barSize={30} dataKey="Total Product Price" fill="#8884d8" />

                                </BarChart>
                            )}

                            {barChartData?.length === 0 ? <div className='text-center' >No data available</div> : ""}
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="product-listing">
                                <DataTable
                                    title="Product Listing"
                                    progressPending={isLoading}
                                    columns={columns}
                                    data={listingData}
                                    pagination={true}
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={deletePop}>
                    <Modal.Body className="CLE_pf_details modal-confirm">

                        <div className="deletePopup">
                            <div className="modal-header flex-column">
                                <i className="far fa-times-circle"></i>
                                <h4 className="modal-title w-100"><IntlMessages id="deletetheproduct" /></h4>
                                <Link to="#" onClick={closePop} className="close"> <i className="fas fa-times"></i></Link>
                            </div>
                            <div className="modal-body">
                                <p><IntlMessages id="deleteProduct.confirmation" /></p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={closePop} data-dismiss="modal"><IntlMessages id="productEdit.cancel" /></button>
                                <button type="button" className="btn btn-secondary" onClick={deleteProduct} ><IntlMessages id="productEdit.delete" /></button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
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
)(MyAnalysis);