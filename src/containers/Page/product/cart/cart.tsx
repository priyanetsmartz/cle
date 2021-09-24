import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cartAction from "../../../../redux/cart/productAction";
import { addWhishlist, addWhishlistBySku, getCartItems, getCartTotal, getGuestCart, getGuestCartTotal, getWhishlistItemsForUser, removeItemFromCart, removeItemFromGuestCart, removeWhishlist, updateCartItem, updateGuestCartItem } from '../../../../redux/cart/productApi';
import notification from "../../../../components/notification";
import RelevantProducts from './relevantProducts';
import Modal from "react-bootstrap/Modal";
import GiftMessage from "../product-details/GiftMessage";
import IntlMessages from "../../../../components/utility/intlMessages";
const { openGiftBoxes, addToCartTask } = cartAction;

function CartItemPage(props) {
    const [token, setToken] = useState('');
    const [isShow, setIsShow] = useState(0);
    const [isWishlist, setIsWishlist] = useState(0);
    const [value, setValue] = useState(0);
    const [prodId, setProdId] = useState('');
    const [cartItemsVal, setCartItems] = useState({});
    const [cartTotals, setCartTotal] = useState({});
    const [cartRelevants, setCartRelevants] = useState({});
    const [isGiftMessage, setIsGiftMessage] = useState(false);
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
            let products = cartItems.data.items;
            // get cart total 
            cartTotal = await getCartTotal();
            let whishlist: any = await getWhishlistItemsForUser();
            // let products = result.data.items;
            let WhishlistData = whishlist.data;
            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                    ...itm
                }));

            cartData = mergeById(products, WhishlistData);
        } else {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart();
                cartData = cartItems.data.items;
                cartTotal = await getGuestCartTotal();

            }
        }
        console.log(cartData)
        let cartPrices = {}, cartValues = {}, cartRelevant = {}
        if (cartTotal) {
            cartPrices['discount'] = cartTotal.data.base_discount_amount;
            cartPrices['sub_total'] = cartTotal.data.base_subtotal;
            cartPrices['shipping_charges'] = cartTotal.data.base_shipping_amount;
            cartPrices['total'] = cartTotal.data.base_grand_total;
            cartPrices['tax'] = cartTotal.data.base_tax_amount;
            cartValues['items'] = cartData;
            cartRelevant = cartValues['items'].length ? cartValues['items'][0].item_id : 0;
            //console.log(cartRelevant)
            setCartRelevants(cartRelevant);
            setCartItems(cartValues)
            setCartTotal(cartPrices);
        }
    }

    async function handleRemove(item_id) {
        setIsShow(item_id)
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
            notification("success", "", "Item removed from cart!");
        } else {
            notification("error", "", "Something went wrong!");
            setIsShow(0)
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
    async function handleWhishlist(sku: any) {
        setIsWishlist(sku)
        let result: any = await addWhishlistBySku(sku);
        if (result.data[0].message) {
            setIsWishlist(0)
            notification("success", "", result.data[0].message);
            callGetCartItems()
        } else {
            setIsWishlist(0)
            notification("error", "", "Something went wrong!");
            callGetCartItems()
        }

    }
    async function handleDelWhishlist(id: number) {
        let del: any = await removeWhishlist(id);
        notification("success", "", del.data[0].message);
        callGetCartItems()
    }

    const handleGiftMEssage = (pId) => {
        console.log(pId)
        setProdId(pId)
        props.openGiftBoxes(prodId);
        setIsGiftMessage(true)
    }
    const hideGiftModalModal = () => {
        setIsGiftMessage(false)
    }
    return (
        <main>
            <section className="cart-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="my-cart-left-sec">
                                <h2><IntlMessages id="cart.Title" /></h2>
                                <div className="save-cart-btns">
                                    <Link to="#"><IntlMessages id="cart.saveCart" /></Link>
                                    <Link to="#"><IntlMessages id="cart.savedCart" /> </Link>
                                </div>
                                {cartItemsVal['items'] && cartItemsVal['items'].length ?
                                    (
                                        <ul className="cart-pro-list">
                                            {cartItemsVal['items'].map((item, i) => {
                                                console.log(item)
                                                return (
                                                    <div key={i}>
                                                        <li >
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <div className="product-image">
                                                                        <Link to={'/product-details/' + item.sku}> <img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} /></Link>
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
                                                                                    <Link to="#" onClick={() => { handleWhishlist(item['sku']) }} className="float-end text-end">{isWishlist === item['sku'] ? "Adding....." : <IntlMessages id="cart.addWishlist" />}</Link>
                                                                                )}
                                                                                {item.wishlist_item_id && (
                                                                                    <Link to="#" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} className="float-end text-end"><IntlMessages id="cart.removeWishlist" /></Link>
                                                                                )}
                                                                            </span>
                                                                        )
                                                                        }
                                                                        <div className="clearfix"></div>
                                                                    </div>
                                                                    <div className="qty-size">
                                                                        <div className="row mb-3">
                                                                            <label htmlFor="inputQty" className="col-sm-2 col-form-label"><IntlMessages id="cart.qty" /></label>
                                                                            <div className="col-sm-5 cartschanger">
                                                                                <div className="value-button" id="decrease" onClick={() => { handleSubtractQuantity(item) }} >-</div>
                                                                                <input type="number" id="number" disabled value={item.qty} />
                                                                                <div className="value-button" id="increase" onClick={() => { handleAddQuantity(item) }}>+</div>
                                                                            </div>
                                                                            {/* <div className="col-sm-5">
                                                                            <select className="form-select">
                                                                                <option>One size</option>
                                                                                <option>Two size</option>
                                                                            </select>
                                                                        </div> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="cart-pro-price">${item.price}</div>
                                                                    <div className="pro-name-tag"  >
                                                                        {/* <p className="float-start">Ready tp ship to the contiguous SA in 1-14 days</p> */}
                                                                        <Link to="#" onClick={() => { handleRemove(item.item_id) }} className="float-end text-end" >{isShow === item.item_id ? "Removing....." : <IntlMessages id="cart.remove" />}</Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <div className="save-cart-btns">
                                                            <Link to="#" onClick={() => {
                                                                handleGiftMEssage(item['id']);
                                                            }}><IntlMessages id="cart.addGift" /> </Link>
                                                            <Link to="#" className=""><IntlMessages id="cart.removeGift" /></Link>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </ul>) :

                                    (
                                        <p><IntlMessages id="cart.cartEmpty" /></p>
                                    )}

                                {token && (<RelevantProducts cartItem={cartRelevants} />)}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="order-detail-sec">
                                <h5><IntlMessages id="orderDetail" /> </h5>

                                <div className="cart-total-price">
                                    <p><IntlMessages id="subTotal" /><span className="text-end">${cartTotals['sub_total'] ? cartTotals['sub_total'] : 0}</span></p>
                                    <p><IntlMessages id="shipping" /><span className="text-end">${cartTotals['shipping_charges'] ? cartTotals['shipping_charges'] : 0}</span></p>
                                    <p><IntlMessages id="tax" /><span className="text-end">${cartTotals['tax'] ? cartTotals['tax'] : 0}</span></p>
                                    <hr />
                                    <Link to="/checkout"><IntlMessages id="checkout" /></Link>
                                </div>
                                <div className="we-accept">
                                    <p><strong><IntlMessages id="we-accept" />:</strong></p>
                                    <img src="" alt="cards" />
                                    <p><IntlMessages id="coupontitle" /></p>
                                </div>

                            </div>
                            <div className="qus-contactUs">
                                <p><IntlMessages id="questionCart" /></p>
                                <Link to="/contact-us"><IntlMessages id="menu_contact" /> </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={isGiftMessage} size="lg" data={prodId} >
                <Modal.Header>
                    <h5 className="modal-title"><IntlMessages id="gift.title" /></h5>
                    <div><IntlMessages id="gift.subTitle" /> </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideGiftModalModal} aria-label="Close"></button>
                </Modal.Header>
                <GiftMessage />
            </Modal>
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
    { openGiftBoxes, addToCartTask }
)(CartItemPage);