import { useState, useEffect } from 'react';
import IntlMessages from "../../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import moment from 'moment';
import { dataTiles } from '../../../../redux/pages/vendorLogin';
import { getCurrentMonth } from '../../../../components/utility/allutils';
import { useIntl } from 'react-intl';
import CircularProgressBar from './CircularProgress';

function MyAnalysisCustomer(props) {
    const intl = useIntl()
    let currentDate = moment().endOf('month').format('MM/DD/YYYY');
    let oldDate = moment().startOf('month').format('MM/DD/YYYY');
    let quater = moment().quarter();
    let year = moment().year();
    const [active, setActive] = useState(0);
    const [showMonth, setShowMonth] = useState(true);
    const [sowQuaters, setShowQuaters] = useState(false);
    const [currentQuater, setCurrentQuater] = useState(quater);
    const [currentMonthkey, setCurrentMonthKey] = useState(getCurrentMonth().num)
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth().name)
    const [quaterSlider, setQuaterSlider] = useState('')
    const [customerData, setCustomerData] = useState([]);
    const [showYears, setShowYears] = useState(false);
    const [currentYear, setCurrentYear] = useState(year);

    useEffect(() => {
        getDataTiles(oldDate, currentDate);
        let data = []
        data['all'] = 0;
        data['newCustomer'] = 0;
        data['repeatCustomer'] = 0;
        setCustomerData(data);
        return () => {
            setCustomerData([]);
        }
    }, [])
    async function getDataTiles(oldDate, currentDate) {
        let results: any = await dataTiles(oldDate, currentDate);
        if (results && results.data && results.data.length > 0) {
            let tiles_information = results?.data[0]?.tiles_information;

            let newCustomer = calculatePercentage(tiles_information?.customers?.one_time_customer, tiles_information?.customers?.total_orders);

            let repeatCustomer = calculatePercentage(tiles_information?.customers?.repeated_customer, tiles_information?.customers?.total_orders);
            let data = []
            data['all'] = tiles_information?.customers?.total_orders ? 100 : 0;
            data['newCustomer'] = newCustomer ? Math.ceil(newCustomer) : 0;
            data['repeatCustomer'] = repeatCustomer ? Math.ceil(repeatCustomer) : 0;
            data['totalcustomer'] = tiles_information?.customers?.total_orders;
            data['repeated_customer'] = tiles_information?.customers?.repeated_customer;
            data['one_time_customer'] = tiles_information?.customers?.one_time_customer;
            setCustomerData(data)
        }
    }

    function calculatePercentage(num, base) {
        return (num / base) * 100;

    }
    const handleChange = (flag) => {
        let dates = [];
        if (flag === 0) {
            setShowMonth(true)
            setShowQuaters(false)
            setShowYears(false);
            dates['start'] = moment().startOf('month').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('month').format('MM/DD/YYYY');
            getDataTiles(dates['start'], dates['end'])
        } else if (flag === 1) {
            setShowMonth(false)
            setShowQuaters(true)
            setShowYears(false);
            handleQuater(currentQuater);
        } else {
            setShowMonth(false)
            setShowQuaters(false)
            setShowYears(true);
            dates['start'] = moment().startOf('year').format('MM/DD/YYYY');
            dates['end'] = moment().endOf('year').format('MM/DD/YYYY');
            getDataTiles(dates['start'], dates['end'])
        }
        setActive(flag)

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
        getDataTiles(startOfMonth, endOfMonth);
    }


    function handleChangeRightYear(i) {
        let year = currentYear + 1;
        let startOfMonth = '01/01/' + year;
        let endOfMonth = '12/31/' + year;
        setCurrentYear(year);
        getDataTiles(startOfMonth, endOfMonth);
    }




    const DateChartFilters = (type) => {
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
                    {showYears && (
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
        <section className="my_profile_sect mb-4">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <h2>Customer Information</h2>
                        <p>You can see Customer information chart here</p>
                        <DateChartFilters data="piechart" />
                        <div className='row circularData'>
                            <div className='col-md-4'>
                                <span><b>Total customers: {customerData?.['totalcustomer']}</b></span>
                                <br />
                                <div className='circularDataInner' >
                                    <CircularProgressBar
                                        strokeWidth="10"
                                        sqSize="150"
                                        percentage={customerData?.['all']} />
                                </div>
                            </div>

                            <div className='col-md-4'>
                                <span><b>Persistant  customers: {customerData?.['repeated_customer']}</b></span>
                                <br />
                                <div className='circularDataInner' >
                                    <CircularProgressBar
                                        strokeWidth="10"
                                        sqSize="150"
                                        percentage={customerData?.['repeatCustomer']} />
                                </div>
                            </div>

                            <div className='col-md-4'>
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
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyAnalysisCustomer;