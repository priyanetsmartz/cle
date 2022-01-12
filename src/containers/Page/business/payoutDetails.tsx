import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { connect } from 'react-redux'
import './deletepop.css';
import IntlMessages from "../../../components/utility/intlMessages";
import { getPayoutDetails} from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';
import moment from 'moment';

function MyPayoutDetails(props) {
    
    useEffect(() => {
        getDetails()
    }, [props.languages]);
    const [payoutData, setPayoutData] = useState({});
    const [payoutOrders , setPayoutOrders] = useState ([]);
    const [invoiceData, setInvoiceData] = useState ({});
    const [allData, setAlldata] = useState({})
    const [subtotal, setSubtotal] = useState(0)
    const [commission, setCommission] = useState(0)
    const [withdrawal, setWithdrawal] = useState(0)
    const [myPayoutDetails, setMyPayoutDetails] = useState([])

    const [dateOfRequest, setDateOfRequest] = useState('')
    const [dateOfPayment, setDateOfPayment] = useState('')
    const [numberOfOrders, setNumberOfOrders] = useState(0)
    const [billType, setBillType] = useState('')

    async function getDetails(){
        let result:any = await getPayoutDetails()
        //console.log("reult3",result);
        if (result && result.data[0]){
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

        let dataObj: any = result && result.data[0] && result.data[0].PayoutOrders? result.data[0].PayoutOrders :[]

        let dataListing = [];
        if (dataObj.length>0){
            //console.log("dataOj", dataObj)
            dataListing = dataObj.map(data => {
               // console.log("data", data)
                let detailLoop:any = {};
                detailLoop.orderNumber  = data.order_increment_id ;
                detailLoop.date = moment(data.order_created_at).format('DD MMMM YYYY');
                detailLoop.total = data.total_payout
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
        selector: row => row.link,
    },
    {
        name: 'Total',
        selector: row => row.total,
    },]
    return (
        <div className="col-sm-9">
        <section className="my_profile_sect mb-4">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                    <h1><IntlMessages id="payout.detail" /></h1>
                    <p><IntlMessages id="payoutdetail.description" /></p> 
                    </div>
                </div>

                <div style = {{width:"100%", display:"inline-block"}}> 
                <div style = {{width:"40%", float:"left"}}>
                <div style = {{display:"inline-block", width:"100%"}}>
                <span style = {{float:"left"}}> 
                    <div>Date of request</div>
                    <div>{dateOfRequest}</div></span>
                <span style = {{float:"right"}}>
                    <div>Date of payment</div>
                    <div>{dateOfPayment}</div>
                </span>
                </div>

                <div style = {{display:"inline-block", width:"100%"}}>
                <span style = {{float:"left"}}> 
                    <div>Invoice/Receipt</div>
                    <div>{billType}</div></span>
                <span style = {{float:"right"}}> 
                    <div>Number of orders</div>
                    <div>{numberOfOrders}</div>
                </span>
                </div>
                </div>
                <div style = {{width:"40%", float:"right"}}>
                <table>
                    <thead> Withdrawal Amount</thead>
                    <tbody>
                    <tr>
                        <th>Subtotal</th>
                        <td>{siteConfig.currency}{subtotal}</td>
                    </tr>
                    <tr>
                        <th>Commission</th>
                        <td>{siteConfig.currency}{commission}</td>
                    </tr>

                    <tr>
                        <th>Total</th>
                        <td>{siteConfig.currency}{withdrawal}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
                </div>
                
            </div>
            
                <br></br>
             <DataTable
             columns = {columns}
             data = {myPayoutDetails}
             />
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
        languages: languages

    };
}

export default connect(
    mapStateToProps
)(MyPayoutDetails);