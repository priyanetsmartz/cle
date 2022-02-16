import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import Dashboard from './dashboard';
import BusinessProfile from './businessProfile';
import MyNotifications from './myNotifications';
import MySupport from './mySupport';
import { sessionService } from 'redux-react-session';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';


import MySalesOrders from './mySalesOrders';
import MyProductListing from './myProductListing';
import MyReturnsComplaints from './myReturnsComplaints';
import MyPayouts from './myPayouts';
import MyAnalysis from './myAnalysis';

function BusinessSidebar(props) {
    const intl = useIntl();
    const [vendor, setVandor] = useState({ vendor_name: '' });
    const history = useHistory();
    const key = props.match.params.tab;
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        setActiveTab(key);
        getVendor();

    }, [key]);

    const changeTab = (tab) => {
        history.push(`/vendor/${tab}`);
        setActiveTab(tab);
    }
    async function getVendor() {
        let user = await sessionService.loadUser()
        if (user && user.type === "vendor") {
            setVandor(user);
        } else {
            window.location.href = '/';
        }
    }
    const changeMobTab = (e) => {
        changeTab(e.target.value);
    }



    return (
        <>
            <section className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="pro_categry_sidebar">
                                <div className="my-userdetails">
                                    <div className="user_show"><IntlMessages id="customer.hi" /></div>
                                    <div className="user_name">{vendor.vendor_name}</div>
                                </div>
                                <div className="mobile_sidebar">
                                    <select className="form-select" aria-label="Default select example" onChange={changeMobTab}>
                                        <option value="dashboard">{intl.formatMessage({ id: 'customer.dashboard' })}</option>
                                        <option value="sales-orders">{intl.formatMessage({ id: 'vendor.salesOrders' })}</option>
                                        <option value="product-listing">{intl.formatMessage({ id: 'vendor.productListing' })}</option>
                                        <option value="returns-complaints">{intl.formatMessage({ id: 'vendor.returnComplaints' })}</option>
                                         <option value="payouts">{intl.formatMessage({ id: 'vendor.payouts' })}</option>
                                        <option value="analysis">{intl.formatMessage({ id: 'vendor.myAnalysis' })}</option>
                                        <option value="profile">{intl.formatMessage({ id: 'vendor.businessProfile' })}</option>
                                        <option value="support">{intl.formatMessage({ id: 'vendor.mySupport' })}</option>
                                    </select>
                                </div>
                                <div className="myorder_sidebar">
                                    <ul>
                                        <li className={activeTab === 'dashboard' ? 'active' : ''} >
                                            <Link to="#" onClick={() => changeTab('dashboard')}>
                                                <i className="fa fa-columns" aria-hidden="true"></i>
                                                <span className="pl-2">
                                                    <IntlMessages id="customer.dashboard" />
                                                </span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'sales-orders' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('sales-orders')}>
                                                <i className="fas fa-box" aria-hidden="true"></i>
                                                <span className="pl-2"><IntlMessages id="vendor.salesOrders" /></span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'product-listing' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('product-listing')}>
                                                
												<i className="fas fa-tag" aria-hidden="true"></i>
                                                <span className="pl-2"><IntlMessages id="vendor.productListing" /></span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'returns-complaints' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('returns-complaints')}>
												<i className="fas fa-undo-alt" aria-hidden="true"></i>
                                                <span className="pl-2"><IntlMessages id="vendor.returnComplaints" /></span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'payouts' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('payouts')}>
                                                <i className="fa fa-credit-card" aria-hidden="true"></i>
                                                <span className="pl-2"><IntlMessages id="vendor.payouts" /></span>
                                            </Link>
                                        </li>                                          
                                        <li className={activeTab === 'analysis' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('analysis')}>
                                                <i className="fas fa-chart-line"></i>
                                                <span className="pl-2"><IntlMessages id="vendor.myAnalysis" /></span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'business-profile' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('business-profile')}>
                                                <i className="fas fa-user"></i>
                                                <span className="pl-2"><IntlMessages id="vendor.businessProfile" /></span>
                                            </Link>
                                        </li>                                      
                                        <li className={activeTab === 'support' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('support')}>
                                                <i className="fas fa-phone-alt"></i>
                                                <span className="pl-2"><IntlMessages id="customer.mySupport" /></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {activeTab === 'dashboard' ? <Dashboard /> :
                            activeTab === 'sales-orders' ? <MySalesOrders /> :
                                activeTab === 'product-listing' ? <MyProductListing /> :
                                    activeTab === 'returns-complaints' ? <MyReturnsComplaints /> :
                                        activeTab === 'payouts' ? <MyPayouts /> :
                                            activeTab === 'analysis' ? <MyAnalysis /> :
                                                activeTab === 'business-profile' ? <BusinessProfile /> :
                                                    activeTab === 'notifications' ? <MyNotifications /> : <MySupport />}

                    </div>
                </div>
            </section>
        </>
    )
}
const mapStateToProps = (state) => {
    return {}
}

export default connect(
    mapStateToProps
)(BusinessSidebar);