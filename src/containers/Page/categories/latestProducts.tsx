import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist,
    addToCartApi, getProductFilter, createGuestToken, getGuestCart, addToCartApiGuest
} from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import { getCookie, setCookie } from '../../../helpers/session';
import cartAction from "../../../redux/cart/productAction";
import WeChooseForYou from '../home/weChooseForYou';
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import IntlMessages from "../../../components/utility/intlMessages";
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import { useLocation } from 'react-router-dom';
import { getWeChooseForYou } from '../../../redux/pages/customers';
import Login from '../../../redux/auth/Login';
import { siteConfig } from '../../../settings/index'
const loginApi = new Login();
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList, addToCartTask } = cartAction;


function LatestProducts(props) {
    let catID = getCookie("_TESTCOOKIE");
    const [isShow, setIsShow] = useState(0);
    const [choosen, setChoose] = useState([]);
    let imageD = '', description = '', hoverImage = '';
    const location = useLocation()
    let customer_id = localStorage.getItem('cust_id');
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [productsLatest, setProductsLatest] = useState([]);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);
    const language = getCookie('currentLanguage');
    const relevantCookies = getCookie("relevant");
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4, responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            }
        ]
    };

    useEffect(() => {
        getProducts(props.ctId);

    }, [location, props.ctId]);

    async function getProducts(catID) {
        setOpacity(0.3);
        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductByCategory(1, 4, catID, sortValue.sortBy, sortValue.sortByValue, props.languages);

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
        setProductsLatest(productResult);
        if (customerId) {
            let result1: any = await getWeChooseForYou(props.languages, customerId);

            if (result1 && result1.data && result1.data[0] && result1.data[0].customerProducts.length > 0) {
                setCookie("relevant", true)
                setChoose(result1.data[0].customerProducts);
            } else {
                setCookie("relevant", false)
            }

        } else {
            setCookie("relevant", false)
        }
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

    const changeImg = (e, item, type) => {
        item.custom_attributes.forEach(el => {
            if (el.attribute_code == "thumbnail" && type) {
                e.target.src = el.value;
            }
            if (el.attribute_code == "image" && !type) {
                e.target.src = el.value;
            }
        })
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
        <section className="exclusive-tab">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ul className="nav nav-tabs justify-content-center" id="DesignerTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <Link to="#" className="nav-link active" id="PD-tab" data-bs-toggle="tab" data-bs-target="#PD" type="button"
                                    role="tab" aria-controls="PD" aria-selected="true"><IntlMessages id="category.latestProducts" /></Link>
                            </li>
                            {
                                (customer_id && relevantCookies) && (
                                    <li className="nav-item" role="presentation">
                                        <Link to="#" className="nav-link" id="D-maylike-tab" data-bs-toggle="tab" data-bs-target="#D-maylike" type="button"
                                            role="tab" aria-controls="D-maylike" aria-selected="false"><IntlMessages id="home.weChooseForYou" /></Link>
                                    </li>
                                )
                            }

                        </ul>
                        <div className="tab-content" id="DesignerTabContent" style={{ 'opacity': opacity }}>
                            {productsLatest.length > 0 && (
                                <div className="tab-pane fade show active" id="PD" role="tabpanel" aria-labelledby="PD-tab">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="new-in-slider">
                                                <div className="regular  product-listing slider">
                                                    <Slider {...settings}>
                                                        {productsLatest.map(item => {
                                                            return (

                                                                <div className="productcalr product" key={item.id} >
                                                                    <span className="off bg-favorite">
                                                                        {!item.wishlist_item_id && (
                                                                            <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>
                                                                        )}
                                                                        {item.wishlist_item_id && (
                                                                            <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>
                                                                        )}
                                                                    </span>
                                                                    <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                                                        onMouseLeave={() => someOtherHandler(item.id)}>

                                                                        {
                                                                            item.custom_attributes.map((attributes) => {
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

                                                                    <div className="product_name"> {item.name} </div>
                                                                    <div className="product_vrity" dangerouslySetInnerHTML={{ __html: description }} />
                                                                    {/* <div className="product_vrity">{item.short_description}</div> */}
                                                                    <div className="product_price"> {siteConfig.currency} {formatprice(item.price)}</div>
                                                                    <div className="cart-button mt-3 px-2">
                                                                        {isShow === item.id ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                                            <Link to="#" onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                                                    </div>

                                                                </div >

                                                            )
                                                        })}
                                                    </Slider >
                                                </div >
                                            </div >
                                        </div >
                                    </div >
                                </div >
                            )}
                            {
                                (customer_id && relevantCookies) && (
                                    <div className="tab-pane fade" id="D-maylike" role="tabpanel" aria-labelledby="D-maylike-tab">
                                        <div className="row">
                                            <WeChooseForYou choosenData={choosen} />
                                        </div>
                                    </div>
                                )
                            }
                        </div >
                    </div >
                </div >
            </div >
        </section >
    )
}

const mapStateToProps = (state) => {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        items: state.Cart.items,
        languages: languages
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList, addToCartTask }
)(LatestProducts);