import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import Dashboard from './dashboard';
import OrdersAndReturns from './ordersAndReturns';
import MyTrades from './mytrades';


function Customer(props) {

    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        console.log(props.match.params.tab);
    }, []);

    const chnageTab = (tab) => {
        setActiveTab(tab);
    }

    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">My Account</a></li>
                                    <li className="breadcrumb-item"><a href="#">My Orders and Returns</a></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="pro_categry_sidebar">
                                <div className="my-userdetails">
                                    <div className="user_show">Hi</div>
                                    <div className="user_name">Ann Smith</div>
                                </div>
                                <div className="mobile_sidebar">
                                    <select className="form-select" aria-label="Default select example">
                                        <option value="">Dashboard</option>
                                        <option value="1">My Orders & Returns</option>
                                        <option value="2">My Trades</option>
                                        <option value="3">My Wishlist</option>
                                        <option value="3">My Profile</option>
                                        <option value="3">My Notifications</option>
                                        <option value="3">My Support</option>
                                    </select>
                                </div>
                                <div className="myorder_sidebar">
                                    <ul>
                                        <li className={activeTab == 'dashboard' ? 'active' : ''}><a onClick={() => chnageTab('dashboard')}><img src="./images/dashboard_icon.svg" alt="" className="img-fluid" /> <span
                                            className="pl-2">Dashboard</span></a></li>
                                        <li className={activeTab ==  'ordersReturns' ? 'active' : ''}><a onClick={() => chnageTab('ordersReturns')}><img src="./images/myorder_icon.svg" alt="" className="img-fluid" /> <span
                                            className="pl-2">My Orders & Returns</span></a></li>
                                        <li className={activeTab == 'trades' ? 'active' : ''}><a onClick={() => chnageTab('trades')}><img src="./images/my_trade.svg" alt="" className="img-fluid" /> <span className="pl-2">My
                                            Trades</span></a></li>
                                        <li><a href="#"><img src="./images/my_reward.svg" alt="" className="img-fluid" /> <span className="pl-2">My
                                            Rewards</span></a></li>
                                        <li><a href="#"><img src="./images/mywish_list.svg" alt="" className="img-fluid" /> <span className="pl-2">My
                                            Wishlist</span></a></li>
                                        <li><a href="#"><img src="./images/my_profile.svg" alt="" className="img-fluid" /> <span className="pl-2">My
                                            Profile</span></a></li>
                                        <li><a href="#"><img src="./images/my_notification.svg" alt="" className="img-fluid" /> <span
                                            className="pl-2">My Notifications</span></a></li>
                                        <li><a href="#"><img src="./images/my_support.svg" alt="" className="img-fluid" /> <span className="pl-2">My
                                            Support</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {activeTab == 'dashboard' ? <Dashboard />
                         : activeTab == 'ordersReturns' ? <OrdersAndReturns /> :
                          activeTab == 'trades' ? <MyTrades /> : null}
                        
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