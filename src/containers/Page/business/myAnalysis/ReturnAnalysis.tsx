import { useState, useEffect } from 'react';
import IntlMessages from "../../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import moment from 'moment';
import { dataTiles } from '../../../../redux/pages/vendorLogin';
import { getCurrentMonth } from '../../../../components/utility/allutils';
import {
    Legend, Tooltip as Tool,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import LoaderGif from '../../Loader';

function MyAnalysisReturn(props) {
    let year = moment().year();
    let currentDate = moment().endOf('month').format('MM/DD/YYYY');
    let oldDate = moment().startOf('month').format('MM/DD/YYYY');
    let quater = moment().quarter();
    const [loader, setLoader] = useState(false);

    const [currentQuater, setCurrentQuater] = useState(quater);
    const [currentMonthkey, setCurrentMonthKey] = useState(getCurrentMonth().num)
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth().name)
    const [quaterSlider, setQuaterSlider] = useState('')
    const [returnData, setReturnData] = useState([]);
    const [showStates, setShowStates] = useState({ showYears: false, sowQuaters: false, showMonth: true, active: 0 });
    const [currentYear, setCurrentYear] = useState(year);
    useEffect(() => {
        getDataTiles(oldDate, currentDate);
        return () => {
            setReturnData([])
        }
    }, [])

    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        setLoader(true)
        if (results && results.data && results.data.length > 0) {
            let tiles_information = results?.data[0]?.tiles_information;
            setReturnData(tiles_information?.return_information)
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
            setReturnData([])
            setLoader(true)
            getDataTiles(dates['start'], dates['end'])
        } else if (flag === 1) {
            let quater = moment().quarter();
            setCurrentQuater(quater)
            setShowStates({ showYears: false, sowQuaters: true, showMonth: false, active: 1 })
            setReturnData([])
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
            setReturnData([])
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
        setReturnData([])
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
        setReturnData([])
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
        setReturnData([])
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
        setReturnData([])
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }


    function handleChangeRightYear(i) {
        let year = currentYear + 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);
        setReturnData([])
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }

    const CustomizedAxisTick = ({ x, y, payload }) => {
        let dayArray = payload.value.split(" ");
        const dateTip = dayArray[0].slice(0, -2) + ' ' + dayArray[1].slice(0, 3);
        return (
            <g transform={`translate(${x},${y})`} >
                <text x={20} y={10} dy={20} fontSize="0.90em" transform="rotate(-45)" textAnchor="end" fill="#363636">
                    {dateTip}</text>
            </g>
        );
    }

    const DateChartFilters = (type) => {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <ul className='filter-tiles'>
                        <li><Link to="#" className={showStates.active === 0 ? 'active' : ""} onClick={() => { handleChange(0) }} ><IntlMessages id="month" /></Link></li>
                        <li><Link to="#" className={showStates.active === 1 ? 'active' : ""} onClick={() => { handleChange(1) }}><IntlMessages id="quarter" /></Link></li>
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

    const CustomTooltipBar = ({ active, payload, label }) => {

        if (payload === null) return
        if (active)
            return (
                <div className="custom-tooltip">
                    <h5>Details</h5>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Return Date</b> <br />{payload[0].payload.created_at}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Returned products</b> <br />{payload[0].payload.product_quantity}</span>
                    </p>
                    {/* <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Total Return</b> <br />{payload[0].payload.total_return}</span>
                    </p> */}
                </div>
            );
        return null;
    };

    return (
        <section className="my_profile_sect mb-5">
            <div className="container">
                <div className="row  mb-4">
                    <div className="col-sm-12">
                        <h2>Return Information</h2>
                        <p className='datap'>Number of products that have been returned by CLE customers</p>
                        <DateChartFilters data="barchart" />
                        {loader && (
                            <div className="checkout-loading text-center" >
                                {/* <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i> */}
                                <LoaderGif />
                            </div>
                        )}
                        {returnData?.length > 0 && (
                            <BarChart
                                width={600}
                                height={400}
                                data={returnData}

                            >
                                <XAxis dataKey="created_at" height={50} dy="50" tick={CustomizedAxisTick} />
                                <YAxis />
                                <Tool content={CustomTooltipBar} animationDuration={0} position={{ x: 700, y: 0 }} />
                                <Legend payload={
                                    [
                                        { id: 'product_quantity', value: 'Returned products', type: 'square', color: '#0070dc' },
                                        // { id: 'total_return', value: 'Total Return', type: 'square', color: '#00c9ad' },
                                    ]
                                } />
                                <CartesianGrid stroke="rgba(0,0,0,0.1)" vertical={false} />
                                <Bar
                                    dataKey="product_quantity"
                                    barSize={50}
                                >
                                    {returnData.map((entry, index) => (
                                        <Cell key={index} fill="#0070dc" />
                                    ))}
                                </Bar>
                                {/* <Bar
                                    dataKey="total_return"
                                    barSize={50}
                                >
                                    {returnData.map((entry, index) => (
                                        <Cell key={index} fill="#00c9ad" />
                                    ))}
                                </Bar> */}
                            </BarChart>
                        )}

                        {returnData?.length === 0 ? <div className='text-center' >No data available</div> : ""}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyAnalysisReturn;