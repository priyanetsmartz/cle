import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cartAction from "../../../redux/cart/productAction";
import { getCartItems, getCartTotal, getGuestCart, getGuestCartTotal, removeItemFromCart, removeItemFromGuestCart, updateCartItem, updateGuestCartItem } from '../../../redux/cart/productApi';
// import { getCookie } from "../../../helpers/session";
import notification from "../../../components/notification";
const { addToCartTask } = cartAction;

function CartItemPage(props) {

    const [cartItemsVal, setCartItems] = useState([{ id: '', item_id: 0, extension_attributes: { item_image: "" }, name: '', price: 0, quantity: 0, desc: '', qty: 0, sku: '' }]);
    const [cartTotal, setCartTotal] = useState(0);
    useEffect(() => {
        callGetCartItems()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])

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

        setCartItems(cartData)
        setCartTotal(total);
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

    return (
        <div className="container" >
            <div className="row">
                {cartItemsVal.length ?
                    (
                        // <p></p>
                        cartItemsVal.map(item => {
                            return (

                                <li className="col-md-4" key={item.sku}>
                                    <div className="item-img">
                                        <img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} />
                                    </div>
                                    <div className="item-desc">
                                        <span className="title">{item.name}</span>
                                        <p>{item.desc}</p>
                                        <p><b>Price: {item.price}$</b></p>
                                        <p>
                                            <b>Quantity: {item.quantity ? item.quantity : item.qty}</b>
                                        </p>
                                        <div className="add-remove">
                                            <Link to="#"><i className="material-icons" onClick={() => { handleAddQuantity(item) }}><i className="fa fa-angle-up" aria-hidden="true"></i></i></Link>
                                            <Link to="#"><i className="material-icons" onClick={() => { handleSubtractQuantity(item) }}><i className="fa fa-angle-down" aria-hidden="true"></i></i></Link>
                                        </div>
                                        <button className="waves-effect waves-light btn pink remove" onClick={() => { handleRemove(item.item_id) }}><i className="fa fa-times" aria-hidden="true"></i></button>
                                    </div>
                                </li>
                            )
                        })
                    ) :

                    (
                        <p>Cart is Empty.</p>
                    )
                }
                {cartTotal ? cartTotal : ""}
            </div>
        </div>
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