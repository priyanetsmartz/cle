import { useState, useEffect, useReducer } from 'react';
import IntlMessages from "../../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import moment from 'moment';
import { dataTiles } from '../../../../redux/pages/vendorLogin';
import { getCurrentMonth } from '../../../../components/utility/allutils';
import CircularProgressBar from './CircularProgress';


function MyAnalysisCustomer(props) { 
    let currentDate = moment().endOf('month').format('MM/DD/YYYY');
    let oldDate = moment().startOf('month').format('MM/DD/YYYY');
    let quater = moment().quarter();
    let year = moment().year();
    const [loader, setLoader] = useState(false);
    const [currentQuater, setCurrentQuater] = useState(quater);
    const [currentMonthkey, setCurrentMonthKey] = useState(getCurrentMonth().num)
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth().name)
    const [quaterSlider, setQuaterSlider] = useState('')
    const [customerData, setCustomerData] = useState([]);
    const [showStates, setShowStates] = useState({ showYears: false, sowQuaters: false, showMonth: true, active: 0 });
    const [currentYear, setCurrentYear] = useState(year);

    let data = []
    data['all'] = 0;
    data['newCustomer'] = 0;
    data['repeatCustomer'] = 0;
    useEffect(() => {
        getDataTiles(oldDate, currentDate);

        setCustomerData(data);
        return () => {
            setCustomerData([]);
        }
    }, [])
    async function getDataTiles(oldDate, currentDate) {
        setLoader(true)
        let results: any = await dataTiles(oldDate, currentDate);
        if (results && results.data && results.data.length > 0) {
            setLoader(false)
            let tiles_information = results?.data[0]?.tiles_information;

            let newCustomer = calculatePercentage(tiles_information?.customers?.one_time_customer, tiles_information?.customers?.total_orders);

            let repeatCustomer = calculatePercentage(tiles_information?.customers?.repeated_customer, tiles_information?.customers?.total_orders);
            let data = []
            data['all'] = tiles_information?.customers?.total_orders ? 100 : 0;
            data['newCustomer'] = newCustomer ? Math.ceil(newCustomer) : 0;
            data['repeatCustomer'] = repeatCustomer ? Math.ceil(repeatCustomer) : 0;
            data['totalcustomer'] = tiles_information?.customers?.total_orders ? tiles_information?.customers?.total_orders : 0;
            data['repeated_customer'] = tiles_information?.customers?.repeated_customer ? tiles_information?.customers?.repeated_customer : 0;
            data['one_time_customer'] = tiles_information?.customers?.one_time_customer ? tiles_information?.customers?.one_time_customer : 0;
            setCustomerData(data)
        } else {
            setLoader(false)
        }
    }

    function calculatePercentage(num, base) {
        return (num / base) * 100;

    }
    const handleChange = (flag) => {
        let dates = [];
        if (flag === 0) {
            setShowStates({ showYears: false, sowQuaters: false, showMonth: true, active: 0 })
            setCurrentMonthKey(getCurrentMonth().num)
            setCurrentMonth(getCurrentMonth().name)
            dates['start'] = moment().startOf('month').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('month').format('MM/DD/YYYY');
            setCustomerData(data)
            setLoader(true)
            getDataTiles(dates['start'], dates['end'])
        } else if (flag === 1) {
            let quater = moment().quarter();
            setCurrentQuater(quater)
            setShowStates({ showYears: false, sowQuaters: true, showMonth: false, active: 1 })
            setCustomerData(data)
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
            setCustomerData(data)
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
        setCustomerData(data)
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
        setCustomerData(data)
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
        setCustomerData(data)
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
        setCustomerData(data)
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }


    function handleChangeRightYear(i) {
        let year = currentYear + 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);
        setCustomerData(data)
        setLoader(true)
        getDataTiles(startOfMonth, endOfMonth);
    }




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
                <div className="row">
                    <div className="col-sm-12">
                        <h2>Customer Information</h2>
                        <p className='datap'>You can see Customer information chart here</p>
                        <DateChartFilters data="piechart" />
                        {loader && (
                            <div className="checkout-loading text-center" >
                                <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                            </div>
                        )}
                        {customerData?.['all'] > 0 && (
                            <div className='row mb-4' style={{ columnCount: 3 }}>
                                <div className='col-md-4 text-center'>
                                    <span><b>Total customers: {customerData?.['totalcustomer']}</b></span>
                                    <br />
                                    <div className='circularDataInner' >
                                        <CircularProgressBar
                                            strokeWidth="10"
                                            sqSize="150"
                                            percentage={customerData?.['all']} />
                                    </div>
                                </div>

                                <div className='col-md-4 text-center'>
                                    <span><b>Persistant  customers: {customerData?.['repeated_customer']}</b></span>
                                    <br />
                                    <div className='circularDataInner' >
                                        <CircularProgressBar
                                            strokeWidth="10"
                                            sqSize="150"
                                            percentage={customerData?.['repeatCustomer']} />
                                    </div>
                                </div>

                                <div className='col-md-4 text-center'>
                                    <span><b>New  customers: {customerData?.['one_time_customer']}</b></span>
                                    <br />
                                    <div className='circularDataInner' >
                                        <CircularProgressBar
                                            strokeWidth="10"
                                            sqSize="150"
                                            percentage={customerData?.['newCustomer']} />
                                    </div>
                                </div>

                            </div>
                        )}
                      {(customerData?.['all'] === 0 && !loader) ? <div className='text-center' >No data available</div> : ""}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyAnalysisCustomer;