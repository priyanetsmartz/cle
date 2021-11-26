import { useRef, useEffect, useState } from 'react';
import cartIcon from '../../image/carticon.svg';
import { Link } from "react-router-dom";
import { getCartItems, getCartTotal, getGuestCart, getGuestCartTotal } from '../../redux/cart/productApi';
import { connect } from 'react-redux';
import cartAction from "../../redux/cart/productAction";
import IntlMessages from "../../components/utility/intlMessages";
import { formatprice } from '../../components/utility/allutils';
import { siteConfig } from '../../settings';
const { addToCartTask, accountPopup, miniCartPopup } = cartAction;
function MiniCart(props) {
    const node = useRef(null);
    const [cartItemsVal, setCartItems] = useState({});
    const [cartTotal, setCartTotal] = useState(0);



    useEffect(() => {
        if (props.items || !props.items) {
            //   console.log(props.items)
            callGetCartItems()
        }

        return () => {
            props.addToCartTask(false);
            props.miniCartPopup(false)
        }
    }, [props.languages, props.items, props.token])

    const callGetCartItems = async () => {
        let cartData = [], total = 0, cartItems: any, cartTotal: any;
        let customer_id =props.token.cust_id;
       
        const cartQuoteId = localStorage.getItem('cartQuoteId');
        const cartQuoteToken = localStorage.getItem('cartQuoteToken');
        if (customer_id && cartQuoteId) {
            
            cartItems = await getCartItems(props.languages);
            cartData = cartItems.data.items;
          
            // get cart total 
            cartTotal = await getCartTotal();
            total = cartTotal.data.grand_total;

            //console.log(total) 

        } if (cartQuoteToken && cartQuoteId) {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart(props.languages);
                cartData = cartItems.data.items;
                cartTotal = await getGuestCartTotal();
                total = cartTotal.data.grand_total;

            }
        }

        let cartValues = {};
        cartValues['items'] = cartData;
      //  console.log(cartValues);
        setCartItems(cartValues)
        setCartTotal(total);

    }
    const showCartFxn = () => {
        props.miniCartPopup(true)
        props.accountPopup(false)

    }
    const showCartFxnBlur = () => {
        setTimeout(() => {
            props.miniCartPopup(false)
        }, 200)
    }
    const hideCart = () => {
        // console.log('close')
        props.miniCartPopup(false)
    }
    return (

        <li className="your_cart"> <Link to="#" onClick={() => { showCartFxn() }} onBlur={() => { showCartFxnBlur() }}  >
            <svg xmlns="http://www.w3.org/2000/svg" id="Icon_handbag" width="24" height="24" viewBox="0 0 24 24">
                <g id="Icon_handbag-2" data-name="Icon_handbag" transform="translate(3 3)">
                    <path id="Path" d="M2.594.79A1,1,0,0,1,3.572,0H13.955a1,1,0,0,1,.978.79l2.571,12A1,1,0,0,1,16.526,14H1a1,1,0,0,1-.978-1.21Z" transform="translate(0.237 4)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
                    <path id="Path-2" data-name="Path" d="M8,4A4,4,0,0,0,0,4" transform="translate(5)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
                </g>
            </svg>
            <span className="cart-number">({cartItemsVal && cartItemsVal['items'] ? cartItemsVal['items'].length : 0})</span></Link>
            <div className="miniaccount_details" style={{ "display": !props.showMiniCart ? "none" : "block" }}>
                <div className="cart_your"><IntlMessages id="yourcart" /></div>
                <Link to="#" className="cross_icn" onClick={() => { hideCart() }} > <i className="fas fa-times"></i></Link>
                <ul>
                    {cartItemsVal && cartItemsVal['items'] && cartItemsVal['items'].length ?
                        (
                            // <p></p>
                            cartItemsVal['items'].slice(0, 4).map((item, i) => {
                                return (
                                    <li key={i}>
                                        <Link to={'/product-details/' + item.sku}><span className="minicartprodt_img"><img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} className="imge-fluid" /></span>
                                            <span className="minicartprodt_name">
                                                <h6 className="minicart_pname">{item.extension_attributes.brand}</h6>
                                                <span className="minicart_pname">{item.name}</span>
                                                {/* <span className="minicart_prodt_tag">Manager pattern bag</span> */}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })
                        ) :
                        <IntlMessages id="cart.cartEmpty" />
                    }
                </ul>
                {cartItemsVal && cartItemsVal['items'] && cartItemsVal['items'].length ?
                    (
                        <div className="minitotl_amnt">
                            <div className="minicart_label"><IntlMessages id="total" /></div>
                            <div className="minicart_amount">{siteConfig.currency}{formatprice(cartTotal)} </div>
                        </div>
                    ) : ""}
                <div className="width-100">
                    <div className="d-grid mini-cart-btn">
                        {cartItemsVal && cartItemsVal['items'] && cartItemsVal['items'].length ?
                            (
                                <Link to="/my-cart" className="btn btn-secondary" type="button"><IntlMessages id="cart.menu" /></Link>
                            ) : ""} 

                        {/* {cartItemsVal && cartItemsVal['items'] && cartItemsVal['items'].length ?
                            (
                                <Link to="/checkout" className="btn btn-secondary" type="button"><IntlMessages id="checkout.menu" /></Link>
                            ) : ""} */}
                    </div>
                </div>
            </div>
        </li>
    )
}


const mapStateToProps = (state) => {
    // console.log(state);
    return {
        items: state.Cart.addToCartTask,
        showMiniCart: state.Cart.openMiniCartPop,
        token: state.session.user,
        languages: state.LanguageSwitcher.language,
    }
}

export default connect(
    mapStateToProps,
    { addToCartTask, accountPopup, miniCartPopup }
)(MiniCart);