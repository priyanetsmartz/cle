import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import CLELogo from '../../image/CLIlogo.png'
import avatar from '../../image/avtar.svg'
import favorit from '../../image/favrot.svg'
import cartIcon from '../../image/carticon.svg'
import IconZoomIn from '../../image/Icon_zoom_in.svg'
import { Link, useParams } from "react-router-dom";
import { menu } from '../../redux/pages/allPages';
import { useLocation } from "react-router-dom";
import { getCartItems, getCartTotal } from '../../redux/cart/productApi';
import { useHistory } from "react-router";

function HeaderMenu(props) {
    let history = useHistory();
    const location = useLocation()
    let customer_id = localStorage.getItem('cust_id');
    let customerName = localStorage.getItem('token_name')
    const { category, key_url } = useParams();
    const [menuData, SetMenuData] = useState([{ name: '', id: '', url_key: '', child: [{ name: '', id: '', url_key: '' }] }])
    const [activeCat, SetActiveCat] = useState('')
    const [showCart, SetShowCart] = useState(false)
    const [showAccount, SetShowAccount] = useState(false)
    const [cartItemsVal, setCartItems] = useState([{ id: '', item_id: 0, extension_attributes: { item_image: "" }, name: '', price: 0, quantity: 0, desc: '', qty: 0, sku: '' }]);
    const [cartTotal, setCartTotal] = useState(0);
    useEffect(() => {
        async function fetchMyAPI() {
            let result: any = await menu(props.languages);
            var jsonData = result.data[0].parent.child;
            //console.log(jsonData[0].url_key)
            let catMenu = category ? category : jsonData[0].url_key;
            SetMenuData(jsonData);
            SetActiveCat(catMenu);
        }
        fetchMyAPI()
    }, [props.languages, location, category])
    useEffect(() => {
        callGetCartItems()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])

    const callGetCartItems = async () => {
        let cartData = [], total = 0;

        if (customer_id) {
            let cartItems: any = await getCartItems();
            cartData = cartItems.data.items;
            let cookieData = localStorage.getItem('cartItems');
            let cookieArray = JSON.parse(cookieData);

            // get cart total 
            let cartTotal: any = await getCartTotal();
            total = cartTotal.data.grand_total;

            let newCartData = cookieArray.reduce((a, { sku, quantity }) => {
                if (sku) {
                    a.push({ sku, qty: quantity, quote_id: localStorage.getItem('cartQuoteId') });
                }
                return a;
            }, []);
            // let obj = { cartItem: "" };
            // let cartObject = Object.assign(obj, { cartItem: newCartData });
            // cartData = [...cookieArray, ...simpleArray]

        } else {
            const data = localStorage.getItem('cartItems')
            total = parseInt(localStorage.getItem('cartTotal'));
            cartData = data ? JSON.parse(data) : [];
        }
        // console.log(cartData)
        setCartItems(cartData)
        setCartTotal(total);

    }
    const hideCart = () => {
        // console.log('close')
        SetShowCart(false)
    }
    const showCartFxn = () => {
        //console.log('here')
        SetShowCart(true)
    }
    const showAccountFxn = () => {
        SetShowAccount(true)
    }
    const hideAccountFxn = () => {
        SetShowAccount(false)
    }

    const logout = () => {
        // Clear access token and ID token from local storage
        props.toggleOpenDrawer(false);
        localStorage.removeItem('id_token');
        localStorage.removeItem('cust_id');
        localStorage.removeItem('token_email');
        localStorage.removeItem('token');
        localStorage.removeItem('token_name');
        localStorage.removeItem('cartQuoteId');
        //  cookie.remove('name', { path: '', domain: '.dev.cle.com/' })
        props.logout();
        props.showHelpus(false);
        history.replace('/');
    }

    return (
        <>
            <div className="container">
                <div className="row flex-nowrap justify-content-between align-items-center top-menuselect">
                    <div className="col-4 pt-1">
                        <div className="select-wearing">
                            <ul>
                                {
                                    menuData.map(val => {
                                        return (<li key={val.id}> <Link to={'products/' + val.url_key} className={activeCat === val.url_key ? "line-through-active up-arrow" : ""}>{val.name}</Link >
                                            {
                                                <ul className={activeCat === val.url_key ? "menuactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0" : "menudeactive navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0"} >
                                                    {val.child.map((childMenu) => {
                                                        return (
                                                            <li className="nav-item col-6 col-md-auto" key={childMenu.id}>
                                                                <Link className={key_url === childMenu.url_key ? "nav-link p-2 activemenu" : "nav-link p-2"} to={'products/' + val.url_key + '/' + childMenu.url_key}>{childMenu.name}</Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            }
                                        </li>)
                                    })
                                }
                            </ul>
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
                                                <li><Link to="/myaccount">Your Account</Link></li>
                                                <li><Link to="#">Dashboard </Link></li>
                                                <li><Link to="#">My orders & returns</Link></li>
                                                <li><Link to="#">My trades </Link></li>
                                                <li><Link to="#">My profile </Link></li>
                                                <li><Link to="#">My support</Link> </li>
                                            </ul>
                                            <div className="d-grid">
                                                {
                                                    customer_id ? <button className="btn btn-secondary" onClick={() => { logout(); }} type="button">Logout</button> :
                                                        <button className="btn btn-secondary" type="button">Login</button>
                                                }

                                            </div>
                                        </div>

                                    </li>
                                    <li> <Link to="/wishlist"><img src={favorit} alt="wishlist" /></Link> </li>
                                    <li className="your_cart"> <Link to="#" onClick={() => { showCartFxn() }}  ><img src={cartIcon} alt="cart-icon" /> <span className="cart-number">(3)</span></Link>
                                        <div className="miniaccount_details" style={{ "display": !showCart ? "none" : "block" }}>
                                            <div className="cart_your">Your cart</div>
                                            <Link to="#" className="cross_icn" onClick={() => { hideCart() }} > <i className="fas fa-times"></i></Link>
                                            <ul>
                                                {cartItemsVal.length ?
                                                    (
                                                        // <p></p>
                                                        cartItemsVal.map(item => {
                                                            return (
                                                                <li key={item.id}>
                                                                    <Link to={'product/' + item.sku}><span className="minicartprodt_img"><img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} className="imge-fluid" /></span>
                                                                        <span className="minicartprodt_name">
                                                                            <span className="minicart_pname">{item.name}</span>
                                                                            <span className="minicart_prodt_tag">Manager pattern bag</span>
                                                                        </span>
                                                                    </Link>
                                                                </li>
                                                            )
                                                        })
                                                    ) :
                                                    "Your cart is empty"
                                                }
                                            </ul>
                                            <div className="minitotl_amnt">
                                                <div className="minicart_label">Total</div>
                                                <div className="minicart_amount">${cartTotal}</div>
                                            </div>
                                            <div className="width-100">
                                                <div className="d-grid">
                                                    <Link to="/my-cart" className="btn btn-secondary" type="button">Cart</Link>
                                                    <br />
                                                    <button className="btn btn-secondary" type="button">Checkout</button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
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
                        {/* <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="/">New in</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2 active" aria-current="true" to="#" >Watches</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="/docs/5.0/examples/" >Jewerly</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="https://icons.getbootstrap.com/" target="_blank"
                                    rel="noopener">Designers</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="https://themes.getbootstrap.com/" target="_blank"
                                    rel="noopener">Pre-Owned</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="https://blog.getbootstrap.com/" target="_blank"
                                    rel="noopener">Sale</Link>
                            </li>
                        </ul> */}

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
)(HeaderMenu);