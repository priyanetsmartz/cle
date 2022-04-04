import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useHistory } from "react-router";
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
import { checkVendorLoginWishlist, formatprice } from '../../../../components/utility/allutils';
import { useIntl } from 'react-intl';
import { useLastLocation } from 'react-router-last-location';
import LoaderGif from '../../Loader';


const { openGiftBoxes, addToCartTask, addToWishlistTask } = cartAction;
const { showSignin } = appAction;
function CartItemPage(props) {
    const intl = useIntl();
    let history = useHistory();
    const lastLocation = useLastLocation();
    let path = lastLocation?.pathname ? lastLocation?.pathname : "/";
    const [shopPath, setShopPath] = useState(path);
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
    const [stockQty, setStockQty] = useState(0);
    const [validQtyItem, setValidQty] = useState(0);
    useEffect(() => {
        setShopPath(path);
        if (document.getElementById("cartsidebar")) {
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
        }
    }, [])

    useEffect(() => {
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
        let giftBox = props.giftCart.Cart.openGiftBox === 0 ? false : true;
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
            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (item.sku === itm.sku) && item),
                    ...itm
                }));

            cartData = mergeById(productNew, WhishlistData);
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
            setCartRelevants(cartRelevant);
            setCartItems(cartValues)
            setCartTotal(cartPrices);
            // check if selected quantity is available
            if(cartValues && cartValues['items']){
                cartValues['items'].map(item=>{
                    item['qtyErrorUI']="";
                    setValidQty(item.qty)
                    if(item.pending_inventory_source){
                        item.pending_inventory_source.map(stock=>{
                            if(stock.stock_name === "Vendors Stock"){
                                if(item.qty>stock.qty){
                                    setValidQty(stock.qty)
                                    item.qty = stock.qty
                                    item['qtyErrorUI']=(intl.formatMessage({id:"reducedquantityCart"}))
                                }
                                else{item['qtyErrorUI'] = ""}
                            }
                        })
                    }

                })
            }
            setOpacity(1);
        } else {
            setOpacity(1);
        }
    }

    async function handleRemove(item_id, wishlistAction = '') {
        setIsShow(item_id)
        let customer_id = props.token.cust_id;
        let deleteCartItem: any
        if (customer_id) {
            deleteCartItem = await removeItemFromCart(item_id);
        } else {
            deleteCartItem = await removeItemFromGuestCart(item_id);
        }
        if (deleteCartItem.data === true) {
            callGetCartItems()
            props.addToCartTask(true);
            if (wishlistAction === 'whishlist') {
                history.push("/customer/wishlist");
            } else {

                notification("success", "", intl.formatMessage({ id: "removedcart" }));
            }

        } else {
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            setIsShow(0)
        }
    }

    async function handleChangeQty(e, data) {
        let validQty =false ;
        let avalQty;
        if(data){
            data['qtyErrorUI'] = ""
        }
        if(data && data.pending_inventory_source){
        data.pending_inventory_source.map(stock=>{
            if(stock.stock_name === "Vendors Stock"){
                if (e.target.value<=stock.qty){
                    validQty = true;
                }
                avalQty = stock.qty
                setStockQty(stock.qty);
            }
        })}
        else{
            if(data.extension_attributes){
                if(data.extension_attributes['vendor_stock'] && data.extension_attributes['vendor_stock'].length>0){
                    data.extension_attributes['vendor_stock'].map(item=>{
                        let stock = JSON.parse(item)
                        if(stock.stock_name === "Vendors Stock"){
                            if (e.target.value<=stock.qty){
                                validQty = true;
                            }
                            avalQty = stock.qty;
                            setStockQty(stock.qty)
                        }
                    })
                }
            }
        }
       if(validQty){
        setValidQty(e.target.value)
            setValue(data.item_id);
            let results: any;
            let value = parseInt(e.target.value);
            setQty(value);
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
                    results = await removeItemFromCart(data.item_id);

                } else {
                    results = await updateCartItem(data.item_id, cartData);
                }
            } else {
                if (value === 0) {
                    results = await removeItemFromGuestCart(data.item_id);

                } else {
                    results = await updateGuestCartItem(data.item_id, cartData);
                }
            }
            
            if (results?.data?.message) {
                callGetCartItems()
                props.addToCartTask(true);
                notification("error", "", results?.data?.message);
            } else {
                callGetCartItems()
                props.addToCartTask(true);
                notification("success", "", intl.formatMessage({ id: "cartupdated" }));
            }
    }else{
        e.target.value = validQtyItem;
        // if(data){
        //     data.qty = validQtyItem
        // }
        let errorMsg=intl.formatMessage({id:"somethingwrong"});
        if (avalQty !== null && avalQty !== undefined){
            errorMsg = intl.formatMessage({ id: "increasedquantityerrormessage" }) + avalQty ;
        }
        else {
            errorMsg = intl.formatMessage({id: "increasedquantityerrormessageGeneral"})
        }
        notification("error", "", errorMsg);
        
    }
    }

    async function handleWhishlist(sku: any, item_id) {
        if (token) {
            setIsWishlist(sku)
            let result: any = await addWhishlistBySku(sku);
            if (result?.data?.[0]?.message) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", result?.data[0]?.message);
                handleRemove(item_id, 'whishlist')
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                callGetCartItems()
            }
        } else {
            let vendorCheck = await checkVendorLoginWishlist();
            if (vendorCheck?.type === 'vendor') {
                notification("error", "", "You are  not allowed to add products to wishlist, kindly login as a valid customer!");
                return false;
            }
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
        setProdId(pId)
        props.openGiftBoxes(pId);
        setIsGiftMessage(true)
    }
    const handleGiftRemove = async (giftId, itemId) => {
        setDelGiftMsg(itemId)
        let lang = props.languages ? props.languages : language;
        let result: any = await giftMessageDelete(giftId, itemId, lang);
        if (result?.data) {
            setDelGiftMsg(0)
            callGetCartItems()
            notification("success", "", intl.formatMessage({ id: "giftmessagedeleted" }));
        } else {
            setDelGiftMsg(0)
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }
    }
    const hideGiftModalModal = () => {
        props.openGiftBoxes(0);
        setIsGiftMessage(false)
    }
    return (
        <main>
           {cartItemsVal['items'] ?(
                <div>
                    <section className="cart-main">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-7 col-lg-8">
                                    <div className="back-block">
                                        <i className="fas fa-chevron-left back-icon"></i>
                                        <Link className="back-to-shop" to={shopPath} ><IntlMessages id="cart-back-link" /></Link>
                                    </div>
                                    <div className="my-cart-left-sec" style={{ 'opacity': opacity }}>
                                        <h2><IntlMessages id="cart.Title" /></h2>
                                        {opacity === 0.3 && (
                                            <div className="checkout-loading" >
                                                {/* <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i> */}
                                                <LoaderGif />
                                            </div>
                                        )}
                                        {(cartItemsVal['items'] && cartItemsVal['items'].length) ?
                                            (
                                                <ul className="cart-pro-list">
                                                    {cartItemsVal['items'].map((item, i) => {
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
                                                                                    {item.extension_attributes.brand && (<div className="product_name"><Link to={'/search/' + item.extension_attributes.brand + '/all'}>{item.extension_attributes.brand}</Link></div>
                                                                                    )}
                                                                                    <div className="product_vrity"><Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                                                </div>
                                                                                <div className="cart-info-r">
                                                                                    <p>{item.desc}</p>
                                                                                    <span className="off bg-favorite">
                                                                                        {!item.wishlist_item_id && (
                                                                                            <Link to="#" onClick={() => { handleWhishlist(item['sku'], item.item_id) }} className="float-end text-end">{isWishlist === item['sku'] ? "Adding....." : <IntlMessages id="cart.addWishlist" />}</Link>
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
                                                                                    <div className="col-sm-3 cartschanger">
                                                                                        <select defaultValue={value === item.item_id ? qty : item.qty} className="form-select" onChange={(e) => { handleChangeQty(e, item) }}>
                                                                                            {Array.from(Array(item.qty + 10), (e, i) => {
                                                                                                return <option value={i}
                                                                                                    key={i}>{i}</option>
                                                                                            })}

                                                                                        </select>
                                                                                    </div>
                                                                                    <div>{item['qtyErrorUI']}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="cart-pro-price">{siteConfig.currency}{formatprice(item.price)} </div>
                                                                            <div className="pro-remove-tag">
                                                                                {isShow === item.item_id ?
                                                                                    <Link to="#" className="float-end text-end" >Removing.....</Link>
                                                                                    :
                                                                                    <Link to="#" onClick={() => { handleRemove(item.item_id) }} className="float-end text-end" ><IntlMessages id="cart.remove" /></Link>
                                                                                }
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
                                                </ul>
                                            )
                                            : <p><IntlMessages id="cart.cartEmpty" /></p>
                                        }

                                        {token && (<RelevantProducts cartItem={cartRelevants} />)}
                                    </div>
                                </div>
                                <div className="col-md-5 col-lg-4" id="cartsidebar">
                                    <div className="sticky-cart">
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
                </div>
            ):
            (<div>
                <section className="cart-main">
                    <div className="container">
                        <LoaderGif />
                    </div>
                </section>
            </div>)}
        </main >
    )
}




const mapStateToProps = (state) => {
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