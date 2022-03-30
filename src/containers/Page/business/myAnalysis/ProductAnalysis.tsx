import { useState, useEffect } from 'react';
import IntlMessages from "../../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import moment from 'moment';
import { dataTiles } from '../../../../redux/pages/vendorLogin';
import { getCurrentMonth } from '../../../../components/utility/allutils';
import { useIntl } from 'react-intl';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as Tool,
    Label
} from 'recharts';
import { siteConfig } from '../../../../settings';
import LoaderGif from '../../Loader';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from "react-bootstrap/Tooltip";

function MyAnalysisProducts(props) {
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
    const [barChartData, setBarChartData]:any = useState({});

    const [currentYear, setCurrentYear] = useState(year);
    const [showStates, setShowStates] = useState({ showYears: false, sowQuaters: false, showMonth: true, active: 0 });
    useEffect(() => {
        getDataTiles(oldDate, currentDate);
        return () => {
            setBarChartData([])
        }
    }, [])

    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        setLoader(true)
        if (results && results.data && results.data.length > 0) {
            let tiles_information = results?.data[0]?.tiles_information;
            setBarChartData(tiles_information?.product_information)
            // console.log("#############",tiles_information.product_information);
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
            setBarChartData([])
            setLoader(true)
            getDataTiles(dates['start'], dates['end'])
        } else if (flag === 1) {
            let quater = moment().quarter();
            setCurrentQuater(quater)
            setShowStates({ showYears: false, sowQuaters: true, showMonth: false, active: 1 })
            setBarChartData([])
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
            setBarChartData([])
            setLoader(true)
            dates['start'] = moment().startOf('year').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('year').format('MM/DD/YYYY');
            getDataTiles(dates['start'], dates['end'])
        }

    }

    function handleQuater(quater) {
        setQuaterSlider('')
        let start = moment().quarter(quater).startOf('quarter').format('MMM');
        let end = moment().quarter(quater).endOf('quarter').format('MMM');
        let part = start + '-' + end;

        let startOfMonth = moment().quarter(quater).startOf('quarter').format('MM/DD/YYYY');
        let endOfMonth = moment().quarter(quater).endOf('quarter').format('MM/DD/YYYY');
        setBarChartData([])
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
        setBarChartData([])
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
        setBarChartData([])
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
                            fontSize: "12px",
                            fill: "#000"
                        }}
                    >
                        Total Product Cost:
                    </tspan>
                </text>
                <text x={cx - 40} y={cy + 30}>
                    <tspan
                        style={{
                            fontSize: "12px",
                            fill: "#000"
                        }}
                    >
                        {siteConfig.currency} {noCost}
                    </tspan>
                </text>
            </>
        );
    };
    function handleChangeLeftYear(i) {
        let year = currentYear - 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);
        setBarChartData([])
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }


    function handleChangeRightYear(i) {
        let year = currentYear + 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);
        setBarChartData([])
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }
    const DateChartFilters = (type) => {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <ul className='filter-tiles'>
                        <li><Link to="#" className={showStates.active === 0 ? 'active' : ""} onClick={() => { handleChange(0) }} ><IntlMessages id="month" /></Link></li>
                        <li><Link to="#" className={showStates.active === 1 ? 'active' : ""} onClick={() => { handleChange(1) }} ><IntlMessages id="quarter" /></Link></li>
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
    const CustomTooltip = ({ active, payload, label }) => {
        if (payload === null) return
        if (active)
            return (
                <div className="custom-tooltip">
                    <h5>Details</h5>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Total Products</b> <br />{payload[0].payload.total_product_count}</span>
                    </p>
                    <p className="desc-tooltip">
                        <span className="value-tooltip"><b>Total Product Price</b> <br />{siteConfig.currency} {payload[0].payload.total_product_price}</span>
                    </p>
                </div>
            );
        return null;
    };
    return (
        <section className="my_profile_sect mb-5">
            <div className="container">
                <div className="row  mb-4">
                    <div className="col-sm-12">
                        <h2>{intl.formatMessage({ id: 'productInformation' })}</h2>
                        <p className='datap'>Number of products grouped by month/date/year and status of the product.</p>
                        {/* <DateChartFilters data="product" /> */}
                        {loader && (
                            <div className="checkout-loading text-center" >
                                {/* <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i> */}
                                <LoaderGif />
                            </div>
                        )}
                        {/* {(barChartData?.length > 0 && barChartData?.[0]?.total_product_count > 0) ? (

                            <PieChart width={730} height={250}>
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
                                <Tool content={CustomTooltip} animationDuration={0} position={{ x: 600, y: 0 }} />
                            </PieChart>

                        ) : loader ? "" : <div className='text-center' >No data available</div>} */}
                         <div className="row mb-4" style={{ columnCount: 3 }}>
                            <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                <div className="card-info">
                                    <h5>Active Products<OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                                Number of active products</Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger></h5>
                                    <div className="stats">
                                        <h3>{barChartData?.active?.count}</h3>
                                        <div className="text-next">
                                            <div className='arrowsdatatile'>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                <div className="card-info">
                                    <h5>Inactive Products<OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                                Number of inactive products
                                            </Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger>
                                    </h5>
                                    <div className="stats">
                                        <h3>{barChartData?.inactive?.count}</h3>
                                        <div className="text-next">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                <div className="card-info">
                                    <h5>Total Products<OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                               Total number of products
                                            </Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger></h5>
                                    <div className="stats">
                                        <h3>{barChartData?.total?.count}</h3>
                                        <div className="text-next">
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyAnalysisProducts;