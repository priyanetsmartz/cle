import { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatprice } from '../../../../components/utility/allutils';
import { Link } from "react-router-dom";
import IntlMessages from "../../../../components/utility/intlMessages";
import { addToCartApi, addToCartApiGuest, createGuestToken, getGuestCart, getProductDetails } from '../../../../redux/cart/productApi';
import { connect } from 'react-redux';
import notification from '../../../../components/notification';
import cartAction from "../../../../redux/cart/productAction";
import Login from '../../../../redux/auth/Login';
import { getCookie } from "../../../../helpers/session";
import { siteConfig } from '../../../../settings';
const loginApi = new Login();
const { addToCartTask } = cartAction;


const Recommendations = (props) => {
    const language = getCookie('currentLanguage');
    const [isShow, setIsShow] = useState(0);
    const [recomendedProducts, setRecomendedProducts] = useState([]);
    const [slidetoshow, setSlidetoshow] = useState(4);
    // console.log(recomendedProducts)
    useEffect(() => {
        // console.log(props.recomend)
        if (props.recomend && props.recomend.length > 0) {
            getAttributes(props.recomend);
        }

        return () => {
            // mounted = false
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.recomend])

    async function getAttributes(recomends) {
        let allProducts: any;
        console.log(recomends)
        if (recomends && recomends.length > 0 && recomends[0].link_type) {
            var filteredItems = await recomends.filter(function (item) {
                return item.link_type === 'related';
            });

            allProducts = await getgidtMessageCall(filteredItems)
        } else {

            allProducts = recomends;
        }

        console.log('recomends', allProducts)
        let prods = allProducts.length > 8 ? allProducts.slice(0, 8) : allProducts;
        setSlidetoshow(prods.length)
        setRecomendedProducts(prods)
        console.log(prods)
    }
    async function getgidtMessageCall(items) {
        // console.log(items)
        const promises = [];
        items.forEach(async (i) => {
            promises.push(new Promise((resolve, reject) => {
                const res: any = someAPICall(i);
                resolve(res);
            }));
        })
        const result = await Promise.all(promises);
        return result;
    }

    async function someAPICall(product) {
        let lang = props.languages ? props.languages : language;
        let giftCall: any = await getProductDetails(product.linked_product_sku, lang);
        // console.log(giftCall.data)
        return giftCall.data;
        // return giftCall.data;
    }
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
        <div className="container">
            <div className="col-sm-12">
                {(props.recomend && props.recomend.length) ? (
                    <div className="recommendations-section text-center ">
                        <h1> <IntlMessages id="product.recommendations" /></h1>
                        <div className="new-in-slider product-listing">
                            <div className="regular slider">
                                <Slider {...settings}>
                                    {props.recomend.map((item, i) => {

                                        return (
                                            <div className="productcalr product" key={i} >
                                                <Link to={'/product-details/' + item.sku}>
                                                    <div className="product_img" >
                                                        <img src={item.img} className="image-fluid" alt={item.name} height="150" />
                                                    </div>
                                                </Link>
                                                <div className="product_name"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }} />
                                                {/* <div className="product_vrity">{item.short_description}</div> */}
                                                <div className="product_price">{siteConfig.currency}  {formatprice(item.price)}</div>
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
                    </div>) : ""}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    // console.log(state)
    let recomended = [], languages = '';
    if (state && state.Cart.recomended.length > 0) {
        recomended = state.Cart.recomended;
    }
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        recomended: recomended,
        languages: languages
    }
}
export default connect(
    mapStateToProps,
    {}
)(Recommendations);