import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatprice } from '../../../../components/utility/allutils';
import { Link } from 'react-router-dom';
import { getCookie } from '../../../../helpers/session';
import { getCartRelevantProducts } from '../../../../redux/cart/productApi';
import IntlMessages from "../../../../components/utility/intlMessages";
import { siteConfig } from '../../../../settings';
function RelevantProducts(props) {
    const [relevs, setRelevs] = useState([]);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        getReleveantProds()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages])

    const settings = {
        dots: false,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: false,
        autoplay: true,
        autoplaySpeed: 2000,
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

    const getReleveantProds = async () => {
        //console.log(props.cartItem)
        let lang = props.languages ? props.languages : language;
        let cartItems: any = await getCartRelevantProducts(props.cartItem, lang);
        let relVData = cartItems.data;
        setRelevs(relVData[0].relevantProducts)


    }
    return (
        <>
            {(relevs && relevs.length) ? (
                <div className="also-like ">
                    <h2><IntlMessages id="youMayLike" /> </h2>
                    <div className="releveant-slider" >
                        <Slider className="regular slider" {...settings}>
                            {relevs.slice(0, 8).map((product) => {
                                return (
                                    <Link key={product.id} to={'/product-details/' + product.sku}>
                                        <div className="productcalr product" >
                                            <div className="product_img" style={{
                                                "width": "180px", "height": "192px"
                                            }} ><img src={product.img} className="image-fluid" style={{ "width": "100%" }} alt={product.name} /> </div>
                                            <div className="product_name"> {product.name} </div>
                                            <div className="product_price">{siteConfig.currency} {formatprice(product.price)}</div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </Slider>
                    </div>
                </div>
            ) : ""}
        </>
    )
}

function mapStateToProps(state) {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages,
        product: state.Cart.items

    };
};
export default connect(
    mapStateToProps,
    {}
)(RelevantProducts);