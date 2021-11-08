import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { formatprice } from '../../../components/utility/allutils';
import {
    addToCartApi,
    addToCartApiGuest,
    addWhishlist, createGuestToken, getGuestCart, getProductByCategory, getWhishlistItemsForUser, removeWhishlist
} from '../../../redux/cart/productApi';
import { useParams } from "react-router-dom";
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";
import { useLocation } from 'react-router-dom';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import Login from '../../../redux/auth/Login';
import cartAction from "../../../redux/cart/productAction";
import { siteConfig } from '../../../settings/index'
const loginApi = new Login();
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();

const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList, addToCartTask } = cartAction;

function NewIn(props) {
    const [isShow, setIsShow] = useState(0);
    const location = useLocation()
    let imageD = '', description = '';
    let catID = getCookie("_TESTCOOKIE");
    const { category, subcat } = useParams();
    const [pageSize, setPageSize] = useState(12);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [token, setToken] = useState('');
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProducts(props.ctId);

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [sortValue, page, pageSize, location, props.ctId])

    async function getProducts(catID) {
        console.log(props.ctId)
        setOpacity(0.3);
        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductByCategory(page, pageSize, catID, sortValue.sortBy, sortValue.sortByValue, props.languages);
        //  console.log(Math.ceil(result.data.total_count / 9))
        setPagination(Math.ceil(result.data.total_count / pageSize));
        let productResult = result.data.items;
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
        setOpacity(1);
        //console.log(productResult)
        props.productList(productResult);
        // get product page filter
        //let result1: any = await getProductFilter(9);
        // console.log(result1)

    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        getProducts(catID)

    }
    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        getProducts(catID)
    }

    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }
    async function handleCart(id: number, sku: string) {
        //console.log(productDetails)
        setIsShow(id);
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
            setIsShow(0);
        } else {
            notification("error", "", "Something went wrong!");
            setIsShow(0);
        }
    }

    return (
        <>
            {
                props.items.length > 0 && (
                    <div className=" container" style={{ 'opacity': opacity }}>
                        <h1 className="mb-4"><IntlMessages id="category.explore"></IntlMessages></h1>
                        <div className="row product-listing g-2">

                            {props.items.slice(0, props.items.length - 1).map(item => {
                                return (
                                    <div className="col-md-3" key={item.id}>
                                        <div className="product py-4">
                                            {token && (
                                                <span className="off bg-favorite">
                                                    {!item.wishlist_item_id && (
                                                        <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>
                                                    )}
                                                    {item.wishlist_item_id && (
                                                        <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>
                                                    )}
                                                </span>
                                            )
                                            }

                                            <div className="text-center">
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
                                                        })
                                                    }
                                                    {
                                                        isHoverImage === parseInt(item.id) ? <img src={item.media_gallery_entries.length > 2 ? `${productUrl}/${item.media_gallery_entries[1].file}` : imageD} className="image-fluid hover" alt={item.name} height="150" /> : <img src={imageD} className="image-fluid" alt={item.name} height="150" />
                                                    }
                                                </div >
                                            </div>
                                            <div className="about text-center">
                                                <h5>{item.name}</h5>
                                                <div className="tagname" dangerouslySetInnerHTML={{ __html: description }} />
                                                <div className="pricetag">{siteConfig.currency} {formatprice(item.price)}</div>
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
                                <div className="view-all-btn">
                                    {
                                        <Link to={props.urls} > <IntlMessages id="category.viewAll" /></Link>
                                    }

                                </div>
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
        languages: state.LanguageSwitcher.language
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList, addToCartTask }
)(NewIn);
