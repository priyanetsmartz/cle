import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import { Link } from 'react-router-dom'
import { wishListSearchSort } from '../../../redux/pages/customers';
import { formatprice, handleCartFxn } from '../../../components/utility/allutils';
import { removeWhishlist } from '../../../redux/cart/productApi';
import cartAction from "../../../redux/cart/productAction";
import IntlMessages from "../../../components/utility/intlMessages";
import Login from '../../../redux/auth/Login';
import { useIntl } from 'react-intl';
import { siteConfig } from '../../../settings';
const { addToWishlistTask, addToCartTask } = cartAction;

const loginApi = new Login();

function MyWishList(props) {
    const userGroup = props.token.token;
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup === '4') ? true : false);
    const intl = useIntl();
    const [isShow, setIsShow] = useState(0);
    const [custId, setCustid] = useState(props.token.cust_id);
    const [delWishlist, setDelWishlist] = useState(0);
    const [wishList, setWishList] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [sortOrder, setSortOrder] = useState('');
  
    const [sortValue, setSortValue] = useState({ sortBy: '', sortByValue: "" });
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
        }
    }, [props.items, props.languages, sortOrder])

    const getData = async () => {
        setLoaderOrders(true)
      //  console.log(sortValue.sortBy, sortValue.sortByValue) 
        let result: any = await wishListSearchSort(custId, pageSize, sortValue.sortBy, sortValue.sortByValue, searchName);
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
    }
 

    const filtterData = (event) => {
      //  setOpacity(0.3);
        // setCurrent(1)
        let sortBy = "";
        let sortByValue = "";
        if (event.target.value === "1") {
            sortBy = "price";
            sortByValue = "DESC";
        } else if (event.target.value === "2") {
            sortBy = "price";
            sortByValue = "ASC";
        }

        setSortOrder(event.target.value);
        setSortValue({ sortBy: sortBy, sortByValue: sortByValue })       

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
            notification("error", "", intl.formatMessage({ id: "genralerror" }));

        }
    }
    async function handleCart(id: number, sku: string) {
        setIsShow(id);
        let cartResults: any = await handleCartFxn(id, sku);
        console.log(cartResults)
        if (cartResults.item_id) {
            props.addToCartTask(true);
            notification("success", "", intl.formatMessage({ id: "addedtocart" }));
            setIsShow(0);
        } else {
           
            if (cartResults.message) {
                notification("error", "", cartResults.message);
            } else {
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
            setIsShow(0);
        }
    }
    return (
        <div className={isPriveUser ? 'prive-txt col-sm-9 my-wishlist-main' : 'col-sm-9 my-wishlist-main'}>
            <div className="row" >
                <div className="width-100 wishlist-head">
                    <h1><IntlMessages id="Profile.Wishlist-title" /></h1>
                    <h2><IntlMessages id="Profile.Wishlist-subTitle" /></h2>
                </div>
                <div className="col-md-6"></div>
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
                            <select className="form-control" aria-label="Default select example" defaultValue={sortOrder} onChange={filtterData} >
                                <option value="">{intl.formatMessage({ id: "select" })}</option>
                                <option value={1} key="1" >{intl.formatMessage({ id: "filterPriceDesc" })}</option>
                                <option value={2} key="2" >{intl.formatMessage({ id: "filterPriceAsc" })}</option>

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
                                                    <Link to={'/product-details/' + item.sku}><img src={item.img_src} alt={item.name} width="200" /></Link>
                                                    {/* need sku from api  */}
                                                    {/* <div className="cart-button mt-3 px-2"> <button onClick={() => { handleCart(item.product_id, item.sku) }} className="btn btn-primary text-uppercase">{isShow === item.id ? "Adding....." : "Add to cart"}</button></div> */}


                                                </div>
                                                <div className="wish-cart cart-button">
                                                    {isShow === parseInt(item.product_id) ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                        <Link to="#" onClick={() => { handleCart(parseInt(item.product_id), item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                                </div>
                                                <div className="wish text-left">
                                                    <h5><Link to={'/search/' + item.brand}>{item.brand}</Link></h5>
                                                    <div className="tagname"><Link to={'/product-details/' + item.sku}>{item.name}</Link></div>
                                                    {/* <div className="tagname" dangerouslySetInnerHTML={{ __html: item.description }} /> */}
                                                    <div className="pricetag">{siteConfig.currency} {formatprice(item.price)} </div>
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
        languages: state.LanguageSwitcher.language,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { addToWishlistTask, addToCartTask }
)(MyWishList);