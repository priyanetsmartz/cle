import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { formatprice, handleCartFxn } from '../../../components/utility/allutils';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import Login from '../../../redux/auth/Login';
import cartAction from "../../../redux/cart/productAction";
import notification from '../../../components/notification';
import { siteConfig } from '../../../settings';
import { useIntl } from 'react-intl';
const { addToCartTask } = cartAction;

const loginApi = new Login();
function NewIn(props) {
    const intl = useIntl();
    const [isShow, setIsShow] = useState(0);
    const [products, setProducts] = useState([])
    const [isHoverImage, setIsHoverImage] = useState(0);
    useEffect(() => {
        setProducts(props.newInProducts)
        return () => {
            //
        }
    }, [props.newInProducts,props.currentCAT])
    
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

                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,

                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,

                }
            }
        ]
    };

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

            <section className="width-100 mb-5">
                {
                    products && products.length > 0 ? (
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="new-in-title">
                                        <h1><Link to='/products/all/new-in' ><IntlMessages id="home.newIn" /></Link></h1>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="new-in-slider product-listing">
                                        <div className="regular slider">
                                            <Slider {...settings}  dir="ltr">
                                                {products && products.map(item => {
                                                    return (
                                                        <div className="productcalr product" key={item.id} >
                                                            <Link to={'/product-details/' + item.sku}>
                                                                <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                                                    onMouseLeave={() => someOtherHandler(item.id)}>
                                                                    {
                                                                        isHoverImage === parseInt(item.id) ? <img src={item.hover_image} className="image-fluid hover" alt={item.name} height="150" /> : <img src={item.img} className="image-fluid" alt={item.name} height="150" />
                                                                    }
                                                                </div>
                                                            </Link>
                                                            <div className="product_name"><Link to={'/search/' + item.brand}>{item.brand}</Link></div>
                                                            <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>                                                            
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
                        </div>) :''}
            </section>

        </>

    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items,
        currentCAT: state.Cart.catname
    }
}

export default connect(
    mapStateToProps,
    { addToCartTask }
)(NewIn);