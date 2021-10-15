import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux'
import CLELogo from '../../image/CLIlogo.png';
import loading from "../../image/CLE_LogoMotionGraphics.gif";
import avatar from '../../image/avtar.svg';
import favorit from '../../image/favrot.svg';
import bell from '../../image/bell-solid.svg';
import { Link, useParams } from "react-router-dom";
import { menu } from '../../redux/pages/allPages';
import { useHistory } from "react-router";
import authAction from "../../redux/auth/actions";
import appAction from "../../redux/app/actions";
import cartAction from "../../redux/cart/productAction";
import IntlMessages from "../../components/utility/intlMessages";
import Breadcrumbs from './locationBreadcrumbs';
import MiniCart from './mini-cart';
import SearchBar from './searchBar';
import LanguageSwitcher from '../LanguageSwitcher';

const { logout } = authAction;
const { showSignin, openSignUp } = appAction;
const { accountPopup, miniCartPopup } = cartAction;
function HeaderMenu(props) {
    let history = useHistory();
    const node = useRef(null);
    let customer_id = localStorage.getItem('cust_id');
    let customerName = localStorage.getItem('token_name')
    const { category, key_url } = useParams();
    const [isLoaded, setIsLoaded] = useState(true);
    const [menuData, SetMenuData] = useState([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
    const [activeCat, SetActiveCat] = useState('')
    const [activeOne, SetActiveOne] = useState('');


    setTimeout(() => {
        setIsLoaded(false);
    }, 3000);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            setIsLoaded(true)
            SetMenuData([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
            SetActiveCat('')
            SetActiveOne('')
        };
    }, []);

    useEffect(() => {
        // console.log(location)
        async function fetchMyAPI() {
            let result: any = await menu(props.languages);
            var jsonData = result.data[0].parent.child;
            let catMenu = category ? category : jsonData[0].url_key;
            SetMenuData(jsonData);
            SetActiveOne(catMenu)
            SetActiveCat(catMenu);
        }
        fetchMyAPI()
        return () => {
            props.accountPopup(false)
            setIsLoaded(true)
            SetMenuData([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
            SetActiveCat('')
            SetActiveOne('')
        }
    }, [props.languages, category])


    const handleClick = e => {
        if (node.current.contains(e.target)) {
            // inside click
            //console.log('here inside')
            return;
        }
        // outside click
        props.accountPopup(false)

    };
    const showAccountFxn = () => {
        props.accountPopup(true)
        props.miniCartPopup(false)
    }
    const showAccountFxnBlur = () => {
        setTimeout(() => {
            props.accountPopup(false)
        }, 200)
    }
    const hideAccountFxn = () => {
        props.accountPopup(false)
    }

    const setMenu = (urlKey) => {
        SetActiveCat(urlKey)
    }

    const resetMenu = () => {
        SetActiveCat(activeOne)
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
                    <div className="col-5 pt-1">
                        <div className="select-wearing">
                            {menuData.length > 0 && (
                                <ul>
                                    {
                                        menuData.map((val, i) => {
                                            return (
                                                // <li key={i} onMouseEnter={() => { setMenu(val.url_key) }} onMouseLeave={() => resetMenu()}>
                                                <li key={i}>
                                                    <Link to={'/products/' + val.url_key} className={activeCat === val.url_key ? "line-through-active up-arrow" : ""}>{val.name}</Link >
                                                    {val && val.child && val.child.length > 0 && (<ul className={activeCat === val.url_key ? "menuactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0" : "menudeactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0"} >
                                                        {val.child.map((childMenu: any, j) => {
                                                            //  console.log(childMenu)
                                                            return (
                                                                <li className="nav-item col-6 col-md-auto active_megamenu" key={j}>
                                                                    <Link className={key_url === childMenu.url_key ? "nav-link p-2 activemenu" : "nav-link p-2"} to={'/products/' + val.url_key + '/' + childMenu.url_key}>{childMenu.name}</Link>
                                                                    <span className="megamenu_bar">
                                                                        <Link to="#" className="cross_icn"> <i className="fas fa-times"></i></Link>
                                                                        <ul className="megamenugrid">
                                                                            <h3>{childMenu.name}</h3>
                                                                            {childMenu.child && childMenu.child.map((grandChild, k) => {
                                                                                return (<li key={k}>
                                                                                    <Link to={`/products/${val.url_key}/${grandChild.url_key}`}>{grandChild.name}</Link>
                                                                                </li>)
                                                                            })}

                                                                        </ul>

                                                                    </span>
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
                    <div className="col-2">
                        <div className="cli_logo">
                            <Link className=" me-2" to="/">
                                <img src={CLELogo} className="img-fluid" alt="logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-5">

                        <div className="sell_item" style={{ display: 'none' }}>
                            <div className="sell_itemnote mb-2">
                                <Link to="#" className="btn btn-green">Sell an Item</Link>
                            </div>
                        </div>

                        <div className="user_cart">
                            <div className="cartuser-info">
                                <ul>
                                    <li><Link to="#">{customerName ? customerName : ""} </Link></li>
                                    <LanguageSwitcher />
                                    <li> <Link to="/notifications"><img src={bell} alt="notification" /></Link> </li>
                                    <li className="my_account"> <Link to="#" onClick={() => { showAccountFxn() }} onBlur={() => { showAccountFxnBlur() }} ><img src={avatar} alt="user" /> </Link>

                                        <div ref={node} className="myaccount_details" style={{ "display": !props.openAccountPop ? "none" : "block" }}>
                                            <Link to="#" className="cross_icn" onClick={() => { hideAccountFxn() }} > <i className="fas fa-times"></i></Link>
                                            {customer_id && (
                                                <ul>
                                                    {/* <li><Link to="/customer/dashboard"><IntlMessages id="youraccount" /></Link></li> */}
                                                    <li><Link to="/customer/profile"><IntlMessages id="dashboard" /> </Link></li>
                                                    <li><Link to="/customer/orders-and-returns"><IntlMessages id="myorderreturn" /></Link></li>
                                                    <li><Link to="/customer/profile"><IntlMessages id="myprofile" /></Link></li>
                                                    <li><Link to="/customer/support"><IntlMessages id="myspport" /></Link> </li>
                                                </ul>
                                            )}
                                            <div className="d-grid">
                                                {
                                                    customer_id ? <button className="btn btn-secondary" onClick={() => { logout(); }} type="button"><IntlMessages id="logout" /></button> :
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
                        <SearchBar />
                    </nav>


                </header>
            </div>



            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            {/* <AppBreadcrumbs />  */}
                            <Breadcrumbs />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

const mapStateToProps = (state) => {
    //console.log(state)
    return {
        items: state.Cart.items,
        languages: state.LanguageSwitcher.language,
        openAccountPop: state.Cart.openAccountPop
    }
}

export default connect(
    mapStateToProps,
    { logout, showSignin, openSignUp, accountPopup, miniCartPopup }
)(HeaderMenu);