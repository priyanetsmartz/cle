import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import CLELogo from '../../image/CLIlogo.png';
import loading from "../../image/CLE_LogoMotionGraphics.gif";
import avatar from '../../image/avtar.svg';
import favorit from '../../image/favrot.svg';
import IconZoomIn from '../../image/Icon_zoom_in.svg'
import { Link, useParams } from "react-router-dom";
import { menu } from '../../redux/pages/allPages';
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import authAction from "../../redux/auth/actions";
import appAction from "../../redux/app/actions";
import IntlMessages from "../../components/utility/intlMessages";
import { AppBreadcrumbs } from "./breadCrumbs";
import MiniCart from './mini-cart';

const { logout } = authAction;
const { showSignin, openSignUp } = appAction;
function HeaderMenu(props) {
    let history = useHistory();
    const location = useLocation()
    let customer_id = localStorage.getItem('cust_id');
    let customerName = localStorage.getItem('token_name')
    const { category, key_url } = useParams();
    const [isLoaded, setIsLoaded] = useState(true);
    const [menuData, SetMenuData] = useState([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
    const [activeCat, SetActiveCat] = useState('')
    const [showAccount, SetShowAccount] = useState(false);

    setTimeout(() => {
        setIsLoaded(false);
    }, 3000);

    useEffect(() => {
        async function fetchMyAPI() {
            let result: any = await menu(props.languages);
            var jsonData = result.data[0].parent.child;
            let catMenu = category ? category : jsonData[0].url_key;
            SetMenuData(jsonData);
            SetActiveCat(catMenu);
        }
        fetchMyAPI()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages, location, category])

    const showAccountFxn = () => {
        SetShowAccount(true)
    }
    const hideAccountFxn = () => {
        SetShowAccount(false)
    }

    const logout = () => {
        // Clear access token and ID token from local storage
        // props.toggleOpenDrawer(false);
        localStorage.removeItem('id_token');
        localStorage.removeItem('cust_id');
        localStorage.removeItem('token_email');
        localStorage.removeItem('token');
        localStorage.removeItem('token_name');
        localStorage.removeItem('cartQuoteId');
        //  cookie.remove('name', { path: '', domain: '.dev.cle.com/' })
        props.logout();
        //  props.showHelpus(false);
        history.replace('/');
    }
    // handle sigin click
    const handlesigninClick = (e) => {
        e.preventDefault();
        props.showSignin(true);
    }
    return (
        <>
            {isLoaded && (
                <div className="CLE-loading" style={{ "position": "fixed" }}>
                    <img className="loading-gif" src={loading} alt="loader" />
                </div>
            )}
            <div className="container">
                <div className="row flex-nowrap justify-content-between align-items-center top-menuselect">
                    <div className="col-4 pt-1">
                        <div className="select-wearing">
                            {menuData.length > 0 && (
                                <ul>
                                    {
                                        menuData.map((val, i) => {
                                            return (
                                                <li key={i}>
                                                    <Link to={'/products/' + val.url_key} className={activeCat === val.url_key ? "line-through-active up-arrow" : ""}>{val.name}</Link >
                                                    {val && val.child && val.child.length > 0 && (<ul className={activeCat === val.url_key ? "menuactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0" : "menudeactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0"} >
                                                        {val.child.map((childMenu, j) => {
                                                            //  console.log(childMenu)
                                                            return (
                                                                <li className="nav-item col-6 col-md-auto" key={j}>
                                                                    <Link className={key_url === childMenu.url_key ? "nav-link p-2 activemenu" : "nav-link p-2"} to={'/products/' + val.url_key + '/' + childMenu.url_key}>{childMenu.name}</Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                    )}
                                                </li>)
                                        })
                                    }
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="cli_logo">
                            <Link className=" me-2" to="/">
                                <img src={CLELogo} className="img-fluid" alt="logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-4">

                        <div className="sell_item" style={{ display: 'none' }}>
                            <div className="sell_itemnote mb-2">
                                <Link to="#" className="btn btn-green">Sell an Item</Link>
                            </div>
                        </div>

                        <div className="user_cart">
                            <div className="cartuser-info">
                                <ul>
                                    <li><Link to="#">{customerName ? customerName : ""} </Link></li>
                                    <li className="my_account"> <Link to="#" onClick={() => { showAccountFxn() }}  ><img src={avatar} alt="user" /> </Link>

                                        <div className="myaccount_details" style={{ "display": !showAccount ? "none" : "block" }}>
                                            <Link to="#" className="cross_icn" onClick={() => { hideAccountFxn() }} > <i className="fas fa-times"></i></Link>
                                            <ul>
                                                <li><Link to="/customer/dashboard">Your Account</Link></li>
                                                <li><Link to="/customer/dashboard">Dashboard </Link></li>
                                                <li><Link to="/customer/orders-and-returns">My orders & returns</Link></li>
                                                {/* <li><Link to="/customer/mytrades">My trades </Link></li> */}
                                                <li><Link to="/customer/profile">My profile </Link></li>
                                                <li><Link to="/customer/support">My support</Link> </li>
                                            </ul>
                                            <div className="d-grid">
                                                {
                                                    customer_id ? <button className="btn btn-secondary" onClick={() => { logout(); }} type="button">Logout</button> :
                                                        <button className="btn btn-secondary" type="button" onClick={(e) => { handlesigninClick(e); }} ><IntlMessages id="menu_Sign_in" /></button>
                                                }

                                            </div>
                                        </div>

                                    </li>
                                    <li> <Link to="/customer/wish-list"><img src={favorit} alt="wishlist" /></Link> </li>
                                    <MiniCart />
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <header className="header-top navbar navbar-expand-md navbar-light main-navbr mb-2">
                <nav className="container-xxl flex-wrap flex-md-nowrap " aria-label="Main navigation">
                    <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar"
                        aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="bi" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z">
                            </path>
                        </svg>
                    </button>

                    <div className="navbar-collapse collapse mainmenu-bar" id="bdNavbar">
                        <hr className="d-md-none text-white-50" />
                        <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
                            <div className="search_input">
                                <div className="search_top"><img src={IconZoomIn} alt="" className="me-1" />
                                    <input type="search" placeholder="Search..." className="form-control me-1" />
                                    <select className="form-select" aria-label="Default select example">
                                        <option value="">Select category</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>

                                </div>
                            </div>
                        </ul>


                    </div>
                </nav>


            </header>

            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <AppBreadcrumbs />
                                {/* <ol className="breadcrumb"> */}
                                {/* <li className="breadcrumb-item"><Link to="/">Home</Link></li>

                                    <li className="breadcrumb-item"><a href="#">My Account</a></li>
                                    <li className="breadcrumb-item"><a href="#">My Orders and Returns</a></li> */}
                                {/* {breadCrumbs.map(item => {
                                        return ( item == '' ? null :
                                            <li className="breadcrumb-item" key={item}><Link to={item}>{item}</Link></li>
                                            
                                        );
                                    })} */}
                                {/* </ol> */}
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items,
        languages: state.LanguageSwitcher.language
    }
}

export default connect(
    mapStateToProps,
    { logout, showSignin, openSignUp }
)(HeaderMenu);