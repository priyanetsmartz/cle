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

    const intl = useIntl();
    useEffect(() => {
        getReturnDetailFxn(returnId)
    }, [props.languages])

    async function getReturnDetailFxn(orderId) {
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
        if (event.target.value === 'decline') {
            setShow(true)
        } else {
            setShow(false)
        }
    }
    const handleChange = (e) => {
        setstatusReturnComment(e.target.value);
    }
    const handleSubmitClick = async (e) => {

        if (statusReturn === "" || statusReturn === null) {
            notification("error", "", intl.formatMessage({ id: "selectreturnOrExchange" }));
            return false;
        }
        let result: any = await returnProcessVendor(returnId, statusReturn, statusReturnComment);
        if (result.data) {
            getReturnDetailFxn(returnId)
            selectStatusReturn('')
            setstatusReturnComment('')
            notification("success", "", result.data);
        } else {
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
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="status" /></h6>
                                        {returnDetails['info'] && returnDetails['info'].rma_status ?
                                            <p className={returnDetails['info'].rma_status === 'decline' ? 'red' : 'green'}> {capitalize(returnDetails['info'].rma_status)}</p> : ""}
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="order.purchaseDate" /></h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].purchase_date ? moment(returnDetails['info'].purchase_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>

                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="shipped.date" /></h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].shipment_date ? moment(returnDetails['info'].shipment_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="return.date" /></h6>
                                        <p>{returnDetails['info'] && returnDetails['info'].return_date ? moment(returnDetails['info'].return_date).format('ddd DD MMMM YYYY') : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="order.paymentMethod" /></h6>
                                        <p><i className="fas fa-money-check"></i> {returnDetails['info'] ? returnDetails['info'].payment_method : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="returned.products" /></h6>
                                        <p>{returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6><IntlMessages id="exchanged.products" /></h6>
                                        <p>{returnDetails['info'] ? returnDetails['info'].return_qty : ""}</p>
                                    </div>
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
                                                    {returnDetails['address'].region}<br />
                                                    {returnDetails['address'].country_id ? getCountryName(returnDetails['address'].country_id) : ""}

                                                </address>
                                                : ""}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="return-user-total">
                                            <h5><IntlMessages id="returntotal" /></h5>
                                            <table className="table table-borderless mb-0">
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
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="container mb-5">
                            {returnDetails['items'] && returnDetails['items'].length > 0 && (
                                <ul className="order-pro-list">
                                    {returnDetails['items'].map((item, i) => {
                                        // console.log(item);
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
                                                        <Link to="#" className="float-end text-end order-pro-price">{siteConfig.currency}{item.price}</Link>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                    <div className="pro-name-tag">
                                                        {item.product_type === 'simple' ? "" : <p>One Size</p>}
                                                        <p><strong>Product no.</strong> {item.product_id}</p>
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
                            <div className="row mt-5">
                                <div className="col-md-12">
                                    <div className='return-reason' >
                                        <select className="form-select customfliter" aria-label="Default select example" onChange={selectStatus} >
                                            <option value="">{intl.formatMessage({ id: "statusreturn" })}</option>
                                            <option value="approved">{intl.formatMessage({ id: "returnaccept" })}</option>
                                            <option value="declined">{intl.formatMessage({ id: "returndecline" })}</option>
                                        </select>
                                    </div>
                                    {show && (<div className='return-comment' >
                                        <label><IntlMessages id="comments" /></label>
                                        <textarea className="form-select customfliter" onChange={handleChange} value={statusReturnComment}>
                                        </textarea>
                                    </div>)}
                                    <div className="clearfix"></div>
                                    <div className="return-pro-btn float-end mt-2"><Link to="#" className="btn btn-primary" onClick={handleSubmitClick} ><IntlMessages id="confirm.return" /></Link></div>
                                    <div className="clearfix"></div>
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