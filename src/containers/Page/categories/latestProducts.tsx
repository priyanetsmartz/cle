import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist
} from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import cartAction from "../../../redux/cart/productAction";
import WeChooseForYou from '../home/weChooseForYou';
import { Link } from "react-router-dom";
import appAction from "../../../redux/app/actions";
import Slider from "react-slick";
import { formatprice, handleCartFxn } from '../../../components/utility/allutils';
import IntlMessages from "../../../components/utility/intlMessages";
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Login from '../../../redux/auth/Login';
import { siteConfig } from '../../../settings/index';
const { showSignin } = appAction;
const loginApi = new Login();
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList, addToCartTask, addToWishlistTask } = cartAction;


function LatestProducts(props) {
    const intl = useIntl();
    const [isShow, setIsShow] = useState(0);
    let imageD = '', description = '', hoverImage = '', brand = '';
    const location = useLocation()
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [productsLatest, setProductsLatest] = useState([]);
    const [isWishlist, setIsWishlist] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const language = getCookie('currentLanguage');

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
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false
                }
            }
        ]
    };

    useEffect(() => {
        getProducts(props.ctId);

    }, [location, props.ctId]);

    async function getProducts(catID) {
        setOpacity(0.3);
        let customer_id = props.token.cust_id;
        let result: any = await getProductByCategory(1, 4, catID, 'created_at', 'DESC', props.languages);

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
        setProductsLatest(productResult);
        setOpacity(1);
    }

    async function handleWhishlist(id: number) {
        const token = props.token.token;
        if (token) {
            setIsWishlist(id)
            let result: any = await addWhishlist(id);
            //     console.log(result);
            if (result.data) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", intl.formatMessage({ id: "addedtowishlist" }));
                getProducts(props.ctId)
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                getProducts(props.ctId)
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

    const changeImg = (e, item, type) => {
        item.custom_attributes.forEach(el => {
            if (el.attribute_code === "thumbnail" && type) {
                e.target.src = el.value;
            }
            if (el.attribute_code === "image" && !type) {
                e.target.src = el.value;
            }
        })
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
        <section className="exclusive-tab">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ul className="nav nav-tabs justify-content-center" id="DesignerTab" role="tablist">

                            <li className="nav-item" role="presentation">
                                <Link to="#" className="nav-link active" id="PD-tab" data-bs-toggle="tab" data-bs-target="#PD" type="button"
                                    role="tab" aria-controls="PD" aria-selected="true"><IntlMessages id="category.latestProducts" /></Link>
                            </li>


                            <li className="nav-item" role="presentation">
                                <Link to="#" className="nav-link" id="D-maylike-tab" data-bs-toggle="tab" data-bs-target="#D-maylike" type="button"
                                    role="tab" aria-controls="D-maylike" aria-selected="false"><IntlMessages id="home.weChooseForYou" /></Link>
                            </li>
                        </ul>
                        <div className="tab-content" id="DesignerTabContent" style={{ 'opacity': opacity }}>
                            <div className="tab-pane fade show active" id="PD" role="tabpanel" aria-labelledby="PD-tab">
                                {productsLatest.length > 0 ? (
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
                                                                            <div>{isWishlist === item.id ? <i className="fas fa-circle-notch fa-spin"></i> : <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>}
                                                                            </div>
                                                                        )}
                                                                        {item.wishlist_item_id && (
                                                                            <div>{delWishlist === parseInt(item.wishlist_item_id) ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>}
                                                                            </div>
                                                                        )}
                                                                    </span>
                                                                    <Link to={'/product-details/' + item.sku}>
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

                                                                                    if (attributes.attribute_code === 'brand') {
                                                                                        brand = attributes.value;
                                                                                    }
                                                                                })
                                                                            }
                                                                            {
                                                                                isHoverImage === parseInt(item.id) ? <img src={item.media_gallery_entries.length > 2 ? `${productUrl}/${item.media_gallery_entries[1].file}` : imageD} className="image-fluid hover" alt={item.name} height="150" /> : <img src={imageD} className="image-fluid" alt={item.name} height="150" />
                                                                            }
                                                                        </div >
                                                                    </Link>
                                                                    <div className="product_name"><Link to={'/search/' + brand}>{brand}</Link></div>
                                                                    <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                                    {/* <div className="product_vrity">{item.short_description}</div> */}
                                                                    <div className="product_price">{siteConfig.currency} {formatprice(item.price)}</div>
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

                                ) : <p className="no-data"><IntlMessages id="no_data" /></p>}
                            </div >

                            <div className="tab-pane fade" id="D-maylike" role="tabpanel" aria-labelledby="D-maylike-tab">
                                <div className="row">
                                    <WeChooseForYou />
                                </div>
                            </div>
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
        languages: languages,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList, addToCartTask, showSignin, addToWishlistTask }
)(LatestProducts);