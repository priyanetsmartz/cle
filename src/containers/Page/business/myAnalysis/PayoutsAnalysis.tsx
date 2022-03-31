import { useState, useEffect } from 'react';
import IntlMessages from "../../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import moment from 'moment';
import { dataTiles } from '../../../../redux/pages/vendorLogin';
import { getCurrentMonth, capitalize } from '../../../../components/utility/allutils';
import { useIntl } from 'react-intl';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip as Tool,
    Cell,
    Legend
} from 'recharts';
import { siteConfig } from '../../../../settings';
import LoaderGif from '../../Loader';

function MyAnalysisPayouts(props) {
    const intl = useIntl()
    let currentDate = moment().endOf('month').format('MM/DD/YYYY');
    let oldDate = moment().startOf('month').format('MM/DD/YYYY');
    let quater = moment().quarter();
    let year = moment().year();
    const [loader, setLoader] = useState(false);  
    const [currentQuater, setCurrentQuater] = useState(quater);
    const [currentMonthkey, setCurrentMonthKey] = useState(getCurrentMonth().num)
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth().name)
    const [quaterSlider, setQuaterSlider] = useState('')
    const [pieChart, setPieChart] = useState([]);   
    const [currentYear, setCurrentYear] = useState(year);
    const [showStates, setShowStates] = useState({ showYears: false, sowQuaters: false, showMonth: true, active: 0 });
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        getDataTiles(oldDate, currentDate);
        return () => {
            setPieChart([]);
        }
    }, [])
    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        setLoader(true)
        if (results && results.data && results.data.length > 0) {
            let tiles_information = results?.data[0]?.tiles_information;
            setPieChart(tiles_information?.payout_information)
            setLoader(false)
        } else {

            setLoader(false)
        }
    }

    const handleChange = (flag) => {
        let dates = [];
        if (flag === 0) {
            setShowStates({ showYears: false, sowQuaters: false, showMonth: true, active: 0 })
            setCurrentMonthKey(getCurrentMonth().num)
            setCurrentMonth(getCurrentMonth().name)
            dates['start'] = moment().startOf('month').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('month').format('MM/DD/YYYY');
            setPieChart([])
            setLoader(true)
            getDataTiles(dates['start'], dates['end'])
        } else if (flag === 1) {
            let quater = moment().quarter();
            setCurrentQuater(quater)
            setShowStates({ showYears: false, sowQuaters: true, showMonth: false, active: 1 })
            setPieChart([])
            setLoader(true)
            let start = moment().quarter(quater).startOf('quarter').format('MMM');
            let end = moment().quarter(quater).endOf('quarter').format('MMM');
            let part = start + '-' + end;

            let startOfMonth = moment().quarter(quater).startOf('quarter').format('MM/DD/YYYY');
            let endOfMonth = moment().quarter(quater).endOf('quarter').format('MM/DD/YYYY');
            getDataTiles(startOfMonth, endOfMonth);
            setQuaterSlider(part);
        } else {
            setCurrentYear(year)
            setShowStates({ showYears: true, sowQuaters: false, showMonth: false, active: 2 })
            setPieChart([])
            setLoader(true)
            dates['start'] = moment().startOf('year').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('year').format('MM/DD/YYYY');
            getDataTiles(dates['start'], dates['end'])
        }   

    }
    function handleQuater(quater) {
        let start = moment().quarter(quater).startOf('quarter').format('MMM');
        let end = moment().quarter(quater).endOf('quarter').format('MMM');
        let part = start + '-' + end;

        let startOfMonth = moment().quarter(quater).startOf('quarter').format('MM/DD/YYYY');
        let endOfMonth = moment().quarter(quater).endOf('quarter').format('MM/DD/YYYY');
        setPieChart([]);
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
        setQuaterSlider(part);
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
        setPieChart([]);
        setLoader(true)
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
        setPieChart([]);
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
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


    function handleChangeLeftYear(i) {
        let year = currentYear - 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);
        setPieChart([]);
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }


    function handleChangeRightYear(i) {
        let year = currentYear + 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);
        setPieChart([]);
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (payload === null) return
        if (active)
            return (
                <div className="custom-tooltip">
                    <h5>Details</h5>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Total Amount</b> <br />{siteConfig.currency} {payload[0].payload.total_payout_amount}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Payout Date</b> <br /> {payload[0].payload.payout_created_at}</span>
                    </p>
                    {/* <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Discount Amount</b> <br />{siteConfig.currency} {payload[0].payload.discount_amount}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Tax Amount</b> <br />{siteConfig.currency} {payload[0].payload.tax_amount}</span>
                    </p> */}
                </div>
            );
        return null;
    };



    const DateChartFilters = (type) => {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <ul className='filter-tiles'>
                        <li><Link to="#" className={showStates.active === 0 ? 'active' : ""}  onClick={() => { handleChange(0) }} ><IntlMessages id="month" /></Link></li>
                        <li><Link to="#" className={showStates.active === 1 ? 'active' : ""}  onClick={() => { handleChange(1) }}><IntlMessages id="quarter" /></Link></li>
                        <li><Link to="#" className={showStates.active === 2 ? 'active' : ""} onClick={() => { handleChange(2) }} ><IntlMessages id="year" /></Link></li>
                    </ul>

                    {showStates.showMonth && (
                        <ul className='monthsname pagination justify-content-center align-items-center'>
                            <p className='leftarrow' onClick={() => { handleChangeLeft(1) }}> <i className="fa fa-caret-left"></i> </p>
                            {
                                <p data-attribute={getCurrentMonth().num}>{currentMonth}</p>
                            }
                            <p className='rightarrow' onClick={() => { handleChangeRight(1) }}> <i className="fa fa-caret-right"></i> </p>
                        </ul>
                    )}
                    {showStates.sowQuaters && (
                        <ul className='monthsname pagination justify-content-center align-items-center'>
                            <p className='leftarrow' onClick={() => { handleChangeLeftQuater(1) }}> <i className="fa fa-caret-left"></i> </p>
                            {
                                <p>{quaterSlider}</p>
                            }
                            <p className='rightarrow' onClick={() => { handleChangeRightQuater(1) }}> <i className="fa fa-caret-right"></i> </p>
                        </ul>
                    )}
                    {showStates.showYears && (
                        <ul className='monthsname pagination justify-content-center align-items-center'>
                            <p className='leftarrow' onClick={() => { handleChangeLeftYear(1) }}> <i className="fa fa-caret-left"></i> </p>
                            {
                                <p>{currentYear}</p>
                            }
                            <p className='rightarrow' onClick={() => { handleChangeRightYear(1) }}> <i className="fa fa-caret-right"></i> </p>
                        </ul>
                    )}
                </div>
            </div>
        )
    }
    return (
        <section className="my_profile_sect mb-5">
            <div className="container">
                <div className="row  mb-4">
                    <div className="col-sm-12">
                        <h2>{intl.formatMessage({ id: 'payoutInformation' })}</h2>
                        <p className='datap'>Insights about the status of the payouts and sum of the payout amount issued. </p>
                        <DateChartFilters data="piechart" />
                        <div className="row mb-4" style={{ columnCount: 3 }}>
                            {loader && (
                                <div className="checkout-loading text-center" >
                                    {/* <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i> */}
                                    <LoaderGif />
                                </div>
                            )}
                            {pieChart?.length > 0 && (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart height={300}>

                                        <Pie
                                            data={pieChart}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"                                            
                                            labelLine={false}
                                            dataKey="total_payout_amount"
                                            label={({
                                                cx,
                                                cy,
                                                midAngle,
                                                innerRadius,
                                                outerRadius,
                                                percent,
                                                index
                                            }: any) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                return (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        fill="white"
                                                        textAnchor={x > cx ? "start" : "end"}
                                                        dominantBaseline="central"
                                                    >
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                                );
                                            }}>
                                            {
                                                pieChart.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                            }
                                        </Pie>
                                        <Tool content={CustomTooltip} animationDuration={0} position={{ x: 700, y: 0 }} />
                                        {/* <Legend layout="horizontal" verticalAlign="top" align="center" />
                                     */}
                                     <Legend payload={
    pieChart.map(
      (item, index) => ({
        id: item.payout_status,
        type: "square",
        value: `${capitalize(item.payout_status)}`,
        color: COLORS[index % COLORS.length]
      })
    )
  }
  />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            {(pieChart?.length === 0 && !loader) ? <div className='text-center' >No data available</div> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyAnalysisPayouts;