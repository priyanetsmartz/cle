import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { Slider } from 'antd';
import moment from 'moment';
import searchIcon from '../../../image/Icon_zoom_in.svg';
import { getVendorOrders } from '../../../redux/pages/vendorLogin';
import { siteConfig } from '../../../settings';





function MySalesOrders(props) {
    const intl = useIntl();
    const [myOrder, setMyOrders] = useState([])
    useEffect(() => {
        getDataOfOrders()
        return (
            setMyOrders([])
        )

    }, [])

    const columns = [
        {
            name: 'Order number',
            selector: row => row.increment_id,
            sortable: true,
        },
        {
            name: 'Products',
            selector: row => row.products,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
        {
            name: 'Total',
            selector: row => row.total,
        },
    ];
    async function getDataOfOrders() {
        let result: any = await getVendorOrders(props.languages, siteConfig.pageSize)

        console.log("check result", result)
        let dataObj = result && result.data && result.data.length > 0 ? result.data[0] : [];
        console.log(dataObj)
        if (dataObj.length > 0) {
            const dataLListing = dataObj.map((data, index) => {
                let orderLoop: any = {};
                orderLoop.increment_id = data.increment_id;
                orderLoop.status = data.status;
                orderLoop.products = parseInt(data.products);
                orderLoop.total = siteConfig.currency + ' ' + data.total;
                return orderLoop;
            });

            setMyOrders(dataLListing)
        }

    }

    const handleChange = ({ selectedRows }) => {
        console.log('Selected Rows: ', selectedRows);
    };

    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="salesOrder.title" /></h1>
                            <p><IntlMessages id="salesOrder.description.1" /><br /><IntlMessages id="salesOrder.description.2" /></p>
                        </div>
                    </div>
                    <div className="range_slider">
                        <div className="range_inner">
                            <div className="row">
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="status" /></span>
                                        <select className="form-select" aria-label="Default select example" >
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.date" /></span>
                                        <select className="form-select" aria-label="Default select example" >
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3 mb-2">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="order.price" /></span>
                                        <Slider range max={20000} defaultValue={[0, 5]} />
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src={searchIcon} alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder={intl.formatMessage({ id: "searchorderid" })} className="form-control me-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 mb-4">
                                    <div className="form-group">
                                        <span className="form-label"><IntlMessages id="changeStatus" />:</span>
                                        <select className="form-select" aria-label="Default select example" >
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "last_month" })}</option>
                                            <option value="3">{intl.formatMessage({ id: "lastthree" })}</option>
                                            <option value="6">{intl.formatMessage({ id: "lastsix" })}</option>
                                            <option value={moment().format('YYYY')} >{moment().format('YYYY')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-grid col-sm-4 mb-4">
                                    <button type="button" className="btn btn-secondary" >
                                        <IntlMessages id="myaccount.edit" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={myOrder}
                    selectableRows
                    pagination={true}
                    onSelectedRowsChange={handleChange}
                />
            </section>
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(MySalesOrders);