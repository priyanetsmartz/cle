import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import CLELogo from '../../../image/CLIlogo.png';
import loading from "../../../image/CLE_LogoMotionGraphics.gif";
import avatar from '../../../image/avtar.svg';
import favorit from '../../../image/favrot.svg';
import { isMobile } from 'react-device-detect';
import { Link, useParams } from "react-router-dom";
import { menu } from '../../../redux/pages/allPages';
import appAction from "../../../redux/app/actions";
import cartAction from "../../../redux/cart/productAction";
import MiniCart from '../mini-cart';
import SearchBar from '../searchBar';
import { capitalize } from '../../../components/utility/allutils';
import LanguageSwitcher from '../../LanguageSwitcher';
import AccountPopup from '../accountPopup';
const { showSignin, openSignUp, menuSetup, showLoader, userType } = appAction;
const { accountPopup, miniCartPopup, addToCartTask, setCatSearch, setCurrentCat } = cartAction;
function Header(props) {
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    const baseUrl = process.env.REACT_APP_API_URL;
    const [isPriveUser, setIsPriveUser] = useState((props.token.token && props.token.token === '4') ? true : false);

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
            var jsonData = result && result.data && result.data.length > 0 ? result.data[0].parent.child : {};
            let catMenu = category ? category : jsonData && jsonData.length ? jsonData[0].url_key : {}

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
        let tokken = localToken ? localToken.token : undefined;
        if (signup === 'true' && member === 'prive' && tokken === undefined) {
            props.openSignUp(true);
            props.userType(4);
        } else if (signup === 'true' && member === 'signup' && tokken === undefined) {
            props.openSignUp(true);
            props.userType(1);
        }
        return () => {
            props.userType(1);

        }

    }, []);

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

        return () => {
            setIsLoaded(true)
            SetMenuData([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
            SetActiveCat('')
            SetActiveOne('')
            setActiveMobileMenu('');
            setActiveMobileMenuLevel2('');
            setActiveMobileMenuLevel3('');
        };
    }, []);

  


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

    const menuMObileclicK = () => {
        setMobileMenu(!mobileMenu);
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

                    <>
                        <div className="col-4 pt-1 h-mob-l">
                        </div>
                        <div className="col-4">
                            <div className="cli_logo">
                                <Link className=" me-2" onClick={() => window.location.href = '/vendor/dashboard'} to="/vendor/dashboard">
                                    <img src={CLELogo} className="img-fluid" alt="logo" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-4 h-mob-r">
                            <div className="user_cart mob-hide">
                                <div className="cartuser-info">
                                    <ul>
                                        {customerName ? <li><Link to="/customer/profile">{capitalize(customerName)}</Link></li> : ""}
                                        {props.token && props.token.vendor_name ? <li><Link to="/vendor/business-profile">{capitalize(props.token.vendor_name)}</Link></li> : ""}

                                        <li className="my_account"> <Link to="#" onClick={() => { showAccountFxn() }} onBlur={() => { showAccountFxnBlur() }} ><img src={avatar} alt="user" /> </Link>
                                            <AccountPopup />
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </>

                    <div className="col-4">
                        <div className="cli_logo logo-m">
                            <Link className=" me-2" onClick={() => window.location.href = '/vendor/dashboard'} to="/vendor/dashboard">
                                <img src={CLELogo} className="img-fluid" alt="logo" />
                            </Link>
                        </div>
                    </div>
                    <Link to='#' className="cle-mobile-menu" onClick={(e) => { menuMObileclicK(); }}><i className="fa fa-align-justify"></i></Link>

                </div>
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
                        <ul className='vendor-menu'>
                            <li><Link to="/vendor/dashboard" >Home</Link></li>
                            <li><Link to="/vendor/support" >Contact Us</Link></li>
                        </ul>
                    </nav>


                </header>
                {isMobile && (
                    <div className="user-header-info">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="user_cart">
                                    <div className="cartuser-info">
                                        <ul>

                                            <li className="my_account"> <Link to="#" onClick={() => { showAccountFxnMobile() }} onBlur={() => { showAccountFxnBlurMobile() }} ><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="22" height="22" viewBox="0 0 22 22">
                                                <path id="user_people_profile_avatar" data-name="user, people, profile, avatar" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9.641,9.641,0,0,1-5.209-1.674,7,7,0,0,1,10.418,0A9.167,9.167,0,0,1,12,21Zm6.694-3.006a8.98,8.98,0,0,0-13.388,0,9,9,0,1,1,13.388,0ZM12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z" transform="translate(-1 -1)" />
                                            </svg> </Link>
                                                <AccountPopup />

                                            </li>
                                            {customerName && (
                                                <li> <Link to="/customer/wishlist"><svg xmlns="http://www.w3.org/2000/svg" width="24.083" height="20.83" viewBox="0 0 24.083 20.83" className="wishlist-icon">
                                                    <g id="Group_136" data-name="Group 136" transform="translate(-373.892 -360.898)">
                                                        <path id="Path_34" data-name="Path 34" d="M374.892,367.708c0,7.809,11.041,13.02,11.041,13.02s11.041-6.063,11.041-13.02a5.811,5.811,0,0,0-11.041-2.532,5.811,5.811,0,0,0-11.041,2.532" transform="translate(0 0)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                        <path id="Path_35" data-name="Path 35" d="M374.892,367.708c0,7.809,11.041,13.02,11.041,13.02s11.041-6.063,11.041-13.02a5.811,5.811,0,0,0-11.041-2.532,5.811,5.811,0,0,0-11.041,2.532" transform="translate(0 0)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                    </g>
                                                </svg></Link> </li>
                                            )}
                                        </ul>
                                    </div>
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
    { setCurrentCat, showSignin, openSignUp, accountPopup, miniCartPopup, menuSetup, showLoader, addToCartTask, setCatSearch, userType }
)(Header);