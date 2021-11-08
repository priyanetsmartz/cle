import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import { addToCartApi, addToCartApiGuest, createGuestToken, getGuestCart } from '../../../redux/cart/productApi';
import Login from '../../../redux/auth/Login';
import cartAction from "../../../redux/cart/productAction";
import notification from '../../../components/notification';
import { siteConfig } from '../../../settings';
const { addToCartTask } = cartAction;
const loginApi = new Login();
function NewIn(props) {

    const [isShow, setIsShow] = useState(0);
    const [products, setProducts] = useState([])
    const [isHoverImage, setIsHoverImage] = useState(0);
    useEffect(() => {
        setProducts(props.newInProducts)
        return () => {
            //
        }
    }, [props.newInProducts])
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
        <section className="width-100 mb-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-title">
                            <h1><Link to='/products/new-in' ><IntlMessages id="home.newIn" /></Link></h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-slider product-listing">
                            <div className="regular slider">
                                <Slider {...settings}>
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
                    </div>
                </div>
            </div>
        </section>


    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { addToCartTask }
)(NewIn);