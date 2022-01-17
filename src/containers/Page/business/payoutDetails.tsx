import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { connect } from 'react-redux'
import './deletepop.css';
import IntlMessages from "../../../components/utility/intlMessages";
import { getPayoutDetails } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import moment from 'moment';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function MyPayoutDetails(props) {

    useEffect(() => {
        getDetails()
    }, [props.languages]);
    const { payoutId }: any = useParams();
    const [payoutData, setPayoutData] = useState({});
    const [payoutOrders, setPayoutOrders] = useState([]);
    const [invoiceData, setInvoiceData] = useState({});
    const [allData, setAlldata] = useState({})
    const [subtotal, setSubtotal] = useState(0)
    const [commission, setCommission] = useState(0)
    const [withdrawal, setWithdrawal] = useState(0)
    const [myPayoutDetails, setMyPayoutDetails] = useState([])

    const [dateOfRequest, setDateOfRequest] = useState('')
    const [dateOfPayment, setDateOfPayment] = useState('')
    const [numberOfOrders, setNumberOfOrders] = useState(0)
    const [billType, setBillType] = useState('')

    async function getDetails() {
        let result: any = await getPayoutDetails(payoutId)
        //console.log("reult3",result);
        if (result && result.data[0]) {
            setAlldata(result.data[0])
            setPayoutData(result.data[0].PayoutData[0])
            setPayoutOrders(result.data[0].PayoutOrders)
            setInvoiceData(result.data[0].invoiceData)
            setSubtotal(result.data[0].subtotal)
            setCommission(result.data[0].commission)
            setWithdrawal(result.data[0].subtotal - result.data[0].commission)
            setDateOfRequest(moment(result.data[0].PayoutData[0].created_at).format('DD MMMM YYYY'))
            setNumberOfOrders(result.data[0].PayoutData[0].total_orders)
            setDateOfPayment(moment(result.data[0].invoiceData.invoiceDate).format('DD MMMM YYYY'))
        }

        let dataObj: any = result && result.data[0] && result.data[0].PayoutOrders ? result.data[0].PayoutOrders : []

        let dataListing = [];
        if (dataObj.length > 0) {
            //console.log("dataOj", dataObj)
            dataListing = dataObj.map(data => {
                console.log("data", data)
                let detailLoop: any = {};
                detailLoop.orderNumber = data.order_increment_id;
                detailLoop.link_to_orderdetails = data.link_to_orderdetails;
                detailLoop.date = moment(data.order_created_at).format('DD MMMM YYYY');
                detailLoop.total = data.amount.total_payout
                return detailLoop;
            })
        }
        setMyPayoutDetails(dataListing)

    }

    const columns = [{
        name: 'Order',
        selector: row => row.orderNumber,
    },
    {
        name: 'Date',
        selector: row => row.date,
    },
    {
        name: 'Link to order details',
        cell: row => (
            <Link to={`/vendor/sales-orders/${row.link_to_orderdetails}`}>View Order Detail</Link>

        )
    },
    {
        name: 'Total',
        selector: row => row.total,
    }
    ]
    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1><IntlMessages id="payout.detail" /></h1>
                            <h2><IntlMessages id="payoutdetail.description" /></h2>
                        </div>
                        <section>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="dateofrequest" /></h6>
                                                    <p>{dateOfRequest}</p>
                                                </div>

                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="dateofpayment" /></h6>
                                                    <p>{dateOfPayment}</p>
                                                </div>


                                            </div>
                                            <div className="row">

                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="i/r" /></h6>
                                                    <p>{billType}</p>
                                                </div>

                                                <div className="col-sm-6">
                                                    <h6><IntlMessages id="nooforders" /></h6>
                                                    <p>{numberOfOrders}</p>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="">
                                            <table>
                                                <thead><IntlMessages id="withdrawalamount" /></thead>
                                                <tbody>
                                                    <tr>
                                                        <td><IntlMessages id="withdrawalamount" /></td>
                                                        <th className="text-end">{siteConfig.currency}{subtotal}</th>
                                                    </tr>
                                                    <tr>
                                                        <td><IntlMessages id="commission" /></td>
                                                        <th className="text-end">{siteConfig.currency}{commission}</th>
                                                    </tr>

                                                    <tr>
                                                        <td><IntlMessages id="order.total" /></td>
                                                        <th className="text-end">{siteConfig.currency}{withdrawal}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="container mb-5">

                            <DataTable
                                columns={columns}
                                data={myPayoutDetails}
                            />
                        </div>


                    </div>
                </div>
            </div>
        </main >
    )
}
const mapStateToProps = (state) => {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages

    };
}

export default connect(
    mapStateToProps
)(MyPayoutDetails);