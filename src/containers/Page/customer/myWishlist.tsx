import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import { Link } from 'react-router-dom'
import { wishListSearchSort } from '../../../redux/pages/customers';
import { formatprice } from '../../../components/utility/allutils';
import { addToCartApi, addToCartApiGuest, createGuestToken, getGuestCart, removeWhishlist } from '../../../redux/cart/productApi';
import cartAction from "../../../redux/cart/productAction";
import IntlMessages from "../../../components/utility/intlMessages";
import Login from '../../../redux/auth/Login';
import { useIntl } from 'react-intl';
import { siteConfig } from '../../../settings';
const { addToWishlistTask, addToCartTask } = cartAction;

const loginApi = new Login();

function MyWishList(props) {
    const intl = useIntl();
    const [isShow, setIsShow] = useState(false);
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [delWishlist, setDelWishlist] = useState(0);
    const [wishList, setWishList] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('price');
    const [pageSize, setPageSize] = useState(10);
    const [loaderOrders, setLoaderOrders] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (props.items || !props.items) {
            //   console.log(props.items)
            getData();
        }

        return () => {
            props.addToWishlistTask(false);
            setSearchName('')
            setWishList([])
            setSortOrder('')
            setDelWishlist(0)
            setSortBy('asc')
        }
    }, [props.items, props.languages])

    const getData = async () => {
        setLoaderOrders(true)
        let result: any = await wishListSearchSort(custId, pageSize, sortOrder, sortBy, searchName);
        if (result.data) {
            setWishList(result.data);
            setOpacity(1)
            setLoaderOrders(false)
        } else {
            setOpacity(1)
            setLoaderOrders(false)
        }

    }
    const searchHandler = (e) => {
        setOpacity(0.3)
        //   console.log(e.target.value.length)
        if (e.target.value && e.target.value.length >= 3) {
            setSearchName(e.target.value);
            getData();
        } else if (e.target.value.length === 0) {
            setSearchName(e.target.value);
            getData();
        } else {
            setSearchName(e.target.value);
            getData();

        }

        //  console.log(e.target.value)

    }

    const sortHandler = (e) => {
        setSortOrder(e.target.value);
        setSortBy('price')
        getData();
    }

    async function handleDelWhishlist(id: number) {
        setDelWishlist(id)
        let del: any = await removeWhishlist(id);
        if (del.data[0].message) {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            getData()
            notification("success", "", del.data[0].message);
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            getData()
            notification("error", "", "Something went wrong!");

        }
    }
    async function handleCart(id: number, sku: string) {
        //console.log(productDetails)
        setIsShow(true);
        let cartData = {};
        let cartSucces: any;
        let cartQuoteId = '';
        let customer_id = localStorage.getItem('cust_id');
        let cartQuoteIdLocal = localStorage.getItem('cartQuoteId');
        //console.log(cartQuoteIdLocal)
        if (cartQuoteIdLocal || customer_id) {
            let customerCart: any = await loginApi.genCartQuoteID(customer_id)
            cartQuoteId = cartQuoteIdLocal
            if (customerCart.data !== parseInt(cartQuoteIdLocal)) {
                cartQuoteId = customerCart.data;
            }
        } else {

            let guestToken: any = await createGuestToken();
            localStorage.setItem('cartQuoteToken', guestToken.data);
            let result: any = await getGuestCart();
            cartQuoteId = result.data.id
        }
        localStorage.setItem('cartQuoteId', cartQuoteId);
        cartData = {
            "cartItem": {
                "sku": sku,
                "qty": 1,
                "quote_id": cartQuoteId
            }
        }


        if (customer_id) {
            cartSucces = await addToCartApi(cartData)
        } else {
            cartSucces = await addToCartApiGuest(cartData)
        }
        if (cartSucces.data.item_id) {
            props.addToCartTask(true);
            notification("success", "", "Item added to cart!");
            setIsShow(false);
        } else {
            notification("error", "", "Something went wrong!");
            setIsShow(false);
        }
    }
    return (
        <div className="col-sm-9 my-wishlist-main">
            <div className="row" >
                <div className="width-100 wishlist-head">
                    <h1><IntlMessages id="Profile.Wishlist-title" /></h1>
                    <h2><IntlMessages id="Profile.Wishlist-subTitle" /></h2>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchName}
                                onChange={searchHandler}
                            />
                        </div>
                        <div className="col-md-6">
                            <select value={sortOrder} onChange={sortHandler} className="form-control">
                                <option value="">{intl.formatMessage({ id: "select" })}</option>
                                <option value="asc">{intl.formatMessage({ id: "filterPriceAsc" })}</option>
                                <option value="desc">{intl.formatMessage({ id: "filterPriceDesc" })}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="product-listing" style={{ 'opacity': opacity }} >
                    <div className="row g-2">
                        {loaderOrders && (
                            <div className="checkout-loading" >
                                <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                            </div>
                        )}
                        {wishList.length > 0 ?
                            <>
                                {wishList && wishList.map(item => {
                                    return (
                                        <div className="col-md-4 position-relative" key={item.product_id}>
                                            <span onClick={() => handleDelWhishlist(item.wishlist_item_id)} className="bg-remove">{delWishlist === item.wishlist_item_id ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-times" aria-hidden="true"></i>}</span>
                                            <div className="product p-4">
                                                <div className="text-center">
                                                    <img src={item.img_src} alt={item.name} width="200" />
                                                    {/* need sku from api  */}
                                                    {/* <div className="cart-button mt-3 px-2"> <button onClick={() => { handleCart(item.product_id, item.sku) }} className="btn btn-primary text-uppercase">{isShow === item.id ? "Adding....." : "Add to cart"}</button></div> */}
                                                    <div className="cart-button mt-3 px-2">
                                                        <Link to="#" style={{ "display": !isShow ? "inline-block" : "none" }} onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>
                                                        <Link to="#" style={{ "display": isShow ? "inline-block" : "none" }} className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link>
                                                    </div>
                                                </div>
                                                <div className="about text-center">
                                                    <h5>{item.name}</h5>
                                                    <div className="tagname" dangerouslySetInnerHTML={{ __html: item.description }} />
                                                    <div className="pricetag">{siteConfig.currency} {formatprice(item.price)}</div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                            : !loaderOrders ? <IntlMessages id="no_data" /> : ""}
                    </div>
                </div>

            </div>

        </div>

    );
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.addToWishlist,
        languages: state.LanguageSwitcher.language
    }
}

export default connect(
    mapStateToProps,
    { addToWishlistTask, addToCartTask }
)(MyWishList);