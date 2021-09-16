import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cartAction from "../../../../redux/cart/productAction";
import { addWhishlist, getCartItems, getCartTotal, getGuestCart, getGuestCartTotal, removeItemFromCart, removeItemFromGuestCart, removeWhishlist, updateCartItem, updateGuestCartItem } from '../../../../redux/cart/productApi';
import notification from "../../../../components/notification";
const { addToCartTask } = cartAction;

function CartItemPage(props) {
    const [token, setToken] = useState('');
    const [cartItemsVal, setCartItems] = useState({});
    const [cartTotals, setCartTotal] = useState({});
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        callGetCartItems()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])

    const callGetCartItems = async () => {
        let cartData = [], cartItems: any, cartTotal: any;
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            cartItems = await getCartItems();
            cartData = cartItems.data.items;
            // get cart total 
            cartTotal = await getCartTotal();

        } else {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart();
                cartData = cartItems.data.items;
                cartTotal = await getGuestCartTotal();

            }
        }
        console.log(cartData)
        let cartPrices = {}
        cartPrices['discount'] = cartTotal.data.base_discount_amount;
        cartPrices['sub_total'] = cartTotal.data.base_subtotal;
        cartPrices['shipping_charges'] = cartTotal.data.base_shipping_amount;
        cartPrices['total'] = cartTotal.data.base_grand_total;
        cartPrices['tax'] = cartTotal.data.base_tax_amount;
        let cartValues = {};
        cartValues['items'] = cartData;
        setCartItems(cartValues)
        setCartTotal(cartPrices);
        // console.log(cartItemsVal)

    }

    async function handleRemove(item_id) {
        let customer_id = localStorage.getItem('cust_id');
        let deleteCartItem: any
        if (customer_id) {
            deleteCartItem = await removeItemFromCart(item_id);

        } else {
            deleteCartItem = await removeItemFromGuestCart(item_id);

        }
        if (deleteCartItem.data === true) {
            props.addToCartTask(true);
            callGetCartItems()
        }
    }
    //to add the quantity
    async function handleAddQuantity(data) {
        let customer_id = localStorage.getItem('cust_id');
        let cartData = {
            "cartItem": {
                "sku": data.sku,
                "qty": data.qty + 1,
                "quote_id": localStorage.getItem('cartQuoteId')
            }
        }
        if (customer_id) {
            await updateCartItem(data.item_id, cartData);
        } else {
            await updateGuestCartItem(data.item_id, cartData);
        }

        callGetCartItems()
        props.addToCartTask(true);
        notification("success", "", "Cart Updated");
    }

    //to substruct from the quantity
    async function handleSubtractQuantity(data) {
        let customer_id = localStorage.getItem('cust_id');
        let cartData = {
            "cartItem": {
                "sku": data.sku,
                "qty": data.qty - 1,
                "quote_id": localStorage.getItem('cartQuoteId')
            }
        }
        if (customer_id) {
            if (data.qty === 1) {
                await removeItemFromCart(data.item_id);

            } else {
                await updateCartItem(data.item_id, cartData);
            }
        } else {
            if (data.qty === 1) {
                await removeItemFromGuestCart(data.item_id);

            } else {
                await updateGuestCartItem(data.item_id, cartData);
            }
        }


        callGetCartItems()
        props.addToCartTask(true);
        notification("success", "", "Cart Updated");
    }
    async function handleWhishlist(id: number) {
        console.log(id)
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        callGetCartItems()

    }
    async function handleDelWhishlist(id: number) {
        let del: any = await removeWhishlist(id);
        notification("success", "", del.data[0].message);
        callGetCartItems()
    }

    return (
        <main>
            <section className="cart-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="my-cart-left-sec">
                                <h2>My Cart</h2>
                                <div className="save-cart-btns">
                                    <Link to="#">Saved cart</Link>
                                    <Link to="#">Save cart for later</Link>
                                </div>
                                {cartItemsVal['items'] && cartItemsVal['items'].length ?
                                    (
                                        <ul className="cart-pro-list">
                                            {cartItemsVal['items'].map((item, i) => {
                                                return (
                                                    <li key={i}>
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="product-image">
                                                                    <img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <div className="pro-name-tag">
                                                                    <div className="float-start">
                                                                        <p><strong>{item.name}</strong></p>
                                                                        <p>{item.desc}</p>
                                                                    </div>
                                                                    {token && (
                                                                        <span className="off bg-favorite">
                                                                            {!item.wishlist_item_id && (
                                                                                <Link to="#" onClick={() => { handleWhishlist(item['id']) }} className="float-end text-end">Add to wishlist</Link>
                                                                            )}
                                                                            {item.wishlist_item_id && (
                                                                                <Link to="#" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} className="float-end text-end">Remove from wishlist</Link>
                                                                            )}
                                                                        </span>
                                                                    )
                                                                    }
                                                                    <div className="clearfix"></div>
                                                                </div>
                                                                <div className="qty-size">
                                                                    <div className="row mb-3">
                                                                        <label htmlFor="inputQty" className="col-sm-2 col-form-label">Qty</label>
                                                                        <div className="col-sm-5 cartschanger">
                                                                            <div className="value-button" id="decrease" onClick={() => { handleSubtractQuantity(item) }} >-</div>
                                                                            <input type="number" id="number" value={item.qty} />
                                                                            <div className="value-button" id="increase" onClick={() => { handleAddQuantity(item) }}>+</div>
                                                                        </div>
                                                                        <div className="col-sm-5">
                                                                            <select className="form-select">
                                                                                <option>One size</option>
                                                                                <option>Two size</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="cart-pro-price">${item.price}</div>
                                                                <div className="pro-name-tag">
                                                                    <p className="float-start">Ready tp ship to the contiguous SA in 1-14 days</p>
                                                                    <Link to="#" onClick={() => { handleRemove(item.item_id) }} className="float-end text-end" >Remove</Link>
                                                                    <div className="clearfix"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>) :

                                    (
                                        <p>Cart is Empty.</p>
                                    )}
                                < div className="save-cart-btns">
                                    <Link to="#">Add gift receipt</Link>
                                    <Link to="#" className="">Remove gift receipt</Link>
                                </div>
                                <div className="also-like">
                                    <h2>You may also like</h2>
                                    <div className="also-like-products"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="order-detail-sec">
                                <h5>Order Details</h5>

                                <div className="cart-total-price">
                                    <p>Sub Total<span className="text-end">${cartTotals['sub_total'] ? cartTotals['sub_total'] : 0}</span></p>
                                    <p>Shipping<span className="text-end">${cartTotals['shipping_charges'] ? cartTotals['shipping_charges'] : 0}</span></p>
                                    <p>Tax<span className="text-end">${cartTotals['tax'] ? cartTotals['tax'] : 0}</span></p>
                                    <hr />
                                    <Link to="/checkout">Proceed to checkout</Link>
                                </div>
                                <div className="we-accept">
                                    <p><strong>We accept:</strong></p>
                                    <img src="" alt="cards" />
                                    <p>Got a discount code? Add it in the next step.</p>
                                </div>

                            </div>
                            <div className="qus-contactUs">
                                <p>Questions? We're here to help!</p>
                                <Link to="/contact-us">Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main >
    )
}


const mapStateToProps = (state) => {
    //   console.log(state)
    return {
        items: state.Cart.addedItems
    }
}
export default connect(
    mapStateToProps,
    { addToCartTask }
)(CartItemPage);