import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux'
import CLELogo from '../../image/CLIlogo.png';
import loading from "../../image/CLE_LogoMotionGraphics.gif";
import avatar from '../../image/avtar.svg';
import favorit from '../../image/favrot.svg';
import bell from '../../image/bell-solid.svg';
import { isBrowser, isMobile } from 'react-device-detect';
import { Link, useParams } from "react-router-dom";
import { menu } from '../../redux/pages/allPages';
import { useHistory } from "react-router";
import authAction from "../../redux/auth/actions";
import appAction from "../../redux/app/actions";
import cartAction from "../../redux/cart/productAction";
import IntlMessages from "../../components/utility/intlMessages";
import { sessionService } from 'redux-react-session';
import MiniCart from './mini-cart';
import SearchBar from './searchBar';
import { capitalize } from '../../components/utility/allutils';
import LanguageSwitcher from '../LanguageSwitcher';

const { logout } = authAction;
const { showSignin, openSignUp, menuSetup, showLoader, userType } = appAction;
const { accountPopup, miniCartPopup, addToCartTask, setCatSearch, setCurrentCat } = cartAction;
function HeaderMenu(props) {

    const baseUrl = process.env.REACT_APP_API_URL;
    let history = useHistory();
    const node = useRef(null);
    const [isPriveUser, setIsPriveUser] = useState((props.token.token && props.token.token === '4') ? true : false);
    let cle_vendor = localStorage.getItem('cle_vendor');
    let customerName = props.token.token_name;
    const { category, subcat, childcat, greatchildcat, signup, member, categoryname } = useParams();
    const [isLoaded, setIsLoaded] = useState(true);
    const [activeMobileMenu, setActiveMobileMenu] = useState('');
    const [activeMobileMenuLevel2, setActiveMobileMenuLevel2] = useState('');
    const [activeMobileMenuLevel3, setActiveMobileMenuLevel3] = useState('');
    const [mobileMenu, setMobileMenu] = useState(false);
    const [menuData, SetMenuData] = useState([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
    const [activeCat, SetActiveCat] = useState('women')
    const [activeOne, SetActiveOne] = useState('');

    useEffect(() => {

        props.showLoader(true)
        setTimeout(() => {
            window.scrollTo(0, 0)
            props.showLoader(false);
        }, 3000);
        async function fetchMyAPI() {
            let result: any = await menu(props.languages);
            //  console.log(categoryname, category)
            var jsonData = result && result.data && result.data.length > 0 ? result.data[0].parent.child : {};
            let catMenu = category ? category : jsonData && jsonData.length ? jsonData[0].url_key : {}
            //  console.log(catMenu);
            SetMenuData(jsonData);
            SetActiveOne(catMenu)
            let active = categoryname ? categoryname : category ? category : 'women';
            SetActiveCat(active);
        }
        fetchMyAPI()
        return () => {
            setMobileMenu(false);
            props.accountPopup(false)
            setIsLoaded(true)
            SetMenuData([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
            SetActiveCat('')
            SetActiveOne('')
        }
    }, [props.languages, category])

    useEffect(() => {

        if (signup === 'true' && member === 'prive' && props.token.cust_id === undefined) {

            props.openSignUp(true);
            props.userType(4);
        } else if (signup === 'true' && member === 'signup' && props.token.cust_id === undefined) {
            props.openSignUp(true);
            props.userType(1);
        }
        return () => {
            props.userType(1);
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }

    }, []); // here 

    useEffect(() => {
        const topheaderrr = document.getElementById("topheaderrr");
        const header = document.getElementById("headerrr");
        if (isPriveUser) {
            topheaderrr.classList.add("isPriveUser");
        }

        const sticky = header.offsetTop;
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky-fullpage");
            } else {
                header.classList.remove("sticky-fullpage");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
            setActiveMobileMenu('');
            setActiveMobileMenuLevel2('');
            setActiveMobileMenuLevel3('');
        };
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            setIsLoaded(true)
            SetMenuData([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
            SetActiveCat('')
            SetActiveOne('')
            setActiveMobileMenu('');
            setActiveMobileMenuLevel2('');
            setActiveMobileMenuLevel3('');
        };
    }, []);

    const handleTopMenuClick = (urlKey, id) => {
        SetActiveCat(urlKey)
        props.setCatSearch(id)
        props.setCurrentCat(urlKey)
        setMobileMenu(!mobileMenu);
        //console.log(id, urlKey)
        // if (urlKey === 'all') {
        //     window.location.href = `/`;
        // } else {
        //     window.location.href = `/category/${urlKey}`;
        // }
    }



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
    const showAccountFxnMobile = () => {
        props.accountPopup(true)
        props.miniCartPopup(false)
    }
    const showAccountFxnBlur = () => {
        setTimeout(() => {
            props.accountPopup(false)
        }, 200)
    }
    const showAccountFxnBlurMobile = () => {
        setTimeout(() => {
            props.accountPopup(false)
        }, 200)
    }

    const hideAccountFxn = () => {
        props.accountPopup(false)
    }
    const hideAccountFxnMobile = () => {
        props.accountPopup(false)
    }
    const menuMObileclicK = () => {
        setMobileMenu(!mobileMenu);
    }
    const logout = async () => {
        if (cle_vendor) { //vendor logout
            localStorage.removeItem('cle_vendor');
            history.replace('/vendor-login');
            return;
        }
        await sessionService.deleteSession();
        await sessionService.deleteUser();
        // sessionService.deleteSession();
        // sessionService.deleteUser();

        localStorage.removeItem('cartQuoteId');
        props.logout();
        props.addToCartTask(true);
        window.location.href = '/';
    }
    // handle sigin click
    const handlesigninClick = (e) => {
        e.preventDefault();
        props.showSignin(true);
    }
    const handlesigninClickMobile = (e) => {
        e.preventDefault();
        props.showSignin(true);
    }
    const handleMenuClick = (e, id) => {
        // // e.preventDefault();
        // setCookie("_TESTCOOKIE", id);
        // props.menuSetup(id);
    }
    const handleMenuClickMob = (e, id) => {
        setMobileMenu(false);
        setActiveMobileMenu('');
        setActiveMobileMenuLevel2('');
        setActiveMobileMenuLevel3('');
    }
    const stopFunction1 = (e) => {
        e.preventDefault();
        let iddd = document.getElementById(e.target.id);
        // iddd.classList.add("minus");
        let activity = activeMobileMenu === e.target.id ? '' : e.target.id;
        if (activity === '') {
            iddd.classList.remove("minus");
        } else {
            iddd.classList.add("minus");
        }
        setActiveMobileMenu(activity);
        setActiveMobileMenuLevel2('');
        setActiveMobileMenuLevel3('');
    }
    const stopFunction2 = (e) => {
        e.preventDefault();
        let iddd = document.getElementById(e.target.id);

        let activity = activeMobileMenuLevel2 === e.target.id ? '' : e.target.id;
        if (activity === '') {
            iddd.classList.remove("minus");
        } else {
            iddd.classList.add("minus");
        }
        setActiveMobileMenuLevel2(activity);
        setActiveMobileMenuLevel3('');
        // props.showSignin(true);
    }
    const stopFunction3 = (e) => {
        e.preventDefault();
        let iddd = document.getElementById(e.target.id);
        // iddd.classList.add("minus");
        let activity = activeMobileMenuLevel3 === e.target.id ? '' : e.target.id;
        if (activity === '') {
            iddd.classList.remove("minus");
        } else {
            iddd.classList.add("minus");
        }
        setActiveMobileMenuLevel3(activity);
        // props.showSignin(true);
    }

    return (
        <div>
            {props.loading && (
                <div className="CLE-loading" style={{ "position": "fixed" }}>
                    <img className="loading-gif" src={loading} alt="loader" />
                </div>
            )}
            <div className="container header-mvp" id="header-mvp">
                <div className="row flex-nowrap justify-content-between align-items-center top-menuselect">
                    {isBrowser && (
                        <>
                            <div className="col-4 pt-1 h-mob-l">
                                <div className="select-wearing">
                                    {menuData.length > 0 && (
                                        <ul>
                                            {
                                                menuData.map((val, i) => {
                                                    let routering = val.url_key === 'women' ? '' : '/category/' + val.url_key;
                                                    return (
                                                        <li key={i}>
                                                            <Link to={routering} onClick={(e) => { handleTopMenuClick(val.url_key, val.id); }} className={activeCat === val.url_key ? "line-through-active up-arrow" : ""}>{val.name}</Link >
                                                            {val && val.child && val.child.length > 0 && (
                                                                <ul className={activeCat === val.url_key ? "menuactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0 lolo" : "menudeactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0"} >
                                                                    {val.child.map((childMenu: any, j) => {
                                                                        return (
                                                                            <li className="nav-item col-6 col-md-auto active_megamenu" key={j}>

                                                                                <Link className={subcat === childMenu.url_key ? "nav-link p-2 activemenu line-through-active" : "nav-link p-2"} onClick={(e) => { handleMenuClick(e, childMenu.id); }} to={'/products/' + val.url_key + '/' + childMenu.url_key}>{childMenu.name}</Link>
                                                                                {childMenu.child && childMenu.child.length > 0 && (
                                                                                    <span className="megamenu_bar">

                                                                                        {childMenu.child && childMenu.child.map((grandChild, l) => {
                                                                                            return (
                                                                                                <ul className="megamenugrid" key={l}>
                                                                                                    {((l === childMenu.child.length - 1) || (l === (childMenu.child.length - 2))) ? (
                                                                                                        <h3> {grandChild.name}</h3>
                                                                                                    ) :
                                                                                                        <h3> <Link to={`/products/${val.url_key}/${childMenu.url_key}/${grandChild.url_key}`}
                                                                                                            onClick={(e) => { handleMenuClick(e, grandChild.id); }} className={childcat === grandChild.url_key ? "nav-link p-2 activemenu line-through-active" : "nav-link p-2"}>{grandChild.name}</Link></h3>}
                                                                                                    {grandChild.child && grandChild.child.map((greatGrandChild, k) => {
                                                                                                        return (<li key={k}>
                                                                                                            <Link to={`/products/${val.url_key}/${childMenu.url_key}/${grandChild.url_key}/${greatGrandChild.url_key}`}
                                                                                                                onClick={(e) => { handleMenuClick(e, greatGrandChild.id); }} className={greatchildcat === greatGrandChild.url_key ? "nav-link p-2 activemenu line-through-active" : "nav-link p-2"} >{greatGrandChild.name}</Link>
                                                                                                        </li>)
                                                                                                    })}
                                                                                                </ul>)
                                                                                        })}
                                                                                        {childMenu.image && (
                                                                                            <ul className="megamenugrid last-images-menu"><li className="nav-link p-2"><Link className="btn details px-auto" onClick={(e) => { handleMenuClick(e, childMenu.id); }} to={'/products/' + val.url_key + '/' + childMenu.url_key}><img src={baseUrl + childMenu.image} width="100%" alt="megamenu" /></Link></li>
                                                                                            </ul>
                                                                                        )}
                                                                                    </span>
                                                                                )}
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
                                    <Link className=" me-2" onClick={() => window.location.href = '/'} to="/">
                                        <img src={CLELogo} className="img-fluid" alt="logo" />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-4 h-mob-r">

                                <div className="sell_item" style={{ display: 'none' }}>
                                    <div className="sell_itemnote mb-2">
                                        <Link to="#" className="btn btn-green">Sell an Item</Link>
                                    </div>
                                </div>
                                {isBrowser && (
                                    <div className="user_cart mob-hide">
                                        <div className="cartuser-info">
                                            <ul>
                                                <LanguageSwitcher />
                                                <li><Link to="/customer/profile">{customerName ? capitalize(customerName) : ""} </Link></li>
                                                {/* <li> <Link to="/notifications"><img src={bell} alt="notification" /></Link> </li> */}
                                                <li className="my_account"> <Link to="#" onClick={() => { showAccountFxn() }} onBlur={() => { showAccountFxnBlur() }} ><img src={avatar} alt="user" /> </Link>

                                                    <div ref={node} className="myaccount_details" style={{ "display": !props.openAccountPop ? "none" : "block" }}>
                                                        <Link to="#" className="cross_icn" onClick={() => { hideAccountFxn() }} > <i className="fas fa-times"></i></Link>
                                                        {Object.keys(props.token).length > 0 && (
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
                                                                (Object.keys(props.token).length > 0 || cle_vendor) ? <button className="btn btn-secondary" onClick={() => { logout(); }} type="button"><IntlMessages id="logout" /></button> :
                                                                    <button className="btn btn-secondary" type="button" onClick={(e) => { handlesigninClick(e); }} ><IntlMessages id="menu_Sign_in" /></button>
                                                            }

                                                        </div>
                                                    </div>

                                                </li>
                                                {Object.keys(props.token).length > 0 && (
                                                    <li> <Link to="/customer/wish-list"><img src={favorit} alt="wishlist" /></Link> </li>
                                                )}
                                                {!Object.keys(props.token).length && (
                                                    <li> <Link to="#" onClick={(e) => { handlesigninClickMobile(e); }}><img src={favorit} alt="wishlist" /></Link> </li>
                                                )}
                                                <MiniCart />
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <div className="col-4">
                        <div className="cli_logo">
                            <Link className=" me-2" onClick={() => window.location.href = '/'} to="/">
                                <img src={CLELogo} className="img-fluid" alt="logo" />
                            </Link>
                        </div>
                    </div>
                    <Link to='#' className="cle-mobile-menu" onClick={(e) => { menuMObileclicK(); }}><i className="fa fa-align-justify"></i></Link>

                </div>
                {isMobile && (
                    <div className="cust-mob-menu" style={{ "display": !mobileMenu ? "none" : "block" }}>
                        {menuData.length > 0 && (
                            <div className="dropdown">
                                <ul className="list-unstyled">
                                    {
                                        menuData.map((val, i) => {
                                            let routering = val.url_key === 'women' ? '' : '/category/' + val.url_key;
                                            return (
                                                <li className="dropdownuuu" key={i} >
                                                    <Link to={routering} onClick={(e) => { handleTopMenuClick(val.url_key, val.id); }} className={activeCat === val.url_key ? "line-through-active up-arrow" : ""}>{val.name}</Link >
                                                    <span className="dropdown-toggle" id={`menukey-${val.name}`} onClick={(e) => { stopFunction1(e); }} data-bs-toggle="dropdownzcz"></span>
                                                    {val && val.child && val.child.length > 0 && (

                                                        <ul className={activeMobileMenu === `menukey-${val.name}` ? `dropdown-menu menukey-${val.name} show` : `dropdown-menu menukey-${val.name}`} >
                                                            {val.child.map((childMenu: any, j) => {
                                                                return (
                                                                    <li className="dropdown1" key={j} >
                                                                        <Link to={`/products/${val.url_key}/${childMenu.url_key}`} onClick={(e) => { handleMenuClickMob(e, childMenu.id); }}>{childMenu.name}</Link>
                                                                        <span className="dropdown-toggle" data-bs-toggle="dropdown1" id={`menukey-${childMenu.name}`} onClick={(e) => { stopFunction2(e); }} ></span>
                                                                        <ul className={activeMobileMenuLevel2 === `menukey-${childMenu.name}` ? `dropdown-menu menukey-${childMenu.name} show` : `dropdown-menu menukey-${childMenu.name}`}>
                                                                            {childMenu.child && childMenu.child.map((grandChild, l) => {
                                                                                return (
                                                                                    <li className="dropdown3" key={l} >
                                                                                        <Link to={`/products/${val.url_key}/${childMenu.url_key}/${grandChild.url_key}`} onClick={(e) => { handleMenuClickMob(e, childMenu.id); }} >{grandChild.name}</Link>{(grandChild.child && grandChild.child.length > 0) && (<span className="dropdown-toggle" data-bs-toggle="dropdown3" id={`menukey-${grandChild.name}`} onClick={(e) => { stopFunction3(e); }}></span>)}
                                                                                        <ul className={activeMobileMenuLevel3 === `menukey-${grandChild.name}` ? `dropdown-menu menukey-${grandChild.name} show` : `dropdown-menu menukey-${grandChild.name}`}>
                                                                                            {grandChild.child && grandChild.child.map((greatGrandChild, k) => {
                                                                                                return (
                                                                                                    <li className="dropdown4" key={k} >
                                                                                                        <Link to={`/products/${val.url_key}/${childMenu.url_key}/${grandChild.url_key}/${greatGrandChild.url_key}`} onClick={(e) => { handleMenuClickMob(e, childMenu.id); }} >{greatGrandChild.name}</Link>
                                                                                                    </li>)
                                                                                            })}
                                                                                        </ul>
                                                                                    </li>)
                                                                            })}
                                                                        </ul>
                                                                    </li>
                                                                )
                                                            })}

                                                        </ul>
                                                    )
                                                    }
                                                </li>
                                            )
                                        })}

                                </ul>
                            </div>
                        )}
                    </div>
                )}
                <header className="header-top navbar navbar-expand-md navbar-light main-navbr mb-2">
                    <nav className="container-xxl flex-wrap flex-md-nowrap " aria-label="Main navigation">
                        <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar"
                            aria-controls="bdNavbar" aria-label="Toggle navigation">
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
                {isMobile && (
                    <div className="user-header-info">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="user_cart">
                                    <div className="cartuser-info">
                                        <ul>
                                            <LanguageSwitcher />
                                            {/* <li><Link to="#">{customerName ? capitalize(customerName) : ""} </Link></li> */}
                                            {/* <li> <Link to="/notifications"><img src={bell} alt="notification" /></Link> </li> */}
                                            <li className="my_account"> <Link to="#" onClick={() => { showAccountFxnMobile() }} onBlur={() => { showAccountFxnBlurMobile() }} ><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="22" height="22" viewBox="0 0 22 22">
                                                <path id="user_people_profile_avatar" data-name="user, people, profile, avatar" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9.641,9.641,0,0,1-5.209-1.674,7,7,0,0,1,10.418,0A9.167,9.167,0,0,1,12,21Zm6.694-3.006a8.98,8.98,0,0,0-13.388,0,9,9,0,1,1,13.388,0ZM12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z" transform="translate(-1 -1)" />
                                            </svg> </Link>

                                                <div ref={node} className="myaccount_details" style={{ "display": !props.openAccountPop ? "none" : "block" }}>
                                                    <Link to="#" className="cross_icn" onClick={() => { hideAccountFxnMobile() }} > <i className="fas fa-times"></i></Link>
                                                    {Object.keys(props.token).length > 0 && (
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
                                                            (Object.keys(props.token).length > 0 || cle_vendor) ? <button className="btn btn-secondary" onClick={() => { logout(); }} type="button"><IntlMessages id="logout" /></button> :
                                                                <button className="btn btn-secondary" type="button" onClick={(e) => { handlesigninClickMobile(e); }} ><IntlMessages id="menu_Sign_in" /></button>
                                                        }

                                                    </div>
                                                </div>

                                            </li>
                                            {customerName && (
                                                <li> <Link to="/customer/wish-list"><svg xmlns="http://www.w3.org/2000/svg" width="24.083" height="20.83" viewBox="0 0 24.083 20.83" className="wishlist-icon">
                                                    <g id="Group_136" data-name="Group 136" transform="translate(-373.892 -360.898)">
                                                        <path id="Path_34" data-name="Path 34" d="M374.892,367.708c0,7.809,11.041,13.02,11.041,13.02s11.041-6.063,11.041-13.02a5.811,5.811,0,0,0-11.041-2.532,5.811,5.811,0,0,0-11.041,2.532" transform="translate(0 0)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                        <path id="Path_35" data-name="Path 35" d="M374.892,367.708c0,7.809,11.041,13.02,11.041,13.02s11.041-6.063,11.041-13.02a5.811,5.811,0,0,0-11.041-2.532,5.811,5.811,0,0,0-11.041,2.532" transform="translate(0 0)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                    </g>
                                                </svg></Link> </li>
                                            )}
                                            <MiniCart />
                                        </ul>
                                    </div>
                                    <SearchBar />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div >
    )
}

const mapStateToProps = (state) => {
    // sessionService.loadSession().then(session => console.log(session));

    return {
        items: state.Cart.items,
        languages: state.LanguageSwitcher.language,
        openAccountPop: state.Cart.openAccountPop,
        loading: state.App.loader,
        token: state.session.user,
        currentCAT: state.Cart.catname
    }
}

export default connect(
    mapStateToProps,
    { logout, setCurrentCat, showSignin, openSignUp, accountPopup, miniCartPopup, menuSetup, showLoader, addToCartTask, setCatSearch, userType }
)(HeaderMenu);