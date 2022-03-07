import React from 'react';
import { Link } from "react-router-dom";
import IntlMessages from "../../components/utility/intlMessages";
import { useHistory } from "react-router";
import authAction from "../../redux/auth/actions";
import { sessionService } from 'redux-react-session';
import { connect } from 'react-redux'
import appAction from "../../redux/app/actions";
import cartAction from "../../redux/cart/productAction";
import { logoutUser } from '../../components/utility/allutils';
const { showSignin, openSignUp, userType } = appAction;
const { accountPopup, addToCartTask } = cartAction;
const { logout } = authAction;
function AccountPopup(props) {
    let history = useHistory();
    let cle_vendor = localStorage.getItem('cle_vendor');

    const hideAccountFxn = () => {
        props.accountPopup(false)
    }
    const handlesigninClick = (e) => {
        e.preventDefault();
        props.showSignin(true);
    }
    const logout = async () => {
        if (cle_vendor) {
            localStorage.removeItem('cle_vendor');
            history.replace('/vendor-login');
            return;
        }
        logoutUser();
        props.logout();
        props.addToCartTask(true);
        window.location.href = '/';
    }
    return (
        <div className="myaccount_details" style={{ "display": !props.openAccountPop ? "none" : "block" }}>
            <Link to="#" className="cross_icn" onClick={() => { hideAccountFxn() }} > <i className="fas fa-times"></i></Link>
            {(Object.keys(props.token).length > 0 && props.token.type === 'user') && (
                <ul>
                 
                    <li><Link to="/customer/profile"><IntlMessages id="dashboard" /> </Link></li>
                    <li><Link to="/customer/orders-and-returns"><IntlMessages id="myorderreturn" /></Link></li>
                    <li><Link to="/customer/profile"><IntlMessages id="myprofile" /></Link></li>
                    <li><Link to="/customer/support"><IntlMessages id="myspport" /></Link> </li>
                </ul>
            )}
            {(Object.keys(props.token).length > 0 && props.token.type === 'vendor') && (
                <ul>
                  
                    <li><Link to="/vendor/dashboard"><IntlMessages id="dashboard" /> </Link></li>
                   
                    <li><Link to="/vendor/business-profile"><IntlMessages id="myprofile" /></Link></li>
                    <li><Link to="/vendor/support"><IntlMessages id="myspport" /></Link> </li>
                </ul>
            )}
            <div className="d-grid">
                {
                    (Object.keys(props.token).length > 0) ? <button className="btn btn-secondary" onClick={() => { logout(); }} type="button"><IntlMessages id="logout" /></button> :
                        <button className="btn btn-secondary" type="button" onClick={(e) => { handlesigninClick(e); }} ><IntlMessages id="menu_Sign_in" /></button>
                }

            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {

        languages: state.LanguageSwitcher.language,
        openAccountPop: state.Cart.openAccountPop,
        token: state.session.user,
    }
}


export default connect(
    mapStateToProps,
    { logout, showSignin, openSignUp, userType, addToCartTask, accountPopup }
)(AccountPopup);