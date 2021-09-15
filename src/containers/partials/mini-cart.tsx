import { useEffect, useState } from 'react';
import cartIcon from '../../image/carticon.svg';
import { Link } from "react-router-dom";
import { getCartItems, getCartTotal, getGuestCart, getGuestCartTotal } from '../../redux/cart/productApi';
import { connect } from 'react-redux';
import cartAction from "../../redux/cart/productAction";
const { addToCartTask } = cartAction;
function MiniCart(props) {

    const [showCart, SetShowCart] = useState(false);
    const [cartItemsVal, setCartItems] = useState({});
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        if (props.items || !props.items) {
            //   console.log(props.items)
            callGetCartItems()
        }

        return () => {
            props.addToCartTask(false);
        }
    }, [props.items])

    const callGetCartItems = async () => {
        let cartData = [], total = 0, cartItems: any, cartTotal: any;
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            cartItems = await getCartItems();
            cartData = cartItems.data.items;
            // get cart total 
            cartTotal = await getCartTotal();
            total = cartTotal.data.grand_total;

        } else {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart();
                cartData = cartItems.data.items;
                cartTotal = await getGuestCartTotal();
                total = cartTotal.data.grand_total;

            }
        }

        let cartValues = {};
        cartValues['items'] = cartData;
       // console.log(cartValues);
        setCartItems(cartValues)
        setCartTotal(total);

    }
    const showCartFxn = () => {
        //console.log('here')
        SetShowCart(true)
    }
    const hideCart = () => {
        // console.log('close')
        SetShowCart(false)
    }
    return (
        <li className="your_cart"> <Link to="#" onClick={() => { showCartFxn() }}  ><img src={cartIcon} alt="cart-icon" /> <span className="cart-number">({cartItemsVal && cartItemsVal['items'] ? cartItemsVal['items'].length : 0})</span></Link>
            <div className="miniaccount_details" style={{ "display": !showCart ? "none" : "block" }}>
                <div className="cart_your">Your cart</div>
                <Link to="#" className="cross_icn" onClick={() => { hideCart() }} > <i className="fas fa-times"></i></Link>
                <ul>
                    {cartItemsVal && cartItemsVal['items'] && cartItemsVal['items'].length ?
                        (
                            // <p></p>
                            cartItemsVal['items'].map((item, i) => {
                                return (
                                    <li key={i}>
                                        <Link to={'/product-details/' + item.sku}><span className="minicartprodt_img"><img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} className="imge-fluid" /></span>
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
                        <Link to="/checkout" className="btn btn-secondary" type="button">Checkout</Link>
                    </div>
                </div>
            </div>
        </li>
    )
}


const mapStateToProps = (state) => {
    // console.log(state.Cart.addToCartTask);
    return {
        items: state.Cart.addToCartTask
    }
}

export default connect(
    mapStateToProps,
    { addToCartTask }
)(MiniCart);