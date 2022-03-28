import { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatprice, handleCartFxn, logoutUser } from '../../../../components/utility/allutils';
import { Link } from "react-router-dom";
import IntlMessages from "../../../../components/utility/intlMessages";
import { getProductDetails } from '../../../../redux/cart/productApi';
import { connect } from 'react-redux';
import notification from '../../../../components/notification';
import cartAction from "../../../../redux/cart/productAction";
import appAction from "../../../../redux/app/actions";
import { getCookie } from "../../../../helpers/session";
import { siteConfig } from '../../../../settings';
import { useIntl } from 'react-intl';
const { addToCartTask } = cartAction;
const { showSignin } = appAction;

const Recommendations = (props) => {
    const intl = useIntl();
    const language = getCookie('currentLanguage');
    const [isShow, setIsShow] = useState(0);
    const [recomendedProducts, setRecomendedProducts] = useState([]);
    const [slidetoshow, setSlidetoshow] = useState(4);

    useEffect(() => {

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

        if (recomends && recomends.length > 0 && recomends[0].link_type) {
            var filteredItems = await recomends.filter(function (item) {
                return item.link_type === 'related';
            });

            allProducts = await getgidtMessageCall(filteredItems)
        } else {

            allProducts = recomends;
        }


        let prods = allProducts.length > 8 ? allProducts.slice(0, 8) : allProducts;
        setSlidetoshow(prods.length)
        setRecomendedProducts(prods)

    }
    async function getgidtMessageCall(items) {

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

        return giftCall.data;

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
        setIsShow(id);
        let cartResults: any = await handleCartFxn(id, sku);
        if (cartResults.item_id) {
            props.addToCartTask(true);
            notification("success", "", intl.formatMessage({ id: "addedtocart" }));
            setIsShow(0);
        } else {
            if (cartResults?.message === "The consumer isn't authorized to access %resources.") {
                notification("error", "", "Session expired!");
                setTimeout(() => {
                    logoutUser()
                    props.showSignin(true)
                }, 2000)
            } else if (cartResults.message) {
                notification("error", "", cartResults.message);
            } else {
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
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
                                                <div className="product_name"><Link to={'/search/' + item.brand +'/all' }>{item.brand}</Link></div>
                                                <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
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
    { addToCartTask, showSignin }
)(Recommendations);