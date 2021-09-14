import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cartAction from "../../../redux/cart/productAction";
import { addToCartApi, getCartItems, getCartTotal, removeItemFromCart, updateCartItem } from '../../../redux/cart/productApi';
// import { getCookie } from "../../../helpers/session";
import notification from "../../../components/notification";
const { removeItem, addQuantity, subtractQuantity } = cartAction;

function CartItemPage(props) {
    let customer_id = localStorage.getItem('cust_id');
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
        let cartData = [], total = 0;

        if (customer_id) {
            let cartItems: any = await getCartItems();
            cartData = cartItems.data.items;
            let cookieData = localStorage.getItem('cartItems');
            let cookieArray = JSON.parse(cookieData);

            // get cart total 
            let cartTotal: any = await getCartTotal();
            total = cartTotal.data.grand_total;
            //console.log(total)
            // console.log(cookieArray)
            // console.log(magentoCart);

            let newCartData = [];
            if (cookieArray && cookieArray.length > 0) {
                newCartData = cookieArray.reduce((a, { sku, quantity }) => {
                    if (sku) {
                        a.push({ sku, qty: quantity, quote_id: localStorage.getItem('cartQuoteId') });
                    }
                    return a;
                }, []);
            }
            console.log(newCartData)
            let obj = { cartItem: "" };
            let cartObject = Object.assign(obj, { cartItem: newCartData });
            //   console.log(cartObject)
            //  console.log(Object.assign({}, newCartData))
            //  addToCartApi(cartObject)
            // let simpleArray = magentoCart.filter(v => !(cookieArray.some(e => e.sku === v.sku)));
            // cartData = [...cookieArray, ...simpleArray]

        } else {
            const data = localStorage.getItem('cartItems')
            total = parseInt(localStorage.getItem('cartTotal'));
            cartData = data ? JSON.parse(data) : [];
        }

        setCartItems(cartData)
        setCartTotal(total);

    }
    async function handleRemove(id, item_id) {
        // props.removeItem(id);
        if (customer_id) {
            let deleteCartItem: any = await removeItemFromCart(item_id);
            if (deleteCartItem.data === true) {
                callGetCartItems()
            }
        } else {
            let itemToRemove = cartItemsVal.find(item => id === item.id)
            let new_items = cartItemsVal.filter(item => id !== item.id);
            //calculating the total
            let newTotal = cartTotal - (itemToRemove.price * itemToRemove.quantity)
            localStorage.setItem('cartItems', JSON.stringify(new_items));
            localStorage.setItem('cartTotal', JSON.stringify(newTotal));
            setCartItems(new_items);
            setCartTotal(newTotal);
        }

    }
    //to add the quantity
    async function handleAddQuantity(data) {

        if (customer_id) {
            let cartData = {
                "cartItem": {
                    "sku": data.sku,
                    "qty": data.qty + 1,
                    "quote_id": localStorage.getItem('cartQuoteId')
                }
            }

            await updateCartItem(data.item_id, cartData);
            callGetCartItems()
            notification("success", "", "Cart Updated");
        } else {
            //props.addQuantity(id);
            let addedItem = cartItemsVal.find(item => item.id === data.id)
            addedItem.quantity += 1;
            var foundIndex = cartItemsVal.findIndex(x => x.id === data.id);
            cartItemsVal[foundIndex] = addedItem;

            let newTotal = cartTotal + addedItem.price;
            setCartTotal(newTotal);
            localStorage.setItem('cartItems', JSON.stringify(cartItemsVal));
            localStorage.setItem('cartTotal', JSON.stringify(newTotal));
        }
    }

    //to substruct from the quantity
    async function handleSubtractQuantity(data) {
        if (customer_id) {
            let cartData = {
                "cartItem": {
                    "sku": data.sku,
                    "qty": data.qty - 1,
                    "quote_id": localStorage.getItem('cartQuoteId')
                }
            }
            if (data.qty === 1) {
                await removeItemFromCart(data.item_id);

            } else {
                await updateCartItem(data.item_id, cartData);
            }
            callGetCartItems()
            notification("success", "", "Cart Updated");
        } else {
            let addedItem = cartItemsVal.find(item => item.id === data.id)
            //if the qt == 0 then it should be removed
            if (addedItem.quantity === 1) {
                let new_items = cartItemsVal.filter(item => item.id !== data.id)
                let newTotal = cartTotal - addedItem.price;
                setCartItems(new_items);
                setCartTotal(newTotal);
                localStorage.setItem('cartItems', JSON.stringify(new_items));
                localStorage.setItem('cartTotal', JSON.stringify(newTotal));
            } else {
                addedItem.quantity -= 1
                var foundIndex = cartItemsVal.findIndex(x => x.id === data.id);
                cartItemsVal[foundIndex] = addedItem;
                let newTotal = cartTotal - addedItem.price
                setCartTotal(newTotal);
                localStorage.setItem('cartItems', JSON.stringify(cartItemsVal));
                localStorage.setItem('cartTotal', JSON.stringify(newTotal));
            }
        }
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
                                        <button className="waves-effect waves-light btn pink remove" onClick={() => { handleRemove(item.id, item.item_id) }}><i className="fa fa-times" aria-hidden="true"></i></button>
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
const mapDispatchToProps = (dispatch) => {
    return {
        removeItem: (id) => { dispatch(removeItem(id)) },
        addQuantity: (id) => { dispatch(addQuantity(id)) },
        subtractQuantity: (id) => { dispatch(subtractQuantity(id)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItemPage)