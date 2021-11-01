import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import notification from "../../../components/notification";
import cartAction from "../../../redux/cart/productAction";
import { Link } from 'react-router-dom'
import { addToCartApi, addToCartApiGuest, addWhishlist, createGuestToken, getGuestCart, removeWhishlist } from '../../../redux/cart/productApi';
import Slider from "react-slick";
import { useLocation } from 'react-router-dom';
import { formatprice } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { getCookie } from '../../../helpers/session';
import Login from '../../../redux/auth/Login';
const loginApi = new Login();
const { addToCart, productList, addToCartTask } = cartAction;

function WeChooseForYou(props) {
    const [token, setToken] = useState('');
    // console.log(props.choosenData)
    let catID = getCookie("_TESTCOOKIE");
    const location = useLocation()
    const [isShow, setIsShow] = useState(0);
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [products, setProducts] = useState([]);

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

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        setProducts(props.choosenData)
    }, [props.languages, location, props.choosenData]);

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
    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        // getProducts()

    }

    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        // getProducts()
    }
    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }
    return (
        <div>
            {
                (props.choosenData && props.choosenData.length > 0) && (
                    <section className="width-100 my-5 choose-foryou-sec">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="new-in-title">
                                        <h1><IntlMessages id="home.weChooseForYou" /></h1>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="new-in-slider product-listing">
                                        <div className="regular slider">
                                            <Slider {...settings}>
                                                {props.choosenData.map((item, i) => {
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
                                                            <div className="product_name mt-2">  <Link to={'/product-details/' + item.sku}>{item.name} </Link></div>
                                                            <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }}></div>
                                                            <div className="product_price">{siteConfig.currency} {formatprice(item.price)}</div>
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

                        </div>
                    </section>
                )
            }
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList, addToCartTask }
)(WeChooseForYou);