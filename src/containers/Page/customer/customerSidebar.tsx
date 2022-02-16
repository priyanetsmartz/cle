import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import OrdersAndReturns from './allOrders';
import MyProfile from './myProfile';
import MyWishList from './myWishlist';
import MyRewards from './myRewards';
import MyNotifications from './myNotifications';
import MySupport from './mySupport';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
import { capitalize } from '../../../components/utility/allutils';
import appAction from "../../../redux/app/actions";
const { showLoader } = appAction;

function Customer(props) {
    const intl = useIntl();
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    const userGroup = props.token ? props.token : localToken ? localToken.token : "";
    const usrername = localToken ? localToken.token_name : "";
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup === '4') ? true : false);
    const [name, setName] = useState();
    const history = useHistory();
    const key = props.match.params.tab;
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        let namee = props.customerName ? props.customerName : usrername;
        setName(namee);
    }, [props.customerName])
    useEffect(() => {
        const header = document.getElementById("customersidebar");
        const sticky = header.offsetTop;
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky-sidebar");
            } else {
                header.classList.remove("sticky-sidebar");
            }
        });
        setActiveTab(key);
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, [key, localToken]);

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
                        <div className="col-sm-3" id="customersidebar">
                            <div className="sticky-fliter">
                                <div className="pro_categry_sidebar">
                                    <div className="my-userdetails">
                                        <div className="user_show" style={priveColor}><IntlMessages id="customer.hi" /></div>
                                        <div className="user_name">{name ? capitalize(name) : ""}</div>
                                    </div>
                                    <div className="mobile_sidebar">
                                        <select className="form-select" aria-label="Default select example" onChange={changeMobTab}>
                                            <option value="dashboard">{intl.formatMessage({ id: 'register.email' })}</option>
                                            <option value="orders-and-returns">{intl.formatMessage({ id: 'customer.ordersAndReturns' })}</option>
                                            <option value="wishlist">{intl.formatMessage({ id: 'customer.myWishlist' })}</option>
                                            <option value="profile">{intl.formatMessage({ id: 'customer.myProfile' })}</option>
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
                                            <li className={activeTab === 'wishlist' ? 'active' : ''}>
                                                <Link to="#" onClick={() => changeTab('wishlist')} className={isPriveUser ? 'prive-txt' : ''}>
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
                        </div>
                        {activeTab === 'dashboard' ? <MyProfile /> :
                            activeTab === 'orders-and-returns' ? <OrdersAndReturns /> :
                                activeTab === 'profile' ? <MyProfile /> :
                                    activeTab === 'wishlist' ? <MyWishList /> :
                                        activeTab === 'rewards' ? <MyRewards /> :
                                            activeTab === 'notifications' ? <MyNotifications /> : <MySupport />}

                    </div>
                </div>
            </section>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        token: state?.session?.user,
        customerName: state?.Auth?.customer,
    }
}

export default connect(
    mapStateToProps,
    { showLoader }
)(Customer);