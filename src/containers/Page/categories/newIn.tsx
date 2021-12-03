import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { formatprice, handleCartFxn } from '../../../components/utility/allutils';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist
} from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";
import { useLocation } from 'react-router-dom';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";

import appAction from "../../../redux/app/actions";
import cartAction from "../../../redux/cart/productAction";
import { siteConfig } from '../../../settings/index';
import { useIntl } from 'react-intl';
const { showSignin } = appAction;
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();

const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList, addToCartTask, addToWishlistTask } = cartAction;

function NewIn(props) {
    const intl = useIntl();
    const [isShow, setIsShow] = useState(0);
    const location = useLocation()
    let imageD = '', description = '', brand = '';
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [isHoverImage, setIsHoverImage] = useState(0);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        const localToken = props.token.token;
        setToken(localToken)
        getProducts(props.ctId);

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [location, props.ctId, props.token])

    async function getProducts(catID) {
        // console.log(props.ctId)
        setOpacity(0.3);
        let customer_id = props.token.cust_id;
        let result: any = await getProductByCategory(1, siteConfig.pageSize, catID, 'created_at', 'DESC', props.languages);
        let productResult = result && result.data && result.data.items ? result.data.items : {};

        if (customer_id) {
            let whishlist: any = await getWhishlistItemsForUser();
            let products = result.data.items;
            let WhishlistData = whishlist.data;
            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                    ...itm
                }));

            productResult = mergeById(products, WhishlistData);

        }
        setProducts(productResult);
        setOpacity(1);

    }

    async function handleWhishlist(id: number) {
        if (token) {
            setIsWishlist(id)
            let result: any = await addWhishlist(id);
            if (result.data) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", intl.formatMessage({ id: "addedtowishlist" }));
                getProducts(props.ctId);
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                getProducts(props.ctId);
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
            getProducts(props.ctId)
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            getProducts(props.ctId)
        }
    }

    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }

    async function handleCart(id: number, sku: string) {
        setIsShow(id);
        let cartResults: any = await handleCartFxn(id, sku);
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
        <>
            {
                products.length > 0 && (
                    <div className=" container" style={{ 'opacity': opacity }}>
                        <h1 className="mb-4 text-center"><IntlMessages id="category.explore"></IntlMessages></h1>
                        <div className="row product-listing plp-listing g-2">

                            {products.slice(0, products.length > 1 ? products.length - 1 : products.length - 0).map(item => {
                                return (
                                    <div className="col-md-3" key={item.id}>
                                        <div className="product py-4">
                                            <span className="off bg-favorite">
                                                {!item.wishlist_item_id && (
                                                    <div>{isWishlist === item.id ? <i className="fas fa-circle-notch fa-spin"></i> : <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>}
                                                    </div>
                                                )}
                                                {item.wishlist_item_id && (
                                                    <div>{delWishlist === parseInt(item.wishlist_item_id) ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>}
                                                    </div>
                                                )}
                                            </span>

                                            <div className="text-center">
                                                <Link to={'/product-details/' + item.sku}>
                                                    <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                                        onMouseLeave={() => someOtherHandler(item.id)}>

                                                        {
                                                            item.custom_attributes && item.custom_attributes.length > 0 && item.custom_attributes.map((attributes) => {
                                                                if (attributes.attribute_code === 'image') {
                                                                    imageD = attributes.value;
                                                                }
                                                                if (attributes.attribute_code === 'short_description') {
                                                                    description = attributes.value;
                                                                }
                                                                if (attributes.attribute_code === 'brand') {
                                                                    brand = attributes.value;
                                                                }
                                                            })
                                                        }
                                                        {
                                                            isHoverImage === parseInt(item.id) ? <img src={item.media_gallery_entries && item.media_gallery_entries.length > 2 ? `${productUrl}/${item.media_gallery_entries[1].file}` : imageD} className="image-fluid hover" alt={item.name} height="150" /> : <img src={imageD} className="image-fluid" alt={item.name} height="150" />
                                                        }
                                                    </div >
                                                </Link>
                                            </div>
                                            <div className="about text-center">
                                                <div className="product_name"><Link to={'/search/' + brand}>{brand}</Link></div>
                                                <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                <div className="pricetag"> {siteConfig.currency} {formatprice(item.price)}</div>
                                            </div>
                                            {/* {token && ( */}
                                            <div className="cart-button mt-3 px-2">
                                                {isShow === item.id ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                    <Link to="#" onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                            </div>
                                            {/* )} */}
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="col-md-3">
                                <Link to={props.urls} className="view-all-btn" >
                                    <IntlMessages id="category.viewAll" />
                                </Link>
                            </div>

                        </div>
                    </div >
                )
            }
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items,
        languages: state.LanguageSwitcher.language,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList, addToCartTask, showSignin, addToWishlistTask }
)(NewIn);
