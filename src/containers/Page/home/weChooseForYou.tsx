import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import notification from "../../../components/notification";
import cartAction from "../../../redux/cart/productAction";
import { Link } from 'react-router-dom';
import appAction from "../../../redux/app/actions";
import { addWhishlist, getWhishlistItemsForUser, removeWhishlist } from '../../../redux/cart/productApi';
import Slider from "react-slick";
import { formatprice, handleCartFxn } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import { getWeChooseForYou } from '../../../redux/pages/customers';

const { addToCart, productList, addToCartTask, addToWishlistTask } = cartAction;
const { showSignin } = appAction;


function WeChooseForYou(props) {
    const intl = useIntl();
    const [isShow, setIsShow] = useState(0);
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);  
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let customerId = props.token.cust_id;
        if (customerId) {
            getData();
        }
        return () => {

        };
    }, [props.languages, props.token]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
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
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

   

    const getData = async () => {
        let customerId=  props.token.cust_id
        let result: any = await getWeChooseForYou(props.languages, customerId);
        if (result && result.data && result.data[0] && result.data[0].customerProducts.length > 0) {
           // setCookie("relevant", true)

            let whishlist: any = await getgidtMessageCall();
            let products = result.data[0].customerProducts;

            const mergeById = (a1, a2) =>
                a1.length > 0 && a1.map(itm => ({
                    ...a2.find((item) => (parseInt(item.id) === parseInt(itm.id)) && item),
                    ...itm
                }));
            let productResult = await mergeById(products, whishlist);
            
            setProducts(productResult);
        } else {
           // setCookie("relevant", false)
        }
    }
    async function getgidtMessageCall() {
        let whishlist: any = await getWhishlistItemsForUser();
        let WhishlistData = whishlist.data;

        return WhishlistData;
    }


    async function handleCart(id: number, sku: string) {
        setIsShow(id);
        let cartResults: any = await handleCartFxn(id, sku);
        if (cartResults.item_id) {
            props.addToCartTask(true);
            getData();
            notification("success", "", intl.formatMessage({ id: "addedtocart" }));
            setIsShow(0);
        } else {           
            if (cartResults.message) {
                getData();
                notification("error", "", cartResults.message);
            } else {
                getData();
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
            setIsShow(0);
        }
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
                notification("success", "", intl.formatMessage({ id: "addedToWhishlist" }));
                getData()
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                getData()
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
            getData()
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            getData()
        }
    }
    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }

    const handlesigninClick = (e) => {
        e.preventDefault();
        props.showSignin(true);
    }

    return (
        <div>
            <section className="width-100 my-5 choose-foryou-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="new-in-title">
                                <h1><IntlMessages id="home.weChooseForYou" /></h1>
                            </div>
                        </div>
                    </div>
                    {
                        (products && products.length > 0) ? (
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="new-in-slider product-listing">
                                        <div className="regular slider">
                                            <Slider {...settings}>
                                                {products.map((item, i) => {
                                                    return (
                                                        <div className="productcalr product" key={item.id}>
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
                                                            <Link to={'/product-details/' + item.sku}> <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                                                onMouseLeave={() => someOtherHandler(item.id)}>
                                                                {
                                                                    isHoverImage === parseInt(item.id) ? <img src={item.hover_image} className="image-fluid hover" alt={item.name} /> : <img src={item.img} className="image-fluid" alt={item.name} />
                                                                }

                                                            </div></Link>
                                                            <div className="product_name  mt-2"><Link to={'/search/' + item.brand}>{item.brand}</Link></div>
                                                            <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                            {/* <div className="product_name mt-2">  <Link to={'/product-details/' + item.sku}>{item.name} </Link></div>
                                                            <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }}></div> */}
                                                            <div className="product_price">{siteConfig.currency}{formatprice(item.price)} </div>
                                                            <div className="cart-button mt-3 px-2">
                                                                {isShow === item.id ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                                    <Link to="#" onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </Slider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : props.token.cust_id ?
                            <div className="white-text">  <IntlMessages id="wechoose-profile" /> <div className='newsign'><Link to="/customer/profile" className="btn" type="button" ><IntlMessages id="wechoose-profile-btn" /></Link></div> </div> :

                            <div className="white-text">   <IntlMessages id="wechoose-login" /><div className='newsign'><button className="btn" type="button" onClick={(e) => { handlesigninClick(e); }} ><IntlMessages id="menu_Sign_in" /></button></div> </div>
                    }
                </div>
            </section>
        </div>
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
)(WeChooseForYou);