import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { getReturnDetail, returnProcessVendor } from '../../../redux/pages/vendorLogin';
import moment from 'moment';
import { Link } from "react-router-dom";
import { capitalize, getCountryName } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import notification from '../../../components/notification';

function RetunOrder(props) {
    const { returnId }: any = useParams();
    const [returnDetails, setReturnDetails] = useState([])
    const [statusReturn, selectStatusReturn] = useState('')
    const [statusReturnComment, setstatusReturnComment] = useState('')
    const [returnShow, setReturnShow] = useState(true)
    const [show, setShow] = useState(false)
    const [loader, setLoader] = useState(false);
    const intl = useIntl();
    useEffect(() => {
        getReturnDetailFxn(returnId)
    }, [props.languages])

    async function getReturnDetailFxn(orderId) {// Function to details of return and setting the values in data table of return details
        let results: any = await getReturnDetail(orderId);
        let data = [];
        if (results && results.data && results.data.length > 0) {
            data['info'] = results.data[0].info;
            data['rma_status'] = results.data[0].info && results.data[0].info.rma_status ? results.data[0].info.rma_status : '';
            data['address'] = results.data[0].address;
            data['items'] = results.data[0].items;
            data['return_total'] = results.data[0].return_total;

            if (data['rma_status'] === 'pending') {
                setReturnShow(true)
            } else {
                setReturnShow(false)
            }
        }
        setReturnDetails(data);
    }
    const selectStatus = (event) => {
        selectStatusReturn(event.target.value)
        if (event.target.value === 'declined') {
            setShow(true)
        } else {
            setShow(false)
        }
    }
    const handleChange = (e) => {
        setstatusReturnComment(e.target.value);
    }
    const handleSubmitClick = async (e) => {// if order is declined and reason is not provided, then error message will come. Otherwise will hit the api to change the status of return order

        if (statusReturn === "" || statusReturn === null) {
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchange" }));
            return false;
        }
        if (statusReturn === "declined" && statusReturnComment === '') {
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchange.message" }));
            return false;
        }
        setLoader(true);
        let result: any = await returnProcessVendor(returnId, statusReturn, statusReturnComment);
        if (result?.data) {
            setLoader(false);
            getReturnDetailFxn(returnId)
            selectStatusReturn('')
            setstatusReturnComment('')
            notification("success", "", result?.data);
        } else {
            setLoader(false);
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }

    }
    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1><IntlMessages id="myaccount.returnDetails" /></h1>
                            <h2><IntlMessages id="customer.return.description" /></h2>
                        </div>
                        <section>
                            <div className="return-det">
                                <div className="row">

                                    <div className="col-sm-12">
                                        <h5><IntlMessages id="order.orderNo" />: {returnDetails['info'] ? returnDetails['info'].rma_id : ""}</h5>
                                    </div>
                                    <div className="col-sm-3 mb-3">
                                        <h6><IntlMessages id="status" /></h6>
                                        {returnDetails['info'] && returnDetails['info'].rma_status ?
                                            <p className={returnDetails['info'].rma_status === 'decline' ? 'red' : 'green'}> {capitalize(returnDetails['info'].rma_status)}</p> : ""}
                                    </div>
                                    <div className="col-sm-3 mb-3">
                                        <h6><IntlMessages id="order.purchaseDate" /></h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].purchase_date ? moment(returnDetails['info'].purchase_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>

                                    <div className="col-sm-3 mb-3">
                                        <h6><IntlMessages id="shipped.date" /></h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].shipment_date ? moment(returnDetails['info'].shipment_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-sm-3 mb-3">
                                        <h6><IntlMessages id="return.date" /></h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].return_date ? moment(returnDetails['info'].return_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-sm-3 mb-3">
                                        <h6><IntlMessages id="order.paymentMethod" /></h6>
                                        <p><i className="fas fa-money-check"></i> {returnDetails['info'] ? returnDetails['info'].payment_method : ""}</p>
                                    </div>
                                    {(returnDetails['info'] && returnDetails['info']?.rma_reason === 'refund') && (<div className="col-sm-3 mb-3">
                                        <h6><IntlMessages id="returned.products" /></h6>
                                        <p>{returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
                                    </div>
                                    )}
                                    {(returnDetails['info'] && returnDetails['info']?.rma_reason === 'exchange') && (<div className="col-sm-3 mb-3">
                                        <h6><IntlMessages id="exchanged.products" /></h6>
                                        <p>{returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
                                    </div>
                                    )}
                                </div>
                            </div>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="return-user-info">
                                            <h5><IntlMessages id="userinformation" /></h5>
                                            {returnDetails['address'] ?
                                                <address>

                                                    {returnDetails['address'].firstname}<br />
                                                    {returnDetails['address'].lastname}<br />
                                                    {returnDetails['address'].street}<br />
                                                    {returnDetails['address'].postcode}<br />
                                                    {returnDetails['address'].city}<br />
                                                    {returnDetails['address'].telephone}<br />
                                                    {returnDetails['address'].country_id ? getCountryName(returnDetails['address'].country_id) : ""}

                                                </address>
                                                : ""}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="return-user-total">
                                            <h5><IntlMessages id="return.total" /></h5>
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td><IntlMessages id="subtotal" /></td>
                                                        <th className="text-end">{siteConfig.currency} {returnDetails['return_total'] ? returnDetails['return_total'].subtotal : 0}</th>
                                                    </tr>
                                                    <tr>
                                                        <td><IntlMessages id="order.shipping" /></td>
                                                        <th className="text-end">{siteConfig.currency} {returnDetails['return_total'] ? returnDetails['return_total'].shipping : 0}</th>
                                                    </tr>
                                                    <tr className="r-tax">
                                                        <td><IntlMessages id="tax" /></td>
                                                        <th className="text-end">{siteConfig.currency} {returnDetails['return_total'] ? returnDetails['return_total'].tax : 0}</th>
                                                    </tr>
                                                    <tr className="tot-bor">
                                                        <th><IntlMessages id="total" /></th>
                                                        <th className="text-end fin-p">{siteConfig.currency} {returnDetails['return_total'] ? returnDetails['return_total'].grand_total : 0}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="mb-2">
                            {returnDetails['items'] && returnDetails['items'].length > 0 && (
                                <ul className="order-pro-list">
                                    {returnDetails['items'].map((item, i) => {

                                        return (<li key={i}>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="product-image">
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                </div>
                                                <div className="col-md-9">
                                                    <div className="pro-name-tag mb-5">
                                                        <div className="float-start">
                                                            <p><strong>{item.brand}</strong></p>
                                                            <p>{item.name}</p>
                                                        </div>
                                                        <Link to="#" className="float-end text-end order-pro-price text-decoration-none">{siteConfig.currency}{item.price}</Link>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                    <div className="pro-name-tag">
                                                        {item.product_type === 'simple' ? "" : <p><IntlMessages id="onesize" /></p>}
                                                        <p><strong><IntlMessages id="order.productNo" /></strong> {item.sku}</p>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                                <p>{capitalize(item.item_condition)}</p>
                                            </div>
                                        </li>
                                        )
                                    })}
                                </ul>
                            )}
                            {returnDetails['items'] && returnDetails['items'].length > 3 && (
                                <div className="show-more-btn"><Link to="#" className="btn btn-secondary"><IntlMessages id="order.showMore" /></Link></div>
                            )}
                        </div>
                        {returnShow && (
                            <div className="row">
                                <div className="col-md-12">

                                    <div className="row my-3">
                                        <div className="col-md-3 mb-2">
                                            <div className='return-reason' >
                                                <select className="form-select customfliter" aria-label="Default select example" onChange={selectStatus} >
                                                    <option value="">{intl.formatMessage({ id: "statusreturn" })}</option>
                                                    <option value="approved">{intl.formatMessage({ id: "returnaccept" })}</option>
                                                    <option value="declined">{intl.formatMessage({ id: "returndecline" })}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-md-3 align-self-end mb-2">
                                            <label className="form-label"></label>
                                            <Link to="#" className="btn btn-secondary" onClick={handleSubmitClick} style={{ "display": !loader ? "inline-block" : "none" }} ><IntlMessages id="confirm.return" /></Link>
                                            <div className="spinner btn btn-secondary m-0" style={{ "display": loader ? "inline-block" : "none" }}>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                <IntlMessages id="loading" />
                                            </div>
                                        </div>

                                        <div className="col-md-12 mb-2">
                                            {show && (<div className='return-comment' >
                                                <label><IntlMessages id="comments" /></label>
                                                <textarea className="form-control customfliter" onChange={handleChange} rows={3} value={statusReturnComment}>
                                                </textarea>
                                            </div>)}
                                        </div>

                                    </div>





                                </div>
                            </div>
                        )}

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
    }
}
export default connect(
    mapStateToProps
)(RetunOrder);