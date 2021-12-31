import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cartAction from "../../../../redux/cart/productAction";
import { getCookie } from "../../../../helpers/session";
import cardPlaceholder from '../../../../image/cards.png';
import appAction from "../../../../redux/app/actions";
import { addWhishlistBySku, getCartItems, getCartTotal, getGiftMessage, getGuestCart, getGuestCartTotal, getWhishlistItemsForUser, giftMessageDelete, removeItemFromCart, removeItemFromGuestCart, removeWhishlist, updateCartItem, updateGuestCartItem } from '../../../../redux/cart/productApi';
import notification from "../../../../components/notification";
import RelevantProducts from './relevantProducts';
import Modal from "react-bootstrap/Modal";
import GiftMessage from "../product-details/GiftMessage";
import IntlMessages from "../../../../components/utility/intlMessages";
import { siteConfig } from '../../../../settings';
import { formatprice } from '../../../../components/utility/allutils';
import { useIntl } from 'react-intl';
const { openGiftBoxes, addToCartTask, addToWishlistTask } = cartAction;
const { showSignin } = appAction;
function CartItemPage(props) {
    const intl = useIntl();
    const language = getCookie('currentLanguage');
    const [token, setToken] = useState('');
    const [isShow, setIsShow] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [isWishlist, setIsWishlist] = useState(0);
    const [value, setValue] = useState(0);
    const [qty, setQty] = useState(0);
    const [prodId, setProdId] = useState('');
    const [cartItemsVal, setCartItems] = useState({});
    const [opacity, setOpacity] = useState(1);
    const [cartTotals, setCartTotal] = useState({});
    const [cartRelevants, setCartRelevants] = useState({});
    const [isGiftMessage, setIsGiftMessage] = useState(false);
    const [delGiftMsg, setDelGiftMsg] = useState(0);

    useEffect(() => {
        const header = document.getElementById("cartsidebar");
        const sticky = header.offsetTop;
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky-sidebar-cart");
            } else {
                header.classList.remove("sticky-sidebar-cart");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, [])

    useEffect(() => {
        //  console.log(props)
        const localToken = props.token.token;
        setToken(localToken)
        if (props.cart || !props.cart) {
            callGetCartItems()
        }
        return () => {
            props.addToCartTask(false);
            props.openGiftBoxes(0);
        }
    }, [props.languages, props.cart, props.token])

    useEffect(() => {
        // console.log(props.items.Cart);
        let giftBox = props.giftCart.Cart.openGiftBox === 0 ? false : true;
        // console.log(giftBox)
        setIsGiftMessage(giftBox)
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.giftCart.Cart]);

    async function getgidtMessageCall(items) {
        const promises = [];
        items.forEach(async (i) => {
            promises.push(new Promise((resolve, reject) => {
                const res = someAPICall(i);
                resolve(res);
            }));
        })
        const result = await Promise.all(promises);
        return result;
    }

    async function someAPICall(product) {
        let giftCall: any = await getGiftMessage(product.item_id);
        //    console.log(giftCall.data)
        let prod: any;
        if (giftCall.data && giftCall.data.gift_message_id) {
            prod = { ...product, isGift: true, gift_message_id: giftCall.data.gift_message_id }
        } else {
            prod = { ...product, isGift: false }
        }
        return prod;
    }



    const callGetCartItems = async () => {
        setOpacity(0.3);
        let cartData = [], cartItems: any, cartTotal: any;
        let customer_id = props.token.cust_id;
        const cartQuoteId = localStorage.getItem('cartQuoteId');
        if (customer_id && cartQuoteId) {
            cartItems = await getCartItems(props.languages);
            let products = cartItems.data.items;
            // get cart total 
            cartTotal = await getCartTotal();
            let whishlist: any = await getWhishlistItemsForUser();
            let WhishlistData = whishlist.data;
            let productNew = await getgidtMessageCall(products)
            // console.log(productNew)

            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (item.sku === itm.sku) && item),
                    ...itm
                }));

            cartData = mergeById(productNew, WhishlistData);
            //console.log(cartData)
        } else {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart(props.languages);
                let products = cartItems.data.items;
                cartData = await getgidtMessageCall(products)
                cartTotal = await getGuestCartTotal();

            }
        }

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
            setOpacity(1);
        } else {
            setOpacity(1);
        }
    }

    async function handleRemove(item_id) {
        setIsShow(item_id)
        let customer_id = props.token.cust_id;
        let deleteCartItem: any
        if (customer_id) {
            deleteCartItem = await removeItemFromCart(item_id);
        } else {
            deleteCartItem = await removeItemFromGuestCart(item_id);
        }
        if (deleteCartItem.data === true) {
            props.addToCartTask(true);
            callGetCartItems()
            notification("success", "", intl.formatMessage({ id: "removedcart" }));
        } else {
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            setIsShow(0)
        }
    }
    //to add the quantity
    async function handleAddQuantity(data) {
        // console.log(data)
        setValue(data.item_id);
        setQty(data.qty + 1);
        let customer_id = props.token.cust_id;
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
        notification("success", "", intl.formatMessage({ id: "cartupdated" }));
    }

    async function handleChangeQty(e, data) {
        setValue(data.item_id);
        let value = parseInt(e.target.value);
        setQty(value);
        console.log(value)
        let customer_id = props.token.cust_id;
        let cartData = {
            "cartItem": {
                "sku": data.sku,
                "qty": value,
                "quote_id": localStorage.getItem('cartQuoteId')
            }
        }
        if (customer_id) {
            if (value === 0) {
                await removeItemFromCart(data.item_id);

            } else {
                await updateCartItem(data.item_id, cartData);
            }
        } else {
            if (value === 0) {
                await removeItemFromGuestCart(data.item_id);

            } else {
                await updateGuestCartItem(data.item_id, cartData);
            }
        }
        callGetCartItems()
        props.addToCartTask(true);
        notification("success", "", intl.formatMessage({ id: "cartupdated" }));
    }
    //to substruct from the quantity
    async function handleSubtractQuantity(data) {
        setValue(data.item_id);
        setQty(data.qty - 1);
        let customer_id = props.token.cust_id;
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
        notification("success", "", intl.formatMessage({ id: "cartupdated" }));
    }
    async function handleWhishlist(sku: any) {
        if (token) {
            setIsWishlist(sku)
            let result: any = await addWhishlistBySku(sku);
            if (result.data[0].message) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", result.data[0].message);
                callGetCartItems()
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                callGetCartItems()
            }
        } else {
            props.showSignin(true);
        }

    }


    async function handleDelWhishlist(id: number) {
        setDelWishlist(id)
        let del: any = await removeWhishlist(id);
        if (del.data[0].message) {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("success", "", del.data[0].message);
            callGetCartItems()
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            callGetCartItems()
        }
    }
    const handleGiftMEssage = (pId) => {
        // console.log(pId)
        setProdId(pId)
        props.openGiftBoxes(pId);
        setIsGiftMessage(true)
    }
    const handleGiftRemove = async (giftId, itemId) => {
        setDelGiftMsg(itemId)
        let lang = props.languages ? props.languages : language;
        let result: any = await giftMessageDelete(giftId, itemId, lang);
        if (result.data) {
            setDelGiftMsg(0)
            callGetCartItems()
            notification("success", "", intl.formatMessage({ id: "giftmessagedeleted" }));
        } else {
            setDelGiftMsg(0)
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }

        // console.log(result);
    }
    const hideGiftModalModal = () => {
        props.openGiftBoxes(0);
        setIsGiftMessage(false)
    }
    return (
        <main>

            <section className="cart-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="back-block">
                                <i className="fas fa-chevron-left back-icon"></i>
                                <Link className="back-to-shop" to="/products" ><IntlMessages id="cart-back-link" /></Link>
                            </div>
                            <div className="my-cart-left-sec" style={{ 'opacity': opacity }}>
                                <h2><IntlMessages id="cart.Title" /></h2>
                                {opacity === 0.3 && (
                                    <div className="checkout-loading" >
                                        <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                                    </div>
                                )}
                                {cartItemsVal['items'] && cartItemsVal['items'].length ?
                                    (
                                        <ul className="cart-pro-list">
                                            {cartItemsVal['items'].map((item, i) => {
                                                // console.log(item)
                                                return (
                                                    <div key={i}>
                                                        <li>
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <div className="product-image">
                                                                        <Link to={'/product-details/' + item.sku}> <img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} /></Link>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <div className="pro-name-tag">
                                                                        <div className="cart-info-l">
                                                                            {item.extension_attributes.brand && (<div className="product_name"><Link to={'/search/' + item.extension_attributes.brand}>{item.extension_attributes.brand}</Link></div>
                                                                            )}
                                                                            <div className="product_vrity"><Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                                        </div>
                                                                        <div className="cart-info-r">
                                                                            <p>{item.desc}</p>
                                                                            <span className="off bg-favorite">
                                                                                {!item.wishlist_item_id && (
                                                                                    <Link to="#" onClick={() => { handleWhishlist(item['sku']) }} className="float-end text-end">{isWishlist === item['sku'] ? "Adding....." : <IntlMessages id="cart.addWishlist" />}</Link>
                                                                                )}
                                                                                {item.wishlist_item_id && (
                                                                                    <Link to="#" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} className="float-end text-end">{delWishlist === parseInt(item.wishlist_item_id) ? "Removing....." : <IntlMessages id="cart.removeWishlist" />}</Link>
                                                                                )}
                                                                            </span>
                                                                        </div>



                                                                        <div className="clearfix"></div>
                                                                    </div>
                                                                    <div className="qty-size">
                                                                        <div className="row mb-3">
                                                                            <label htmlFor="inputQty" className="col-sm-2 col-form-label"><IntlMessages id="cart.qty" /></label>
                                                                            <div className="col-sm-5 cartschanger">
                                                                                {/* {console.log(item.qty)} */}
                                                                                <select defaultValue={value === item.item_id ? qty : item.qty} className="form-select" onChange={(e) => { handleChangeQty(e, item) }}>
                                                                                    {Array.from(Array(item.qty + 10), (e, i) => {
                                                                                        return <option value={i}
                                                                                            key={i}>{i}</option>
                                                                                    })}

                                                                                </select>
                                                                                {/* <div className="value-button" id="decrease" onClick={() => { handleSubtractQuantity(item) }} >-</div>
                                                                                <input type="number" id="number" disabled value={value === item.item_id ? qty : item.qty} />
                                                                                <div className="value-button" id="increase" onClick={() => { handleAddQuantity(item) }}>+</div> */}
                                                                            </div>
                                                                            {/* <div className="col-sm-5">
                                                                            <select className="form-select">
                                                                                <option>One size</option>
                                                                                <option>Two size</option>
                                                                            </select>
                                                                        </div> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="cart-pro-price">{siteConfig.currency}{formatprice(item.price)} </div>
                                                                    <div className="pro-remove-tag"  >
                                                                        {/* <p className="float-start">Ready tp ship to the contiguous SA in 1-14 days</p> */}
                                                                        <Link to="#" onClick={() => { handleRemove(item.item_id) }} className="float-end text-end" >{isShow === item.item_id ? "Removing....." : <IntlMessages id="cart.remove" />}</Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <div className="save-cart-btns">
                                                            {item.isGift ?
                                                                delGiftMsg === item.item_id ? <Link to="#" ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                                    <Link to="#" onClick={() => { handleGiftRemove(item.gift_message_id, item.item_id) }}  ><IntlMessages id="cart.removeGift" /></Link>

                                                                : <Link to="#" onClick={() => {
                                                                    handleGiftMEssage(item.item_id);
                                                                }}><IntlMessages id="cart.addGift" /> </Link>}


                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </ul>) : (
                                        <p><IntlMessages id="cart.cartEmpty" /></p>
                                    )}

                                {token && (<RelevantProducts cartItem={cartRelevants} />)}
                            </div>
                        </div>
                        <div className="col-md-4" id="cartsidebar">
                            <div className="order-detail-sec">
                                <h5><IntlMessages id="orderDetail" /> </h5>

                                <div className="cart-total-price">
                                    <p><IntlMessages id="subTotal" /><span className="text-end">{siteConfig.currency}{cartTotals['sub_total'] ? formatprice(cartTotals['sub_total']) : 0} </span></p>
                                    <p><IntlMessages id="shipping" /><span className="text-end"> {siteConfig.currency} {cartTotals['shipping_charges'] ? formatprice(cartTotals['shipping_charges']) : 0}</span></p>
                                    <p><IntlMessages id="tax" /><span className="text-end">{siteConfig.currency} {cartTotals['tax'] ? formatprice(cartTotals['tax']) : 0} </span></p>
                                    <hr />
                                    {cartItemsVal['items'] && cartItemsVal['items'].length ? (<Link to="/checkout"><IntlMessages id="checkout" /></Link>) : ''}
                                </div>
                                <div className="we-accept">
                                    <p><strong><IntlMessages id="we-accept" />:</strong></p>
                                    <img src={cardPlaceholder} alt="cards" />
                                    <p><IntlMessages id="coupontitle" /></p>
                                </div>

                            </div>
                            <div className="qus-contactUs">
                                <p><IntlMessages id="questionCart" /></p>
                                <Link to="/contact-us"><IntlMessages id="menu_contactnew" /> </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={isGiftMessage} className="giftmessagebox" size="lg" data={prodId} onHide={hideGiftModalModal} >
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
    // console.log(state.session)
    return {
        items: state.Cart.addedItems,
        giftCart: state,
        cart: state.Cart.addToCartTask,
        token: state.session.user,
        languages: state.LanguageSwitcher.language,
    }
}
export default connect(
    mapStateToProps,
    { openGiftBoxes, addToCartTask, addToWishlistTask, showSignin }
)(CartItemPage);