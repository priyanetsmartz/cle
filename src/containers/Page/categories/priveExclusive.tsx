import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { getPriveExclusiveProducts } from '../../../redux/cart/productApi';
import cartAction from "../../../redux/cart/productAction";
import Slider from "react-slick";
import { formatprice, handleCartFxn } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { getCookie } from '../../../helpers/session';
import notification from "../../../components/notification";
import { useIntl } from 'react-intl';
const { addToCart, productList, addToCartTask } = cartAction;


function PriveExclusive(props) {
    const intl = useIntl();
    const [isShow, setIsShow] = useState(0);
    const location = useLocation()
    let image = '', thumbnail = '';
    const language = getCookie('currentLanguage');
    const [products, setProducts] = useState({
        items: []
    });

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        let catID = getCookie("_TESTCOOKIE");
        getData(catID, lang);
    }, [props.languages, location]);

    const getData = async (catID, lang) => {
        let result: any = await getPriveExclusiveProducts(catID, lang);
        if (result) {
            result.data.items.forEach(el => {
                if (el.attribute_code === 'image') {

                }
            })
            setProducts(result.data);
        }
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
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="DC-section-title"><IntlMessages id="category.priceExclusive" /></h2>
                        <div className="carousel slide DC-carousel">
                            <div className="carousel-inner" >
                                <Slider {...settings}>
                                    {products.items.map((item, i) => {
                                        return (
                                            <div className="carousel-item" key={i}>
                                                <div className="row">
                                                    <div className="col-md-6 product-dummy">
                                                        {
                                                            item.custom_attributes.map((attributes) => {
                                                                if (attributes.attribute_code === 'image') {
                                                                    image = attributes.value;
                                                                }
                                                                if (attributes.attribute_code === 'thumbnail') {
                                                                    thumbnail = attributes.value;
                                                                }
                                                            })
                                                        }
                                                      <Link to={'/product-details/' + item.sku}>  <img src={image} alt={item.name} /></Link>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="product-details-new">
                                                        <Link to={'/product-details/' + item.sku}>  <img src={thumbnail} alt= {item.name} /></Link>
                                                            <div className="product_name"><Link to={'/search/' + item.brand}>{item.brand}</Link></div>
                                                            <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                            <div className="product_price">{siteConfig.currency} {formatprice(item.price)}</div>
                                                            <div className="cart-button mt-3 px-2">
                                                                {isShow === item.id ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                                    <Link to="#" onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}
                                                            </div>
                                                        </div>
                                                    </div>
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
        </section >
    )
}
const mapStateToProps = (state) => {
    //  console.log(state);
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList, addToCartTask }
)(PriveExclusive);