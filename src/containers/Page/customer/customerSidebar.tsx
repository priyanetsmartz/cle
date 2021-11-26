import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import Dashboard from './dashboard';
import OrdersAndReturns from './allOrders';
import MyProfile from './myProfile';
import MyWishList from './myWishlist';
import MyRewards from './myRewards';
import MyNotifications from './myNotifications';
import MySupport from './mySupport';
import dashboardIcon from '../../../image/dashboard_icon.svg';
import ordersIcon from '../../../image/myorder_icon.svg';
import rewardIcon from '../../../image/my_reward.svg';
import wishlistIcon from '../../../image/mywish_list.svg';
import profileIcon from '../../../image/my_profile.svg';
import notificationIcon from '../../../image/my_notification.svg';
import supportIcon from '../../../image/my_support.svg';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
import { capitalize } from '../../../components/utility/allutils';
import appAction from "../../../redux/app/actions";
const { showLoader } = appAction;

function Customer(props) {
    const intl = useIntl();
    const userGroup = props.token.token
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup === '4') ? true : false);
    const [name, setName] = useState(props.token.token_name);
    const history = useHistory();
    const key = props.match.params.tab;
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        //  props.showLoader(true)
        setActiveTab(key);

    }, [key]);

    const changeTab = (tab) => {
        history.push(`/customer/${tab}`);
        setActiveTab(tab);
    }

    const changeMobTab = (e) => {
        changeTab(e.target.value);
    }

    if (isPriveUser) {
        var priveColor = {
            "color": "#017ABB"
        }
    }


    return (
        <>
            <section className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="pro_categry_sidebar">
                                <div className="my-userdetails">
                                    <div className="user_show" style={priveColor}><IntlMessages id="customer.hi" /></div>
                                    <div className="user_name">{name ? capitalize(name) : ""}</div>
                                </div>
                                <div className="mobile_sidebar">
                                    <select className="form-select" aria-label="Default select example" onChange={changeMobTab}>
                                        <option value="dashboard">{intl.formatMessage({ id: 'register.email' })}</option>
                                        <option value="orders-and-returns">{intl.formatMessage({ id: 'customer.ordersAndReturns' })}</option>
                                        {/* <option value="mytrades">{intl.formatMessage({ id: 'customer.myTrades' })}</option> */}
                                        {/* <option value="rewards"><IntlMessages id="customer.myReward" /></option> */}
                                        <option value="wish-list">{intl.formatMessage({ id: 'customer.myWishlist' })}</option>
                                        <option value="profile">{intl.formatMessage({ id: 'customer.myProfile' })}</option>
                                        {/* <option value="notifications"><IntlMessages id="customer.myNotifications" /></option> */}
                                        <option value="support">{intl.formatMessage({ id: 'customer.mySupport' })}</option>
                                    </select>
                                </div>
                                <div className="myorder_sidebar">
                                    <ul>
                                        <li className={activeTab === 'dashboard' ? 'active' : ''} >
                                            <Link to="#" onClick={() => changeTab('dashboard')} className={isPriveUser ? 'prive-txt' : ''}>
                                                <i className="fas fa-columns"></i>
                                                <span className="pl-2">
                                                    <IntlMessages id="customer.dashboard" />
                                                </span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'orders-and-returns' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('orders-and-returns')} className={isPriveUser ? 'prive-txt' : ''}>
                                                <i className="fas fa-box"></i>
                                                <span className="pl-2"><IntlMessages id="customer.ordersAndReturns" /></span>
                                            </Link>
                                        </li>
                                        {/* <li className={activeTab === 'mytrades' ? 'active' : ''}><Link to="#" onClick={() => changeTab('mytrades')}>
                                            <img src={tradeIcon} alt="" className="img-fluid" /> <span className="pl-2">
                                                <IntlMessages id="customer.myTrades" /></span></Link></li> */}
                                        {/* <li className={activeTab === 'rewards' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('rewards')} className={isPriveUser ? 'prive-txt' : ''}>
                                                <img src={rewardIcon} alt="" className="img-fluid" /> 
                                                <span className="pl-2"> <IntlMessages id="customer.myReward" /></span>
                                            </Link>
                                        </li> */}
                                        <li className={activeTab === 'wish-list' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('wish-list')} className={isPriveUser ? 'prive-txt' : ''}>
                                                <i className="fas fa-heart"></i>
                                                <span className="pl-2"><IntlMessages id="customer.myWishlist" /></span>
                                            </Link>
                                        </li>
                                        <li className={activeTab === 'profile' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('profile')} className={isPriveUser ? 'prive-txt' : ''}>
                                                <i className="fas fa-user"></i>
                                                <span className="pl-2"> <IntlMessages id="customer.myProfile" /></span>
                                            </Link>
                                        </li>
                                        {/* <li className={activeTab === 'notifications' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('notifications')} className={isPriveUser ? 'prive-txt' : ''}>
                                                <img src={notificationIcon} alt="" className="img-fluid" /> 
                                                <span className="pl-2"><IntlMessages id="customer.myNotifications" /></span>
                                            </Link>
                                        </li> */}
                                        <li className={activeTab === 'support' ? 'active' : ''}>
                                            <Link to="#" onClick={() => changeTab('support')} className={isPriveUser ? 'prive-txt' : ''}>
                                                <i className="fas fa-phone-alt"></i>
                                                <span className="pl-2"><IntlMessages id="customer.mySupport" /></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {activeTab === 'dashboard' ? <MyProfile /> :
                            activeTab === 'orders-and-returns' ? <OrdersAndReturns /> :
                                // activeTab === 'mytrades' ? <MyTrades /> :
                                activeTab === 'profile' ? <MyProfile /> :
                                    activeTab === 'wish-list' ? <MyWishList /> :
                                        activeTab === 'rewards' ? <MyRewards /> :
                                            activeTab === 'notifications' ? <MyNotifications /> : <MySupport />}

                    </div>
                </div>
            </section>
        </>
    )
}
const mapStateToProps = (state) => {
    // console.log(state)
    return { token: state.session.user }
}

export default connect(
    mapStateToProps,
    { showLoader }
)(Customer);