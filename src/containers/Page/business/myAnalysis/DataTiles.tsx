import { useState, useEffect } from 'react';
import IntlMessages from "../../../../components/utility/intlMessages";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import moment from 'moment';
import { dataTiles } from '../../../../redux/pages/vendorLogin';
import { formatprice, getCurrentMonth, percentageOF } from '../../../../components/utility/allutils';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { siteConfig } from '../../../../settings';

function MyAnalysisDataTiles(props) {
    let currentDate = moment().endOf('month').format('MM/DD/YYYY');
    let oldDate = moment().startOf('month').format('MM/DD/YYYY');
    let quater = moment().quarter();
    let year = moment().year();
    const [dataTilesData, setDataTilesData] = useState([]);
    const [currentQuater, setCurrentQuater] = useState(quater);
    const [currentMonthkey, setCurrentMonthKey] = useState(getCurrentMonth().num)
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth().name)
    const [quaterSlider, setQuaterSlider] = useState('')

    const [currentYear, setCurrentYear] = useState(year);

    const [showStates, setShowStates] = useState({ showYears: false, sowQuaters: false, showMonth: true, active: 0 });
    useEffect(() => {
        getDataTiles(oldDate, currentDate);
        return () => {
            setDataTilesData([])
        }
    }, [])





    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        if (results && results.data && results.data.length > 0) {
            console.log(results?.data[0])
            setDataTilesData(results?.data[0])
        } else {

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
            setDataTilesData([])

            getDataTiles(dates['start'], dates['end'])
        } else if (flag === 1) {
            let quater = moment().quarter();
            setCurrentQuater(quater)
            setShowStates({ showYears: false, sowQuaters: true, showMonth: false, active: 1 })
            setDataTilesData([])

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
            setDataTilesData([])

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
        setDataTilesData([])

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
        setDataTilesData([])

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
        setDataTilesData([])

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

        setDataTilesData([])
        getDataTiles(startOfMonth, endOfMonth);
    }


    function handleChangeRightYear(i) {
        let year = currentYear + 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);

        setDataTilesData([])
        getDataTiles(startOfMonth, endOfMonth);
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
    return (
        <section className="my_profile_sect mb-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-sm-12">
                        <h2><IntlMessages id="datatiles" /></h2>
                        <DateChartFilters data="datatiles" />


                        <div className="row mb-4" style={{ columnCount: 3 }}>
                            <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                <div className="card-info">
                                    <h5>Number of Sales<OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                                Number of Sales</Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger></h5>
                                    <div className="stats">
                                        <h3>{dataTilesData['totalOrder'] ? dataTilesData['totalOrder'] : 0}</h3>
                                        <div className="text-next">

                                            <div className='arrowsdatatile'>
                                                {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.totalOrder, dataTilesData['totalOrder']) > 0 ? <div className='data-increase'>
                                                    <div className='percentage'> {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.totalOrder, dataTilesData['totalOrder'])}%</div>
                                                    <><i className="fa fa-caret-up" aria-hidden="true"></i><i className="fa fa-caret-down" aria-hidden="true"></i></></div> :
                                                    <div className='data-decrease'>
                                                        <div className='percentage'> {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.totalOrder, dataTilesData['totalOrder'])}%</div><><i className="fa fa-caret-up" aria-hidden="true"></i><i className="fa fa-caret-down" aria-hidden="true"></i></></div>}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                <div className="card-info">
                                    <h5>Number of Customers<OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                                Number of Customers
                                            </Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger>
                                    </h5>
                                    <div className="stats">
                                        <h3>{dataTilesData['totalCustomer'] ? dataTilesData['totalCustomer'] : 0}</h3>
                                        <div className="text-next">

                                            <div className='arrowsdatatile'>
                                                {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.totalCustomer, dataTilesData['totalCustomer']) > 0 ? <div className='data-increase'>
                                                    <div className='percentage'> {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.totalCustomer, dataTilesData['totalCustomer'])}%</div>
                                                    <><i className="fa fa-caret-up" aria-hidden="true"></i><i className="fa fa-caret-down" aria-hidden="true"></i></></div> :
                                                    <div className='data-decrease'>
                                                        <div className='percentage'> {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.totalCustomer, dataTilesData['totalCustomer'])}%</div><><i className="fa fa-caret-up" aria-hidden="true"></i><i className="fa fa-caret-down" aria-hidden="true"></i></></div>}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                <div className="card-info">
                                    <h5>Sales KPI<OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                            <Tooltip id="" {...props} >
                                                Sales KPI
                                            </Tooltip>
                                        )}
                                        placement="right"
                                    ><i className="fas fa-info-circle" ></i>
                                    </OverlayTrigger></h5>
                                    <div className="stats">
                                        <h3>{dataTilesData['payoutAmount'] ? siteConfig.currency + ' ' + formatprice(dataTilesData['payoutAmount']) : 0}</h3>
                                        <div className="text-next">

                                            <div className='arrowsdatatile'>
                                                {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.payoutAmount, dataTilesData['payoutAmount']) > 0 ? <div className='data-increase'>
                                                    <div className='percentage'> {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.payoutAmount, dataTilesData['payoutAmount'])}%</div>
                                                    <><i className="fa fa-caret-up" aria-hidden="true"></i><i className="fa fa-caret-down" aria-hidden="true"></i></></div> :
                                                    <div className='data-decrease'>
                                                        <div className='percentage'> {percentageOF(dataTilesData?.['tiles_information']?.previousData[0]?.payoutAmount, dataTilesData['payoutAmount'])}%</div><><i className="fa fa-caret-up" aria-hidden="true"></i><i className="fa fa-caret-down" aria-hidden="true"></i></></div>}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>




            </div >
        </section >
    )
}

export default MyAnalysisDataTiles;