import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { capitalize, formatprice } from "../../../components/utility/allutils";
import IntlMessages from "../../../components/utility/intlMessages";
import { createReturnRequest, searchOrders } from "../../../redux/pages/customers";
import { siteConfig } from "../../../settings";
import ReturnFooter from "./returnFooter";
import { useHistory } from "react-router";
import notification from '../../../components/notification';
import DatePicker from "react-datepicker";
import { useIntl } from 'react-intl';
import "react-datepicker/dist/react-datepicker.css";

function ReturnsSummary(props) {
    let history = useHistory();
    const intl = useIntl();
    const { orderId }: any = useParams();
    const [order, setOrder]: any = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [slot, setSlot] = useState(null);
    const [loader, setLoader]: any = useState(false);
    const [maxItems, setMaxitems] = useState(10);
    useEffect(() => {
        getData(orderId);

        return () => {
        }
    }, [props.returnData]);

    const getData = async (orderId) => {
        let orderDetails = [];
        let result: any = await searchOrders(orderId);
        if (Object.keys(props.returnData).length === 0) {
            let url = `/customer/create-return/` + orderId;
            history.push(url);
        } else {
            orderDetails['items'] = props?.returnData?.items;
        }

        orderDetails['entity_id'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.entity_id : 0;
        orderDetails['increment_id'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.increment_id : 0;
        orderDetails['created_at'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.created_at : 0;
        orderDetails['shipment_date'] = result?.data?.items?.[0] && result?.data?.items?.[0].extension_attributes && result?.data?.items?.[0]?.extension_attributes?.shipment_date ? result?.data?.items?.[0]?.extension_attributes?.shipment_date : 0;
        orderDetails['payment-method'] = result?.data?.items?.[0]?.payment?.additional_information?.[0];
        orderDetails['total_item_count'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.total_item_count : 0;
        orderDetails['delivery_address'] = result?.data?.items?.[0] && result?.data?.items?.[0]?.extension_attributes && result?.data?.items?.[0]?.extension_attributes?.shipping_assignments && result?.data?.items?.[0]?.extension_attributes?.shipping_assignments?.[0]?.shipping ? result?.data?.items?.[0].extension_attributes?.shipping_assignments?.[0]?.shipping.address : 0;
        orderDetails['base_subtotal'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_subtotal : 0;
        orderDetails['base_discount_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_discount_amount : 0;
        orderDetails['base_shipping_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_shipping_amount : 0;
        orderDetails['base_shipping_tax_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_shipping_tax_amount : 0;
        orderDetails['base_tax_amount'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.base_tax_amount : 0;
        orderDetails['grand_total'] = result?.data?.items?.[0] ? result?.data?.items?.[0]?.grand_total : 0;
        setOrder(orderDetails);
    }
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const slotCheck = async (e) => {
        let slotVal = e.target.value;
        let checked = e.target.checked;
        if (checked) {
            setSlot(slotVal)
        }
    }

    const handleSubmitClick = async (e) => {

        if (slot == null) {
            notification("success", "", "Please select pickup  time slot");
            return false;
        }
        if (endDate == null) {
            notification("success", "", "Please select pickup date slot");
            return false;
        }
        setLoader(true)
        let dateRange = moment(startDate).format('D') + "-" + moment(endDate).format('D MMM YYYY')
        let returnInfoData = {
            returnInfo: {
                orderId: order['entity_id'],
                rma_reason: props?.returnData?.rma_reason,
                comment_text: props?.returnData?.comment_text,
                items: props?.returnData?.dataSent,
                pickup_time_slot: slot,
                pickup_date: dateRange
            }
        }

        let result: any = await createReturnRequest(returnInfoData);

        if (result?.data?.[0]?.status === true) {
            let key = Object.keys(result?.data?.[0]?.rma);
            let url = `/customer/return-details/${key[0]}`;
            setLoader(false)
            notification("success", "", intl.formatMessage({ id: "return.success" }));
            setTimeout(() => {
                history.push(url);
            }, 3000)
        } else {
            setLoader(false)
            if (result?.data?.[0]?.message) {
                notification("error", "", result?.data?.[0]?.message);
            } else {
                notification("error", "", result?.data?.[1]);
            }

        }
    }
    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1><IntlMessages id="return.summary" /></h1>
                            <h2><IntlMessages id="return.summarydata" /></h2>
                        </div>

                        <div className="return-det">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5><IntlMessages id="order.orderNo" />: {orderId} </h5>
                                </div>
                                <div className="col-sm-3">
                                    <h6><IntlMessages id="return.createddate" /></h6>
                                    <p>{moment().format('ddd, D MMMM YYYY')}</p>
                                </div>
                                <div className="col-sm-3">
                                    <h6><IntlMessages id="return.dropoffdate" /></h6>
                                    <p></p>
                                </div>
                                <div className="col-sm-3">
                                    <p><strong><IntlMessages id="order.paymentMethod" /></strong></p>
                                    <p>{order['payment-method'] ? capitalize(order['payment-method']) : "-"}</p>
                                </div>
                                <div className="col-sm-3">
                                    <p><strong><IntlMessages id="order.products" /></strong></p>
                                    <p>{order['items']?.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="what-next">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="next-conts">
                                        <h4><IntlMessages id="return.next" /></h4>
                                        <ul className="list-unstyled m-0">
                                            <li><i className="fas fa-check"></i> <IntlMessages id="return.lastchance" />.</li>
                                            <li><i className="fas fa-key"></i> <IntlMessages id="return.choose" /></li>
                                            <li><i className="fas fa-print"></i> <IntlMessages id="return.print" /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mb-5">
                            <div className="row">
                                <div className="col-md-12 return-complaint-btns">
                                    <div className="float-start">
                                        <p><IntlMessages id="create.return.details1" /><br /><IntlMessages id="create.return.details2" /></p>
                                    </div>

                                    <div className="clearfix"></div>
                                </div>
                            </div>
                            <ul className="order-pro-list">
                                {order && order?.items && order?.items?.slice(0, maxItems).map((item, i) => {

                                    return (
                                        <div key={i}>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="product-image">
                                                            <img alt="{item.name}" src={item.extension_attributes.item_image} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <div className="pro-name-tag mb-4">
                                                            <div className="float-start">
                                                                {item.extension_attributes.barnd && (<div className="product_name"><Link to={'/search/' + item.extension_attributes.barnd}>{item.extension_attributes.barnd}</Link></div>)}
                                                                <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                                <p>{capitalize(item.product_type)}</p>
                                                            </div>
                                                            <Link to="#" className="float-end text-end order-pro-price text-decoration-none">{siteConfig.currency}{formatprice(item.price)}</Link>
                                                            <div className="clearfix"></div>
                                                        </div>
                                                        <div className="pro-name-tag">
                                                            <p><strong><IntlMessages id="order.productNo" /></strong> {item.sku}</p>
                                                            <p><strong><IntlMessages id="order.reason" />:</strong> {item.reasonData}</p>
                                                            <div className="clearfix"></div>

                                                        </div>

                                                    </div>
                                                </div>
                                            </li>
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                        <section>
                            <div className="row">
                                <div className="col-md-7">

                                    <div className="pick-date">
                                        <div className="accordion" id="accordionPanelsStayOpenExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                                        aria-controls="panelsStayOpen-collapseOne">
                                                        <IntlMessages id="return.pickupdate" />
                                                    </button>
                                                </h2>
                                                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show"
                                                    aria-labelledby="panelsStayOpen-headingOne">
                                                    <div className="accordion-body">
                                                        <DatePicker
                                                            selected={startDate}
                                                            onChange={onChange}
                                                            startDate={startDate}
                                                            endDate={endDate}
                                                            selectsRange
                                                            inline
                                                            isClearable
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                                                        aria-controls="panelsStayOpen-collapseTwo">
                                                        <IntlMessages id="return.pickupslot" />
                                                    </button>
                                                </h2>
                                                <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse"
                                                    aria-labelledby="panelsStayOpen-headingTwo">
                                                    <div className="accordion-body">
                                                        <div className="timeslots">
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <span>8:00 a.m. 11:00 a.m.</span>
                                                                    <p><IntlMessages id="return.arrive" /> 8:00 a.m., - 11:00 a.m. </p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-check">
                                                                        <input
                                                                            type="radio"
                                                                            defaultValue="8:00a.m.-11:00a.m."
                                                                            name="timeslot"
                                                                            className="form-check-input"
                                                                            onChange={slotCheck}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <span>11:00 a.m. 3:00 p.m.</span>
                                                                    <p><IntlMessages id="return.arrive" /> 11:00 a.m., - 3:00 p.m. </p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-check">
                                                                        <input
                                                                            type="radio"
                                                                            defaultValue="11:00a.m.-3:00p.m."
                                                                            name="timeslot"
                                                                            className="form-check-input"
                                                                            onChange={slotCheck}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <span>3:00 p.m. 6:00 p.m.</span>
                                                                    <p><IntlMessages id="return.arrive" /> 3:00 p.m., - 6:00 a.m. </p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-check">
                                                                        <input
                                                                            type="radio"
                                                                            defaultValue="3:00p.m.-6:00p.m."
                                                                            name="timeslot"
                                                                            className="form-check-input"
                                                                            onChange={slotCheck}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-5">

                                </div>
                            </div>
                        </section>


                        <section>

                            <div className="return-det">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h3><IntlMessages id="summary" /></h3>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="return.pickupdate" /> </h6>
                                        {endDate && (<p>{moment(startDate).format('D')}- {moment(endDate).format('D MMM YYYY')}</p>
                                        )}
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="return.pickupslot" /></h6>
                                        {slot && (<p>{slot}</p>)}
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="order.products" /></h6>
                                        <p>{props?.returnData?.items?.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="return-user-info">
                                            <h5><IntlMessages id="userinformation" /></h5>
                                            <address>
                                                {order['delivery_address']?.firstname + ' ' + order['delivery_address']?.lastname}<br />
                                                {order['delivery_address']?.street}<br />
                                                {order['delivery_address']?.postcode}<br />
                                                {order['delivery_address']?.city}<br />
                                                {order['delivery_address'] && order['delivery_address'].country_id ? "Saudi Arabia" : ""}
                                            </address>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="return-user-total">
                                            <h5><IntlMessages id="return.total" /></h5>
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td><IntlMessages id="order.subTotal" /></td>
                                                        <th className="text-end">{siteConfig.currency} {props?.returnData?.total}</th>
                                                    </tr>
                                                    <tr>
                                                        <td><IntlMessages id="order.shipping" /></td>
                                                        <th className="text-end">{siteConfig.currency} 0</th>
                                                    </tr>
                                                    <tr className="r-tax">
                                                        <td><IntlMessages id="order.tax" /></td>
                                                        <th className="text-end">{siteConfig.currency} 0</th>
                                                    </tr>
                                                    <tr className="tot-bor">
                                                        <th><IntlMessages id="order.total" /></th>
                                                        <th className="text-end fin-p">{siteConfig.currency}  {props?.returnData?.total}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 text-center">

                                        {loader ? <Link to="#" className="btn btn-return"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                            <Link to="#" className="btn btn-return" onClick={handleSubmitClick} ><IntlMessages id="order.returnProducts" /></Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>

                        <ReturnFooter />

                    </div>
                </div>
            </div>

        </main>
    )
}



function mapStateToProps(state) {
    let returnData = {};
    if (state?.Cart?.retrunData) {
        returnData = state?.Cart?.retrunData
    }
    return {
        returnData: returnData
    };
};
export default connect(
    mapStateToProps
)(ReturnsSummary);