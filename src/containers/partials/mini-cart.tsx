import { useEffect, useState } from 'react';
import cartIcon from '../../image/carticon.svg';
import { Link } from "react-router-dom";
import { getCartItems, getCartTotal } from '../../redux/cart/productApi';
import { connect } from 'react-redux';

function MiniCart(props) {
    let customer_id = localStorage.getItem('cust_id');
    const [showCart, SetShowCart] = useState(false);
    const [cartItemsVal, setCartItems] = useState([{ id: '', item_id: 0, extension_attributes: { item_image: "" }, name: '', price: 0, quantity: 0, desc: '', qty: 0, sku: '' }]);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        if (props.items === true) {
           // console.log('herere')
            callGetCartItems()
        }
        callGetCartItems()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.items])

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
            let newCartData = [];
            if (cookieArray && cookieArray.length > 0) {
                newCartData = cookieArray.reduce((a, { sku, quantity }) => {
                    if (sku) {
                        a.push({ sku, qty: quantity, quote_id: localStorage.getItem('cartQuoteId') });
                    }
                    return a;
                }, []);
            }
            //  console.log(newCartData)
            // let obj = { cartItem: "" };
            // let cartObject = Object.assign(obj, { cartItem: newCartData });
            // cartData = [...cookieArray, ...simpleArray]

        } else {
            const data = localStorage.getItem('cartItems')
            total = parseInt(localStorage.getItem('cartTotal'));
            cartData = data ? JSON.parse(data) : [];
        }
        //console.log(cartData)
        setCartItems(cartData)
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
        <li className="your_cart"> <Link to="#" onClick={() => { showCartFxn() }}  ><img src={cartIcon} alt="cart-icon" /> <span className="cart-number">({cartItemsVal.length})</span></Link>
            <div className="miniaccount_details" style={{ "display": !showCart ? "none" : "block" }}>
                <div className="cart_your">Your cart</div>
                <Link to="#" className="cross_icn" onClick={() => { hideCart() }} > <i className="fas fa-times"></i></Link>
                <ul>
                    {cartItemsVal.length ?
                        (
                            // <p></p>
                            cartItemsVal.map((item, i) => {
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
                        <button className="btn btn-secondary" type="button">Checkout</button>
                    </div>
                </div>
            </div>
        </li>
    )
}


const mapStateToProps = (state) => {
    console.log(state.Cart.addToCartTask);
    return {
        items: state.Cart.addToCartTask
    }
}

export default connect(
    mapStateToProps,
    {}
)(MiniCart);