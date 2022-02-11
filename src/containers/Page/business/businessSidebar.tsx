import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";

import BusinessProfile from './businessProfile';

import { sessionService } from 'redux-react-session';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';


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
                                        {/* <option value="dashboard">{intl.formatMessage({ id: 'customer.dashboard' })}</option>
                                        <option value="sales-orders">{intl.formatMessage({ id: 'vendor.salesOrders' })}</option>
                                        <option value="product-listing">{intl.formatMessage({ id: 'vendor.productListing' })}</option>
                                         <option value="returns-complaints">{intl.formatMessage({ id: 'vendor.returnComplaints' })}</option>
                                        <option value="payouts">{intl.formatMessage({ id: 'vendor.payouts' })}</option>
                                        <option value="analysis">{intl.formatMessage({ id: 'vendor.myAnalysis' })}</option> */}
                                        <option value="business-profile">{intl.formatMessage({ id: 'vendor.businessProfile' })}</option>
                                        {/* <option value="notifications">{intl.formatMessage({ id: 'vendor.notification' })}</option>
                                        <option value="support">{intl.formatMessage({ id: 'vendor.mySupport' })}</option> */}
                                    </select>
                                </div>
                                <div className="myorder_sidebar">
                                    <ul>
                                        {/* <li className={activeTab === 'dashboard' ? 'active' : ''} >
                                            <Link to="#" onClick={() => changeTab('dashboard')}>
                                                <img src={dashboardIcon} alt="" className="img-fluid" />
                                                <span className="pl-2">
                                                    <IntlMessages id="customer.dashboard" />
                                                </span>
                                            </Link>
                                        </li> */}
                                        {/* <li className={activeTab === 'sales-orders' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('sales-orders')}>
                                                <img src={ordersIcon} alt="" className="img-fluid" />
                                                <span className="pl-2"><IntlMessages id="vendor.salesOrders" /></span>
                                            </Link>
                                        </li> */}
                                        {/* <li className={activeTab === 'product-listing' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('product-listing')}>
                                                <img src={wishlistIcon} alt="" className="img-fluid" />
                                                <span className="pl-2"><IntlMessages id="vendor.productListing" /></span>
                                            </Link>
                                        </li> */}
                                        {/*  <li className={activeTab === 'returns-complaints' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('returns-complaints')}>
                                                <img src={profileIcon} alt="" className="img-fluid" />
                                                <span className="pl-2"><IntlMessages id="vendor.returnComplaints" /></span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'payouts' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('payouts')}>
                                                <img src={supportIcon} alt="" className="img-fluid" />
                                                <span className="pl-2"><IntlMessages id="vendor.payouts" /></span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'analysis' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('analysis')}>
                                                <img src={supportIcon} alt="" className="img-fluid" />
                                                <span className="pl-2"><IntlMessages id="vendor.myAnalysis" /></span>
                                            </Link>
                                        </li> */}
                                        <li className={activeTab === 'business-profile' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('business-profile')}>
                                                <i className="fas fa-user"></i>
                                                <span className="pl-2"><IntlMessages id="vendor.businessProfile" /></span>
                                            </Link>
                                        </li>
                                        {/* <li className={activeTab === 'notifications' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('notifications')}>
                                                <img src={notificationIcon} alt="" className="img-fluid" />
                                                <span className="pl-2"><IntlMessages id="vendor.notification" /></span>
                                            </Link>
                                        </li> */}
                                        {/* <li className={activeTab === 'support' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('support')}>
                                                <i className="fas fa-phone-alt"></i>
                                                <span className="pl-2"><IntlMessages id="customer.mySupport" /></span>
                                            </Link>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {
                            activeTab === 'business-profile' ? <BusinessProfile /> : ""
                        }

                    </div>
                </div>
            </section>
        </>
    )
}
const mapStateToProps = (state) => {
    // console.log(state)
    return {}
}

export default connect(
    mapStateToProps
)(BusinessSidebar);