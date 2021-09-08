import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import Dashboard from './dashboard';
import OrdersAndReturns from './ordersAndReturns';
import MyTrades from './mytrades';
import MyProfile from './myProfile';
import MyWishList from './myWishlist';
import MyRewards from './myRewards';
import MyNotifications from './myNotifications';
import MySupport from './mySupport';
import dashboardIcon from '../../../image/dashboard_icon.svg';
import ordersIcon from '../../../image/myorder_icon.svg';
import tradeIcon from '../../../image/my_trade.svg';
import rewardIcon from '../../../image/my_reward.svg';
import wishlistIcon from '../../../image/mywish_list.svg';
import profileIcon from '../../../image/my_profile.svg';
import notificationIcon from '../../../image/my_notification.svg';
import supportIcon from '../../../image/my_support.svg';


function Customer(props) {
    const [name, setName] = useState(localStorage.getItem('token_name'));
    const history = useHistory();
    const key = props.match.params.tab;
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        setActiveTab(key);
    }, [key]);

    const changeTab = (tab) => {
        history.push(`/customer/${tab}`);
        setActiveTab(tab);
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
                                    <div className="user_name">{name}</div>
                                </div>
                                <div className="mobile_sidebar">
                                    <select className="form-select" aria-label="Default select example" onChange={changeMobTab}>
                                        <option value="dashboard"><IntlMessages id="customer.dashboard" /></option>
                                        <option value="orders-and-returns"><IntlMessages id="customer.ordersAndReturns" /></option>
                                        <option value="mytrades"><IntlMessages id="customer.myTrades" /></option>
                                        <option value="rewards"><IntlMessages id="customer.myReward" /></option>
                                        <option value="wish-list"><IntlMessages id="customer.myWishlist" /></option>
                                        <option value="profile"><IntlMessages id="customer.myProfile" /></option>
                                        <option value="notifications"><IntlMessages id="customer.myNotifications" /></option>
                                        <option value="support"><IntlMessages id="customer.mySupport" /></option>
                                    </select>
                                </div>
                                <div className="myorder_sidebar">
                                    <ul>
                                        <li className={activeTab == 'dashboard' ? 'active' : ''}><a onClick={() => changeTab('dashboard')}>
                                            <img src={dashboardIcon} alt="" className="img-fluid" /> <span
                                                className="pl-2"><IntlMessages id="customer.dashboard" /></span></a></li>
                                        <li className={activeTab == 'orders-and-returns' ? 'active' : ''}><a onClick={() => changeTab('orders-and-returns')}>
                                            <img src={ordersIcon} alt="" className="img-fluid" /> <span
                                                className="pl-2"><IntlMessages id="customer.ordersAndReturns" /></span></a></li>
                                        {/* <li className={activeTab == 'mytrades' ? 'active' : ''}><a onClick={() => changeTab('mytrades')}>
                                            <img src={tradeIcon} alt="" className="img-fluid" /> <span className="pl-2">
                                                <IntlMessages id="customer.myTrades" /></span></a></li> */}
                                        <li className={activeTab == 'rewards' ? 'active' : ''}><a onClick={() => changeTab('rewards')}>
                                            <img src={rewardIcon} alt="" className="img-fluid" /> <span className="pl-2">
                                            <IntlMessages id="customer.myReward" /></span></a></li>
                                        <li className={activeTab == 'wish-list' ? 'active' : ''}><a onClick={() => changeTab('wish-list')}>
                                            <img src={wishlistIcon} alt="" className="img-fluid" /> <span className="pl-2">
                                            <IntlMessages id="customer.myWishlist" /></span></a></li>
                                        <li className={activeTab == 'profile' ? 'active' : ''}><a onClick={() => changeTab('profile')}>
                                            <img src={profileIcon} alt="" className="img-fluid" /> <span className="pl-2">
                                            <IntlMessages id="customer.myProfile" /></span></a></li>
                                        <li className={activeTab == 'notifications' ? 'active' : ''}><a onClick={() => changeTab('notifications')}>
                                            <img src={notificationIcon} alt="" className="img-fluid" /> <span
                                                className="pl-2"><IntlMessages id="customer.myNotifications" /></span></a></li>
                                        <li className={activeTab == 'support' ? 'active' : ''}><a onClick={() => changeTab('support')}>
                                            <img src={supportIcon} alt="" className="img-fluid" /> <span className="pl-2">
                                            <IntlMessages id="customer.mySupport" /></span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {activeTab == 'dashboard' ? <Dashboard /> :
                            activeTab == 'orders-and-returns' ? <OrdersAndReturns /> :
                                // activeTab == 'mytrades' ? <MyTrades /> :
                                    activeTab == 'profile' ? <MyProfile /> :
                                        activeTab == 'wish-list' ? <MyWishList /> :
                                            activeTab == 'rewards' ? <MyRewards /> :
                                                activeTab == 'notifications' ? <MyNotifications /> : <MySupport />}

                    </div>
                </div>
            </section>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(Customer);