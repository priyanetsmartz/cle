import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import IntlMessages from "../../../components/utility/intlMessages";
import { dataTiles } from '../../../redux/pages/vendorLogin';
import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
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
    const intl= useIntl()
    const [active, setActive] = useState(0);
    const [dataTilesData, setDataTilesData] = useState([]);
    const [pdata, setPdata] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [pieChart, setPieChart] = useState([]);
    const [showMonth, setShowMonth] = useState(true);
    let currentDate = moment().endOf('month').format('MM/DD/YYYY');
    let oldDate = moment().startOf('month').format('MM/DD/YYYY');
    const [currentMonthkey, setCurrentMonthKey] = useState(getCurrentMonth().num)
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth().name)
    useEffect(() => {
        getDataTiles(oldDate, currentDate);
    }, [])

    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        if (results && results.data && results.data.length > 0) {
            //    console.log(results.data[0])
            let tiles_information = results?.data[0]?.tiles_information
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
            dates['start'] = moment().startOf('month').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('month').format('MM/DD/YYYY');
        } else if (1) {
            setShowMonth(false)
            let quater = moment().quarter();
            dates['start'] = moment().quarter(quater).startOf('quarter').format('DD/MM/YYYY');
            dates['end'] = moment().quarter(quater).endOf('quarter').format('DD/MM/YYYY');
        } else {
            setShowMonth(false)
            dates['start'] = moment().startOf('year').format('DD/MM/YYYY');
            dates['end'] = moment().endOf('year').format('DD/MM/YYYY');
        }
        setActive(flag)
        //  setflagDates(dates)
        getDataTiles(dates['start'], dates['end'])
    }

    function handleChangeLeft(i) {

        let monthKey = currentMonthkey - 1;
        let month = moment.monthsShort().filter((name, i) => {
            return i === monthKey
        })
        console.log(monthKey)
        if (monthKey === -1) return false;
        setCurrentMonthKey(monthKey);
        setCurrentMonth(month[0])
        let input = monthKey + 1;
        const output = moment(input, "MM");
        //  console.log(output)
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


    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="datatiles" /></h1>
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
                        </div>
                    </div>


                    <div className="row mb-4" style={{ columnCount: 3 }}>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                            <div className="card-info">
                                <h5><IntlMessages id="ordertotal" /> <i className="fas fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom"></i></h5>
                                <div className="stats">
                                    <h3>{dataTilesData['totalOrder'] ? dataTilesData['totalOrder'] : 0}</h3>
                                    {/* <h4>9%</h4> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                            <div className="card-info">
                                <h5><IntlMessages id="order.orders" /> <i className="fas fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom"></i></h5>
                                <div className="stats">
                                    <h3>{dataTilesData['averageOrder'] ? intl.formatMessage( {id:siteConfig.currency} ) + ' ' + formatprice(parseFloat(dataTilesData['averageOrder']).toFixed(2)) : 0}</h3>
                                    {/* <h4>10%</h4> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                            <div className="card-info">
                                <h5><IntlMessages id="payments" /> <i className="fas fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom"></i></h5>
                                <div className="stats">
                                    <h3>{dataTilesData['payoutAmount'] ? intl.formatMessage( {id:siteConfig.currency} ) + ' ' + formatprice(parseFloat(dataTilesData['payoutAmount']).toFixed(2)) : 0}</h3>
                                    {/* <h4>5%</h4> */}
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
                            <h1>My Analysis</h1>
                            <p>Order Information</p>
                            <ResponsiveContainer width="100%" aspect={3}>
                                <LineChart data={pdata} margin={{ right: 300 }}>
                                    <CartesianGrid />
                                    <XAxis dataKey="created_at"
                                        interval={'preserveStartEnd'} />
                                    <YAxis  ></YAxis>
                                    <Legend />
                                    <Tooltip />
                                    <Line dataKey="total_cost"
                                        stroke="black" activeDot={{ r: 8 }} />
                                    <Line dataKey="item_qty"
                                        stroke="red" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>


                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h3>Product Information</h3>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={pieChart}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="total_payout_amount"
                                >
                                </Pie>
                            </PieChart>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h3>Payout Information</h3>
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
                                <XAxis dataKey="totalProductCount" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalProductPrice" fill="#8884d8" />

                            </BarChart>
                        </div>
                    </div>
                </div>
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
)(MyAnalysis);