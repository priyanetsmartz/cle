import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { dataTiles, removeProduct, searchProducts } from '../../../redux/pages/vendorLogin';
import Modal from "react-bootstrap/Modal";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import './myanalysis.css';
import {
    LineChart,
    Area,
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
    Cell,
    Label,
    AreaChart
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
    let venID = localToken && localToken?.vendor_id ? localToken?.vendor_id : 0;
    const [active, setActive] = useState(0);
    const [dataTilesData, setDataTilesData] = useState([]);
    const [pdata, setPdata] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [returnData, setReturnData] = useState([]);
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
            setReturnData([])
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
            setReturnData(tiles_information?.return_information)
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
                    <div className='data_value'><ul><li>{<Link to={'/product-details-preview/' + venID + '/' + row.product.sku} target="_blank" ><IntlMessages id="view" /></Link>}</li><li><Link to="#" onClick={() => { handleDelete(row.product.sku) }} ><IntlMessages id="delete" /></Link></li></ul></div>
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
    const CustomizedLabelBar = ({ viewBox, value = 0 }) => {
        const { x, y } = viewBox;
        return (
            <text
                x={x}
                y={y}
                dy={-4}
                fontSize="16"
                textAnchor="middle"
            >
                {value}
            </text>
        );
    }

    // function for custom x axis area chart
    const CustomizedAxisTick = ({ x, y, payload }) => {

        // console.log(payload.value.split(" "))
        let dayArray = payload.value.split(" ");
        const dateTip = dayArray[0].slice(0, -2) + ' ' + dayArray[1].slice(0, 3);
        return (
            <g transform={`translate(${x},${y})`} >
                <text x={20} y={0} dy={20} fontSize="0.90em" transform="rotate(-45)" textAnchor="end" fill="#363636">
                    {dateTip}</text>
            </g>
        );
    }

    const CustomLabel = ({ viewBox, noOfBubbleTeaSold = 0, noCost = 0 }) => {
        const { cx, cy } = viewBox;
        return (
            <>
                <text x={cx - 15} y={cy - 5}>
                    <tspan
                        style={{
                            fontWeight: 700,
                            fontSize: "1.5em",
                            fill: "#2B5CE7"
                        }}
                    >
                        {noOfBubbleTeaSold}
                    </tspan>
                </text>
                <text x={cx - 50} y={cy + 15}>
                    <tspan
                        style={{
                            fontSize: "0.8em",
                            fill: "#000"
                        }}
                    >
                        Total Product Cost:
                    </tspan>
                </text>
                <text x={cx - 50} y={cy + 30}>
                    <tspan
                        style={{
                            fontSize: "0.8em",
                            fill: "#000"
                        }}
                    >
                        {siteConfig.currency} {noCost}
                    </tspan>
                </text>
            </>
        );
    };
    const DateChartFilters = () => {
        return (
            <div className="row mb-4">
                <div className="col-sm-12">
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
        )
    }
    const CustomTooltip = ({ active, payload, label }) => {      
        if (payload === null) return
        if (active)
            return (
                <div className="custom-tooltip">
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Order Date</b> <br/>{payload[0].payload.created_at}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Order Count</b> <br/>{payload[0].payload.orders_count}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Quanties Sold</b> <br/>{payload[0].payload.quantity}</span>
                    </p>

                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Total Order Cost</b> <br/>{siteConfig.currency} {payload[0].payload.total_cost}</span>
                    </p>
                </div>
            );
        return null;
    };

    const CustomTooltipBar = ({ active, payload, label }) => {  
         
        if (payload === null) return
        if (active)
            return (
                <div className="custom-tooltip">
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Return Date</b> <br/>{payload[0].payload.created_at}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Product Quantity</b> <br/>{payload[0].payload.product_quantity}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Total return</b> <br/>{payload[0].payload.total_return}</span>
                    </p>
                </div>
            );
        return null;
    };
    
    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>My Analysis</h1>
                            <p>You can see your analysis here. Lorem ipsum dolor sit amet<br />
                                consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    
					<div className="row mb-4">
                        <div className="col-sm-12">
                            <ul className="analysis-demo">
                                <li>
									<input type="radio" id="radioApple1" name="radioFruit1" value="apple1" className="active" />
									<label>Demographics</label>
								</li>
                                <li>
									<input type="radio" id="radioApple2" name="radioFruit2" value="apple2" />
									<label>Sales</label>
								</li>
                                <li>
									<input type="radio" id="radioApple3" name="radioFruit3" value="apple3" />
									<label> Statics</label>
								</li>
                            </ul>
                        </div>
                    </div>
					
                    <div className="row mb-4">
                        <div className="col-sm-12">
                            <h2><IntlMessages id="datatiles" /></h2>
                            <DateChartFilters />
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
                            <h2>{intl.formatMessage({ id: 'orderInformation' })}</h2>
                            <p>You can see sales chart here.</p>

                            <DateChartFilters />
                            {pdata?.length > 0 && (
                                <>  <AreaChart width={500} height={300} data={pdata} style={{ data: { fill: '#eee' } }}>
                                    <XAxis dataKey="created_at" tick={CustomizedAxisTick} />
                                    <YAxis dataKey="total_cost" domain={[0, 20000]} />
                                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                    <Tool content={CustomTooltip} animationDuration={0} />                                 
                                    <Area type="monotone" dataKey="total_cost" stroke="#8884d8" />
                                    <Area type="monotone" dataKey="quantity" stroke="#82ca9d" />
                                </AreaChart >
                                </>
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
                            <p>You can see payout information chart here</p>
                            <DateChartFilters />
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
                            <p>You can see your active product and total cost of products chart here.</p>
                            <DateChartFilters />
                            {barChartData?.length > 0 && (<PieChart width={730} height={250}>
                                <Pie
                                    data={barChartData}
                                    cx="50%"
                                    cy="50%"
                                    dataKey="total_product_count" // make sure to map the dataKey to "value"
                                    innerRadius={60} // the inner and outer radius helps to create the progress look
                                    outerRadius={80}
                                >
                                    {barChartData.map((entry, index) => {
                                        if (index === 1 || index === 2) { // the main change is here!!
                                            return <Cell key={`cell-${index}`} fill="#f3f6f9" />;
                                        }
                                        return <Cell key={`cell-${index}`} fill="green" />;
                                    })}
                                    <Label
                                        content={<CustomLabel viewBox={['cx', 'cy']} noOfBubbleTeaSold={barChartData[0]?.['total_product_count']} noCost={barChartData[0]?.['total_product_price']} />}
                                        position="center"
                                    />
                                </Pie>
                            </PieChart>)}

                            {barChartData?.length === 0 ? <div className='text-center' >No data available</div> : ""}
                        </div>
                    </div>
                </div>
            </section>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2>Return Information</h2>
                            <p>You can see return chart here.</p>
                            <DateChartFilters />
                            {returnData?.length > 0 && (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart
                                        width={500}
                                        height={400}
                                        data={returnData}
                                        margin={{ top: 25, right: 0, left: 0, bottom: 25 }}
                                    >
                                        <XAxis dataKey="created_at" dy="25" />
                                        <YAxis />
                                        <Tool content={CustomTooltipBar} animationDuration={0} />
                                        <Legend />
                                        <CartesianGrid stroke="rgba(0,0,0,0.1)" vertical={false} />
                                        <Bar
                                            dataKey="product_quantity"
                                            barSize={50}
                                        >
                                            {returnData.map((entry, index) => (
                                                <Cell fill="#0070dc" />
                                            ))}
                                        </Bar>
                                        <Bar
                                            dataKey="total_return"
                                            barSize={50}
                                        >
                                            {returnData.map((entry, index) => (
                                                <Cell fill="#00c9ad" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}

                            {returnData?.length === 0 ? <div className='text-center' >No data available</div> : ""}

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